/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from "@/services/axiosClient";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Search, ArrowLeft, Check, ChevronsUpDown } from "lucide-react";
import { uploadFile } from "../services/fileUploadService";
import { useAuth } from "@/contexts/AuthContext";
import { showSuccess, showError, showConfirm } from "@/utils/alert";
import * as apiService from "../services/apiEndpoints";
import { toast } from "sonner";
import { useCreateComplaint, useGetRegions } from "@/hooks/useApiQuery";

export default function NewComplaint() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [customerData, setCustomerData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { createComplaint, isPending: submitting } = useCreateComplaint(() => {
    resetSearch();
  });

  const [priorities, setPriorities] = useState<any[]>([]);
  const [source, setsource] = useState<any[]>([]);
  const [complaintTypes, setComplaintTypes] = useState<any[]>([]);
  const [filteredSubtypes, setFilteredSubtypes] = useState<any[]>([]);
  const [regionalMembers, setRegionalMembers] = useState<IEmployee[]>([]);
  const [openAssign, setOpenAssign] = useState(false);

  const { user, token } = useAuth();
  const { allRegions } = useGetRegions();
  const regions = allRegions?.data ?? [];

  const [isNoAccountModalOpen, setIsNoAccountModalOpen] = useState(false);
  const [noAccountFormData, setNoAccountFormData] = useState({
    complaintTypeId: "",
    complaintSubTypeId: "",
    source: "",
    priority: "",
    email: "",
    departmentId: "",
    mobileNumber: "",
    remark: "",
    type: "PREPAID",
    address: "",
    regionId: "",
    customerName: "",
  });
  const [noAccountSubtypes, setNoAccountSubtypes] = useState<any[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    complaintTypeId: "",
    complaintSubTypeId: "",
    source: "",
    priority: "",
    email: "",
    mobileNumber: "",
    departmentId: "",
    correctMeterReading: 0,
    remark: "",
    file: "",
    mediaLink: "",
    assignToStaffId: "",
    assignToEmail: "",
    assignTo: "",
  });

  const handleAttachmentUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadFile({
        file,
        uploadedBy: user.userName,
      });

      setFormData((prev) => ({
        ...prev,
        file: result.filePath,
        mediaLink: result.fileUrl,
      }));

      showSuccess("Upload Added Successfully");
    } catch (error) {
      console.error("Upload error:", error);
      showError("Failed to upload file");

      if (fileInputRef.current) fileInputRef.current.value = "";

      setFormData((prev) => ({ ...prev, file: "", mediaLink: "" }));
    }
  };

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [prioritiesRes, typesRes, sourceRes] = await Promise.all([
          axiosClient.get(`configuration/priority`),
          axiosClient.get(`configuration/complaint-types-and-sub`),
          axiosClient.get(`configuration/sources`),
        ]);

        setPriorities(prioritiesRes.data.data || []);
        setComplaintTypes(typesRes.data.data || []);
        setsource(sourceRes.data.data || []);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };

    fetchDropdownData();
  }, []);

  const noAccountMutation = useMutation({
    mutationFn: (payload: any) =>
      apiService.CreateComplaintWithoutAccount(payload, token),
    onSuccess: (response: any) => {
      setIsNoAccountModalOpen(false);
      showSuccess(response?.data || "Complaint created successfully");
      setNoAccountFormData({
        complaintTypeId: "",
        complaintSubTypeId: "",
        source: "",
        priority: "",
        email: "",
        departmentId: "",
        mobileNumber: "",
        remark: "",
        type: "PREPAID",
        address: "",
        regionId: "",
        customerName: "",
      });
      setNoAccountSubtypes([]);
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to create complaint", {
        id: "no-account-error",
      });
    },
  });

  const handleNoAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    noAccountMutation.mutate(noAccountFormData);
  };

  useEffect(() => {
    if (formData.complaintTypeId) {
      const selectedType = complaintTypes.find(
        (type) => type.id === formData.complaintTypeId
      );
      setFilteredSubtypes(selectedType?.subTypes || []);
      setFormData((prev) => ({ ...prev, complaintSubTypeId: "" }));
    } else {
      setFilteredSubtypes([]);
    }
  }, [formData.complaintTypeId, complaintTypes]);

  // FIX: Accept subtypeId param to avoid stale closure on formData
  const onGetRegionalStaffs = async (subtypeId?: string) => {
    const accountNumber = customerData.accountNo;
    const deptId = formData.departmentId;
    const resolvedSubtypeId = subtypeId ?? formData.complaintSubTypeId;
    const regionId = customerData.regionId || "";

    if (!deptId || !resolvedSubtypeId) return;

    try {
      const regionalMembersResponse =
        await apiService.GetRegionalDepartmentMembers(
          deptId,
          accountNumber,
          regionId
        );

      if (regionalMembersResponse.status === "success") {
        setRegionalMembers(regionalMembersResponse.data);
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to fetch Assigned details", {
        id: "fetch-assignee",
      });
    }
  };

  const searchCustomer = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const { data } = await axiosClient.get(`customer/search-filter`, {
        params: {
          ConsumerName: searchQuery,
          ConsumerNumber: searchQuery,
          MeterNumber: searchQuery,
          MobileNumber: searchQuery,
          PrevTicketNumber: searchQuery,
        },
      });

      if (data.status === "success" && data.data?.length) {
        if (data.data.length === 1) {
          setCustomerData(mapCustomerData(data.data[0]));
          setSearchResults([]);
        } else {
          setSearchResults(data.data);
          setCustomerData(null);
        }
      } else {
        showError("No customer records found");
        setSearchResults([]);
        setCustomerData(null);
      }
    } catch (error) {
      console.error("Search error:", error);
      showError("Error searching customer");
    } finally {
      setLoading(false);
    }
  };

  const mapCustomerData = (raw: any) => ({
    accountNo: raw.conS_ACC,
    meterNo: raw.conS_METERNO,
    name: raw.conS_NAME,
    address: raw.address,
    phone: raw.conS_TELEPHONENO || "N/A",
    email: raw.coN_EMAILID || "N/A",
    tariffClass: raw.conS_TYPE,
    status: raw.status,
    maxDemand: raw.coN_MAXDEMAND,
    ibc: raw.ibc,
    bsc: raw.bsc,
    regionId: raw.regionId || raw.region_Id,
  });

  const selectCustomer = (customer: any) => {
    setCustomerData(mapCustomerData(customer));
    setSearchResults([]);
  };

  const resetSearch = () => {
    setCustomerData(null);
    setSearchResults([]);
    setSearchQuery("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    setFormData({
      complaintTypeId: "",
      complaintSubTypeId: "",
      source: "",
      priority: "",
      email: "",
      mobileNumber: "",
      departmentId: "",
      correctMeterReading: 0,
      remark: "",
      file: "",
      mediaLink: "",
      assignToEmail: "",
      assignToStaffId: "",
      assignTo: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.complaintSubTypeId ||
      !formData.departmentId ||
      !formData.complaintTypeId ||
      !formData.priority ||
      !formData.mobileNumber ||
      !formData.email
    ) {
      showError("Please fill all required fields");
      return;
    }

    try {
      const payload = {
        consumerNumber: customerData.accountNo,
        complaintTypeId: formData.complaintTypeId,
        complaintSubTypeId: formData.complaintSubTypeId,
        source: formData.source,
        priority: formData.priority,
        email: formData.email,
        departmentId: formData.departmentId,
        mobileNumber: formData.mobileNumber,
        correctMeterReading: formData.correctMeterReading,
        remark: formData.remark,
        file: formData.file,
        mediaLink: formData.mediaLink,
        assignToStaffId: formData.assignToStaffId,
        assignToEmail: formData.assignToEmail,
        regionId: customerData.regionId,
      };

      createComplaint(payload);
    } catch (error) {
      console.error("Error creating ticket:", error);
      showError("Error creating ticket");
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* NO ACCOUNT MODAL */}
      <Dialog
        open={isNoAccountModalOpen}
        onOpenChange={setIsNoAccountModalOpen}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Complaint (No Account)</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleNoAccountSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Customer Name *</Label>
                <Input
                  value={noAccountFormData.customerName}
                  onChange={(e) =>
                    setNoAccountFormData({
                      ...noAccountFormData,
                      customerName: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={noAccountFormData.email}
                  onChange={(e) =>
                    setNoAccountFormData({
                      ...noAccountFormData,
                      email: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Mobile Number *</Label>
                <Input
                  value={noAccountFormData.mobileNumber}
                  onChange={(e) =>
                    setNoAccountFormData({
                      ...noAccountFormData,
                      mobileNumber: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Address *</Label>
                <Input
                  value={noAccountFormData.address}
                  onChange={(e) =>
                    setNoAccountFormData({
                      ...noAccountFormData,
                      address: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Region *</Label>
                <Select
                  value={noAccountFormData.regionId}
                  onValueChange={(v) =>
                    setNoAccountFormData({ ...noAccountFormData, regionId: v })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region: any) => (
                      <SelectItem key={region.id} value={region.id}>
                        {region.region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Type *</Label>
                <Select
                  value={noAccountFormData.type}
                  onValueChange={(v) =>
                    setNoAccountFormData({ ...noAccountFormData, type: v })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PREPAID">PREPAID</SelectItem>
                    <SelectItem value="POSTPAID">POSTPAID</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Complaint Type *</Label>
                <Select
                  value={noAccountFormData.complaintTypeId}
                  onValueChange={(v) => {
                    const selected = complaintTypes.find((t) => t.id === v);
                    setNoAccountFormData({
                      ...noAccountFormData,
                      complaintTypeId: v,
                      departmentId: selected?.departmentId || "",
                      complaintSubTypeId: "",
                    });
                    setNoAccountSubtypes(selected?.subTypes || []);
                  }}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {complaintTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Complaint Subtype *</Label>
                <Select
                  value={noAccountFormData.complaintSubTypeId}
                  onValueChange={(v) =>
                    setNoAccountFormData({
                      ...noAccountFormData,
                      complaintSubTypeId: v,
                    })
                  }
                  disabled={!noAccountFormData.complaintTypeId}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Subtype" />
                  </SelectTrigger>
                  <SelectContent>
                    {noAccountSubtypes.map((subtype) => (
                      <SelectItem key={subtype.id} value={subtype.id}>
                        {subtype.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priority *</Label>
                <Select
                  value={noAccountFormData.priority}
                  onValueChange={(v) =>
                    setNoAccountFormData({ ...noAccountFormData, priority: v })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map((p) => (
                      <SelectItem key={p.id} value={p.name}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Source *</Label>
                <Select
                  value={noAccountFormData.source}
                  onValueChange={(v) =>
                    setNoAccountFormData({ ...noAccountFormData, source: v })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Source" />
                  </SelectTrigger>
                  <SelectContent>
                    {source.map((s) => (
                      <SelectItem key={s.id} value={s.name}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Remark *</Label>
              <Textarea
                value={noAccountFormData.remark}
                onChange={(e) =>
                  setNoAccountFormData({
                    ...noAccountFormData,
                    remark: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsNoAccountModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={noAccountMutation.isPending}>
                {noAccountMutation.isPending
                  ? "Creating..."
                  : "Submit Complaint"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* SEARCH RESULTS TABLE */}
      {searchResults.length > 1 ? (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                Select Customer ({searchResults.length} records found)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account No</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Meter No</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {searchResults.map((customer, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{customer.conS_ACC}</TableCell>
                      <TableCell>{customer.conS_NAME}</TableCell>
                      <TableCell>{customer.conS_METERNO}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {customer.address}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            customer.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {customer.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => selectCustomer(customer)}
                        >
                          Select
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" onClick={resetSearch}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Search
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setIsNoAccountModalOpen(true)}
                >
                  NO ACCOUNT
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : !customerData ? (
        /* SEARCH FORM */
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Search Customer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="search">Account No / Meter No</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="search"
                      placeholder="Enter customer identifier"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && searchCustomer()}
                    />
                    <Button onClick={searchCustomer} disabled={loading}>
                      <Search className="h-4 w-4 mr-2" />
                      {loading ? "Searching..." : "Search"}
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setIsNoAccountModalOpen(true)}
                    >
                      NO ACCOUNT
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* COMPLAINT FORM */
        <>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">New Complaint</h1>
            <Button variant="outline" onClick={resetSearch}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Search
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* LEFT: Complaint Details */}
              <div className="lg:col-span-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Complaint Details</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="type">Complaint Type *</Label>
                      <Select
                        value={formData.complaintTypeId}
                        onValueChange={(v) => {
                          const selected = complaintTypes.find(
                            (t) => t.id === v
                          );
                          setFormData((prev) => ({
                            ...prev,
                            complaintTypeId: v,
                            departmentId: selected?.departmentId || "",
                            complaintSubTypeId: "",
                          }));
                        }}
                      >
                        <SelectTrigger id="type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {complaintTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="subtype">Complaint Subtype *</Label>
                      <Select
                        value={formData.complaintSubTypeId}
                        onValueChange={(v) => {
                          // FIX: Set state then pass v directly to avoid stale closure
                          setFormData((prev) => ({
                            ...prev,
                            complaintSubTypeId: v,
                          }));
                          onGetRegionalStaffs(v);
                        }}
                        disabled={!formData.complaintTypeId}
                        required
                      >
                        <SelectTrigger id="subtype">
                          <SelectValue placeholder="Select subtype" />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredSubtypes.map((subtype) => (
                            <SelectItem key={subtype.id} value={subtype.id}>
                              {subtype.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="priority">Priority *</Label>
                      <Select
                        value={formData.priority}
                        onValueChange={(v) =>
                          setFormData({ ...formData, priority: v })
                        }
                      >
                        <SelectTrigger id="priority">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          {priorities.map((priority) => (
                            <SelectItem key={priority.id} value={priority.name}>
                              {priority.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="source">Source *</Label>
                      <Select
                        value={formData.source}
                        onValueChange={(v) =>
                          setFormData({ ...formData, source: v })
                        }
                      >
                        <SelectTrigger id="source">
                          <SelectValue placeholder="Select Source" />
                        </SelectTrigger>
                        <SelectContent>
                          {source.map((s) => (
                            <SelectItem key={s.id} value={s.name}>
                              {s.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Email *</Label>
                      <Input
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div>
                      <Label>Mobile Number *</Label>
                      <Input
                        value={formData.mobileNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            mobileNumber: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div>
                      <Label>Correct Meter Reading</Label>
                      <Input
                        type="number"
                        value={formData.correctMeterReading}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            correctMeterReading: Number(e.target.value),
                          })
                        }
                      />
                    </div>

                    <Textarea
                      placeholder="Remark"
                      value={formData.remark}
                      onChange={(e) =>
                        setFormData({ ...formData, remark: e.target.value })
                      }
                    />

                    <div className="col-span-2">
                      <Label>Assign To</Label>
                      <Popover open={openAssign} onOpenChange={setOpenAssign}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openAssign}
                            className="w-full justify-between"
                            disabled={!formData.complaintSubTypeId}
                          >
                            {formData.assignTo
                              ? regionalMembers.find(
                                  (member) => `${member.staffId}-${member.email}` === formData.assignTo
                                )?.name || "Select Staff"
                              : "Select Staff"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Search staff..." />
                            <CommandList>
                              <CommandEmpty>No staff found.</CommandEmpty>
                              <CommandGroup>
                                {regionalMembers.map((member) => (
                                  <CommandItem
                                    key={member.email}
                                    value={`${member.staffId}-${member.email}`}
                                    onSelect={(currentValue) => {
                                      const [staffId, email] = currentValue.split("-");
                                      setFormData({
                                        ...formData,
                                        assignTo: currentValue,
                                        assignToEmail: email,
                                        assignToStaffId: staffId,
                                      });
                                      setOpenAssign(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        formData.assignTo === `${member.staffId}-${member.email}`
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {member.staffId} --- {member.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleAttachmentUpload}
                      className="block w-full text-sm text-slate-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-violet-50 file:text-violet-700
                        hover:file:bg-violet-100"
                    />
                  </CardContent>
                </Card>
              </div>

              {/* RIGHT: Customer Info */}
              <div className="lg:col-span-1">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Customer Info</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="multiple" className="w-full">
                      <AccordionItem value="personal">
                        <AccordionTrigger>Personal</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3">
                            {[
                              {
                                label: "Account No",
                                value: customerData.accountNo,
                              },
                              {
                                label: "Meter No",
                                value: customerData.meterNo,
                              },
                              { label: "Name", value: customerData.name },
                              { label: "Phone", value: customerData.phone },
                              { label: "Email", value: customerData.email },
                            ].map(({ label, value }) => (
                              <div key={label}>
                                <p className="text-xs text-muted-foreground">
                                  {label}
                                </p>
                                <p className="font-medium text-sm">{value}</p>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="account">
                        <AccordionTrigger>Account</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3">
                            {[
                              { label: "Status", value: customerData.status },
                              {
                                label: "Tariff Class",
                                value: customerData.tariffClass,
                              },
                              {
                                label: "Max Demand",
                                value: customerData.maxDemand,
                              },
                              { label: "IBC", value: customerData.ibc },
                              { label: "BSC", value: customerData.bsc },
                              { label: "Address", value: customerData.address },
                            ].map(({ label, value }) => (
                              <div key={label}>
                                <p className="text-xs text-muted-foreground">
                                  {label}
                                </p>
                                <p className="font-medium text-sm">{value}</p>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Customer History */}
            <Card>
              <CardHeader>
                <CardTitle>Customer History</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="complaints">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="complaints">
                      Complaint History
                    </TabsTrigger>
                    <TabsTrigger value="billing">Billing History</TabsTrigger>
                    <TabsTrigger value="collection">Collection</TabsTrigger>
                    <TabsTrigger value="credit">Credit/Debit</TabsTrigger>
                  </TabsList>
                  <TabsContent value="complaints" className="mt-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Ticket ID</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="text-muted-foreground">
                            No complaint history
                          </TableCell>
                          <TableCell />
                          <TableCell />
                          <TableCell />
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TabsContent>
                  <TabsContent value="billing" className="mt-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Bill ID</TableHead>
                          <TableHead>Period</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="text-muted-foreground">
                            No billing history
                          </TableCell>
                          <TableCell />
                          <TableCell />
                          <TableCell />
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TabsContent>
                  <TabsContent value="collection" className="mt-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Method</TableHead>
                          <TableHead>Ref</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="text-muted-foreground">
                            No collection history
                          </TableCell>
                          <TableCell />
                          <TableCell />
                          <TableCell />
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TabsContent>
                  <TabsContent value="credit" className="mt-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Credit</TableHead>
                          <TableHead>Balance</TableHead>
                          <TableHead>Note</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="text-muted-foreground">
                            No credit/debit history
                          </TableCell>
                          <TableCell />
                          <TableCell />
                          <TableCell />
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Submit Buttons — INSIDE <form> */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={resetSearch}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Creating..." : "Generate Ticket"}
              </Button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}

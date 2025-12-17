import axiosClient from "@/services/axiosClient";
import { useState, useEffect, useRef } from "react";
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
import { Search, ArrowLeft } from "lucide-react";
import { uploadFile } from "../services/fileUploadService";
import { useAuth } from "@/contexts/AuthContext";

export default function NewComplaint() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [customerData, setCustomerData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [priorities, setPriorities] = useState<any[]>([]);
  const [source, setsource] = useState<any[]>([]);
  const [complaintTypes, setComplaintTypes] = useState<any[]>([]);
  const [filteredSubtypes, setFilteredSubtypes] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const { user } = useAuth();

  // Ref for the file input to clear it programmatically
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    complaintTypeId: "",
    complaintSubTypeId: "",
    source: "",
    priority: "",
    email: "",
    mobileNumber: "",
    assignToStaffId: "",
    assignToEmail: "",
    departmentId: "",
    correctMeterReading: 0,
    remark: "",
    file: "",
    mediaLink: "",
  });

  const handleAttachmentUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadFile({
        file,
        uploadedBy: user.userName, // user?.userName, // from session
      });

      // Check logic based on user requirement
      // Assuming 'result' comes back as the full response or the data object.
      // Adjusting validation to ensure we have a valid path.

      console.log(result.filePath);
      console.log(result.fileUrl);

      // attach to ticket payload
      setFormData((prev) => ({
        ...prev,
        file: result.filePath, // storing as 'file' based on submit payload
        mediaLink: result.fileUrl,
      }));

      alert('Upload Added Successfully');
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload file");

      // Clear the input field
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Clear the state related to file
      setFormData((prev) => ({
        ...prev,
        file: "",
        mediaLink: "",
      }));
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

  useEffect(() => {
    const fetchEmployees = async () => {
      if (!formData.complaintTypeId || !customerData?.accountNo) {
        setEmployees([]);
        return;
      }

      const selectedType = complaintTypes.find(
        (t) => t.id === formData.complaintTypeId
      );

      if (!selectedType?.departmentId) return;

      setLoadingEmployees(true);

      try {
        const res = await axiosClient.get(
          `employees/regional-department-member`,
          {
            params: {
              DepartmentId: selectedType.departmentId,
              AccountNumber: customerData.accountNo,
            },
          }
        );

        setEmployees(res.data.data || []);
      } catch (err) {
        console.error("Employee fetch failed", err);
        setEmployees([]);
      } finally {
        setLoadingEmployees(false);
      }
    };

    fetchEmployees();
  }, [formData.complaintTypeId, customerData]);

  // FIX: Subtype Logic
  useEffect(() => {
    if (formData.complaintTypeId) {
      const selectedType = complaintTypes.find(
        (type) => type.id === formData.complaintTypeId
      );
      setFilteredSubtypes(selectedType?.subTypes || []);

      // Reset the correct state key
      setFormData((prev) => ({ ...prev, complaintSubTypeId: "" }));
    } else {
      setFilteredSubtypes([]);
    }
  }, [formData.complaintTypeId, complaintTypes]);

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
        alert("No customer records found");
        setSearchResults([]);
        setCustomerData(null);
      }
    } catch (error) {
      console.error("Search error:", error);
      alert("Error searching customer");
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
  });

  const selectCustomer = (customer: any) => {
    setCustomerData(mapCustomerData(customer));
    setSearchResults([]);
  };

  const resetSearch = () => {
    setCustomerData(null);
    setSearchResults([]);
    setSearchQuery("");
    // Clear file input manually
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setFormData({
      complaintTypeId: "",
      complaintSubTypeId: "",
      source: "",
      priority: "",
      email: "",
      mobileNumber: "",
      assignToStaffId: "",
      assignToEmail: "",
      departmentId: "",
      correctMeterReading: 0,
      remark: "",
      file: "",
      mediaLink: "",
    });
  };

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerData.accountNo || !formData.complaintSubTypeId || !formData.departmentId || !formData.complaintTypeId || !formData.priority || !formData.mobileNumber || !formData.email) {
      alert("Please fill all required fields with * before submitting.");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        consumerNumber: customerData.accountNo,
        complaintTypeId: formData.complaintTypeId,
        complaintSubTypeId: formData.complaintSubTypeId,
        source: formData.source,
        priority: formData.priority,
        email: formData.email,
        assignToStaffId: formData.assignToStaffId,
        assignToEmail: formData.assignToEmail,
        departmentId: formData.departmentId,
        mobileNumber: formData.mobileNumber,
        correctMeterReading: formData.correctMeterReading,
        remark: formData.remark,
        file: formData.file,
        mediaLink: formData.mediaLink,
      };

      const response = await axiosClient.post(`complaint`, payload);
debugger;
      alert(response.data.data);

      resetSearch();
    } catch (error) {
      console.error("Error creating ticket:", error);
      alert("Error creating ticket");
    } finally {
      setSubmitting(false);
    }
  };

  if (searchResults.length > 1) {
    return (
      <div className="p-6 space-y-4">
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
            <Button variant="outline" onClick={resetSearch} className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Search
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  if (!customerData) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Search Customer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="search">
                  Account No / Meter No / Mobile / Ticket ID
                </Label>
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
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">New Complaint</h1>
        <Button variant="outline" onClick={resetSearch}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Search
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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
                      const selected = complaintTypes.find((t) => t.id === v);

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

                {/* FIX: Subtype Selection */}
                <div>
                  <Label htmlFor="subtype">Complaint Subtype *</Label>
                  <Select
                    value={formData.complaintSubTypeId}
                    onValueChange={(v) =>
                      setFormData({ ...formData, complaintSubTypeId: v })
                    }
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
                      {source.map((source) => (
                        <SelectItem key={source.id} value={source.id}>
                          {source.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="assigned">Assigned To</Label>
                  <Select
                    value={formData.assignToStaffId}
                    disabled={!employees.length}
                    onValueChange={(staffId) => {
                      const emp = employees.find((e) => e.staffId === staffId);
                      if (!emp) return;

                      setFormData({
                        ...formData,
                        assignToStaffId: emp.staffId,
                        assignToEmail: emp.email,
                      });
                    }}
                  >
                    <SelectTrigger id="assigned">
                      <SelectValue placeholder="Select staff" />
                    </SelectTrigger>

                    <SelectContent>
                      {employees.map((emp) => (
                        <SelectItem key={emp.staffId} value={emp.staffId}>
                          {emp.name}
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
                      setFormData({ ...formData, mobileNumber: e.target.value })
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

                {/* FIX: File input with ref and updated handler */}
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
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Account No
                          </p>
                          <p className="font-medium text-sm">
                            {customerData.accountNo}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Meter No
                          </p>
                          <p className="font-medium text-sm">
                            {customerData.meterNo}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Name</p>
                          <p className="font-medium text-sm">
                            {customerData.name}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Phone</p>
                          <p className="font-medium text-sm">
                            {customerData.phone}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Email</p>
                          <p className="font-medium text-sm">
                            {customerData.email}
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="account">
                    <AccordionTrigger>Account</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Status
                          </p>
                          <p className="font-medium text-sm">
                            {customerData.status}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Tariff Class
                          </p>
                          <p className="font-medium text-sm">
                            {customerData.tariffClass}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Max Demand
                          </p>
                          <p className="font-medium text-sm">
                            {customerData.maxDemand}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">IBC</p>
                          <p className="font-medium text-sm">
                            {customerData.ibc}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">BSC</p>
                          <p className="font-medium text-sm">
                            {customerData.bsc}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Address
                          </p>
                          <p className="font-medium text-sm">
                            {customerData.address}
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Customer History</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="complaints">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="complaints">Complaint History</TabsTrigger>
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
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
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
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
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
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
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
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

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
    </div>
  );
}

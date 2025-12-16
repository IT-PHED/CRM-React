import axios from "axios";
import { useState, useEffect } from "react";
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

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function NewComplaint() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [priorities, setPriorities] = useState<any[]>([]);
    const [sources, setSources] = useState<any[]>([]);
  const [complaintTypes, setComplaintTypes] = useState<any[]>([]);
  const [filteredSubtypes, setFilteredSubtypes] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    complaintType: "",
    complaintSubtype: "",
    priority: "",
    sources: "",
    category: "",
    description: "",
    assignedTo: "",
    contactMethod: "",
  });

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [prioritiesRes, typesRes, sourcesRes] = await Promise.all([
          axios.get(`${BASE_URL}configuration/priority`),
          axios.get(`${BASE_URL}configuration/complaint-types-and-sub`),
          axios.get(`${BASE_URL}configuration/sources`),
        ]);

        setPriorities(prioritiesRes.data.data || []);
        setComplaintTypes(typesRes.data.data || []);
        setSources(sourcesRes.data.data || []);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };

    fetchDropdownData();
  }, []);

  useEffect(() => {
    if (formData.complaintType) {
      const selectedType = complaintTypes.find(
        (type) => type.id === formData.complaintType
      );
      setFilteredSubtypes(selectedType?.subTypes || []);
      setFormData((prev) => ({ ...prev, complaintSubtype: "" }));
    } else {
      setFilteredSubtypes([]);
    }
  }, [formData.complaintType, complaintTypes]);

  const searchCustomer = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const { data } = await axios.get(`${BASE_URL}customer/search-filter`, {
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
    setFormData({
      complaintType: "",
      complaintSubtype: "",
      priority: "",
      sources:"",
      category: "",
      description: "",
      assignedTo: "",
      contactMethod: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.complaintType ||
      !formData.priority ||
      !formData.description
    ) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const ticketData = {
        ...formData,
        customer: customerData,
      };

      console.log("Ticket Data:", ticketData);

      const response = await axios.post(`${BASE_URL}/tickets`, ticketData);
      alert("Ticket created successfully");
      resetSearch();
    } catch (error) {
      console.error("Error creating ticket:", error);
      alert("Error creating ticket");
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
                    value={formData.complaintType}
                    onValueChange={(v) =>
                      setFormData({ ...formData, complaintType: v })
                    }
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
                  <Label htmlFor="subtype">Complaint Subtype</Label>
                  <Select
                    value={formData.complaintSubtype}
                    onValueChange={(v) =>
                      setFormData({ ...formData, complaintSubtype: v })
                    }
                    disabled={!formData.complaintType}
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
                        <SelectItem key={priority.id} value={priority.id}>
                          {priority.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="sources">Source *</Label>
                  <Select
                    value={formData.sources}
                    onValueChange={(v) =>
                      setFormData({ ...formData, sources: v })
                    }
                  >
                    <SelectTrigger id="source">
                      <SelectValue placeholder="Select Source" />
                    </SelectTrigger>
                    <SelectContent>
                      {sources.map((source) => (
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
                    value={formData.assignedTo}
                    onValueChange={(v) =>
                      setFormData({ ...formData, assignedTo: v })
                    }
                  >
                    <SelectTrigger id="assigned">
                      <SelectValue placeholder="Select staff" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tech1">Tech Team 1</SelectItem>
                      <SelectItem value="tech2">Tech Team 2</SelectItem>
                      <SelectItem value="billing">Billing Team</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="contact">Contact Method</Label>
                  <Select
                    value={formData.contactMethod}
                    onValueChange={(v) =>
                      setFormData({ ...formData, contactMethod: v })
                    }
                  >
                    <SelectTrigger id="contact">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="phone">Phone</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="walk-in">Walk-in</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the complaint in detail..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={4}
                    required
                  />
                </div>
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
          <Button type="button" variant="outline" onClick={resetSearch}>
            Cancel
          </Button>
          <Button type="submit">Generate Ticket</Button>
        </div>
      </form>
    </div>
  );
}

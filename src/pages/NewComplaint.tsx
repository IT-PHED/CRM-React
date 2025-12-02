// pages/NewComplaint.tsx
import { useState } from "react";
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

export default function NewComplaint() {
  const [searchQuery, setSearchQuery] = useState("");
  const [customerData, setCustomerData] = useState(null);
  const [formData, setFormData] = useState({
    complaintType: "",
    priority: "",
    category: "",
    description: "",
    assignedTo: "",
    contactMethod: "",
  });

  const searchCustomer = async () => {
    // API call simulation
    setCustomerData({
      accountNo: "12345",
      meterNo: "MTR-001",
      name: "John Doe",
      address: "123 Main St",
      phone: "+234-xxx-xxxx",
      email: "john@example.com",
      tariffClass: "Residential",
      status: "Active",
    });
  };

  const resetSearch = () => {
    setCustomerData(null);
    setSearchQuery("");
    setFormData({
      complaintType: "",
      priority: "",
      category: "",
      description: "",
      assignedTo: "",
      contactMethod: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Generate ticket logic
    console.log("Ticket Data:", { ...formData, customer: customerData });
  };

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
                  Account No / Meter No / Ticket ID
                </Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="search"
                    placeholder="Enter customer identifier"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button onClick={searchCustomer}>
                    <Search className="h-4 w-4 mr-2" />
                    Search
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
      {/* Complaint Form + Customer Info Row */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Complaint Form Section - Takes 3/4 */}
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
                    <SelectItem value="billing">Billing Issue</SelectItem>
                    <SelectItem value="outage">Power Outage</SelectItem>
                    <SelectItem value="meter">Meter Fault</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
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
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(v) =>
                    setFormData({ ...formData, category: v })
                  }
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="customer-service">
                      Customer Service
                    </SelectItem>
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
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the complaint..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customer Details Accordion - Takes 1/4 */}
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
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="account">
                  <AccordionTrigger>Account</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Status</p>
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
                        <p className="text-xs text-muted-foreground">Address</p>
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

      {/* History Tabs - Full Width */}
      <Card>
        {/* ... rest of tabs code stays the same ... */}
        <CardHeader>
          <CardTitle>Customer History</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="complaints">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="complaints">Complaint History</TabsTrigger>
              <TabsTrigger value="billing">Billing History</TabsTrigger>
              <TabsTrigger value="collection">Collection</TabsTrigger>
              <TabsTrigger value="credit">Credit</TabsTrigger>
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
                    <TableCell>TCK-001</TableCell>
                    <TableCell>Billing</TableCell>
                    <TableCell>2024-11-15</TableCell>
                    <TableCell>Resolved</TableCell>
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
                    <TableCell>BILL-001</TableCell>
                    <TableCell>Nov 2024</TableCell>
                    <TableCell>₦5,000</TableCell>
                    <TableCell>Paid</TableCell>
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
                    <TableCell>2024-11-20</TableCell>
                    <TableCell>₦5,000</TableCell>
                    <TableCell>Bank Transfer</TableCell>
                    <TableCell>REF-001</TableCell>
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
                    <TableCell>2024-10-01</TableCell>
                    <TableCell>₦2,000</TableCell>
                    <TableCell>₦0</TableCell>
                    <TableCell>Overpayment</TableCell>
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

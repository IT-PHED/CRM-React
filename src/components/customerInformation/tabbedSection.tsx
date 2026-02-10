/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColumnDef } from "@tanstack/react-table";
import { Receipt, CreditCard, AlertTriangle, Box, Gauge } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import StatusBadge from "./StatusBadge";
import { DataTable } from "./DataTable";
import { mockBillingHistory, mockIncidents, mockMeterInfo, mockPaymentHistory, mockTransformerInfo } from "@/lib/mockData";


type Billing = (typeof mockBillingHistory)[number];
type Payment = (typeof mockPaymentHistory)[number];
type Incident = (typeof mockIncidents)[number];

const billingColumns: ColumnDef<Billing, any>[] = [
  { accessorKey: "billNo", header: "Bill No", cell: ({ getValue }) => <span className="font-medium">{getValue()}</span> },
  { accessorKey: "period", header: "Period" },
  { accessorKey: "units", header: "Units (kWh)", meta: { align: "right" } },
  { accessorKey: "amount", header: "Amount (₹)", meta: { align: "right" }, cell: ({ getValue }) => `₹${(getValue() as number).toLocaleString()}` },
  { accessorKey: "dueDate", header: "Due Date" },
  { accessorKey: "status", header: "Status", cell: ({ getValue }) => <StatusBadge status={getValue()} /> },
];

const paymentColumns: ColumnDef<Payment, any>[] = [
  { accessorKey: "receiptNo", header: "Receipt No", cell: ({ getValue }) => <span className="font-medium">{getValue()}</span> },
  { accessorKey: "date", header: "Date" },
  { accessorKey: "amount", header: "Amount (₹)", meta: { align: "right" }, cell: ({ getValue }) => `₹${(getValue() as number).toLocaleString()}` },
  { accessorKey: "mode", header: "Mode" },
  { accessorKey: "status", header: "Status", cell: ({ getValue }) => <StatusBadge status={getValue()} /> },
];

const incidentColumns: ColumnDef<Incident, any>[] = [
  { accessorKey: "ticketNo", header: "Ticket No", cell: ({ getValue }) => <span className="font-medium">{getValue()}</span> },
  { accessorKey: "date", header: "Date" },
  { accessorKey: "reason", header: "Reason" },
  { accessorKey: "status", header: "Status", cell: ({ getValue }) => <StatusBadge status={getValue()} /> },
  { accessorKey: "resolvedDate", header: "Resolved", cell: ({ getValue }) => getValue() ?? "—" },
];

const tabTriggerClass = "gap-2 data-[state=active]:bg-accent data-[state=active]:shadow-none rounded-b-none border-b-2 border-transparent data-[state=active]:border-primary";

const TabbedSection = () => (
  <Card className="shadow-sm">
    <Tabs defaultValue="billing" className="w-full">
      <div className="border-b px-4 pt-2">
        <TabsList className="h-11 bg-transparent p-0 gap-1">
          <TabsTrigger value="billing" className={tabTriggerClass}><Receipt className="h-4 w-4" /> Billing</TabsTrigger>
          <TabsTrigger value="payments" className={tabTriggerClass}><CreditCard className="h-4 w-4" /> Payments</TabsTrigger>
          <TabsTrigger value="incidents" className={tabTriggerClass}><AlertTriangle className="h-4 w-4" /> Incidents</TabsTrigger>
          <TabsTrigger value="transformer" className={tabTriggerClass}><Box className="h-4 w-4" /> Transformer</TabsTrigger>
          <TabsTrigger value="meter" className={tabTriggerClass}><Gauge className="h-4 w-4" /> Meter</TabsTrigger>
        </TabsList>
      </div>

      <CardContent className="p-0">
        <TabsContent value="billing" className="m-0">
          <DataTable columns={billingColumns} data={mockBillingHistory} />
        </TabsContent>

        <TabsContent value="payments" className="m-0">
          <DataTable columns={paymentColumns} data={mockPaymentHistory} />
        </TabsContent>

        <TabsContent value="incidents" className="m-0">
          <DataTable columns={incidentColumns} data={mockIncidents} />
        </TabsContent>

        <TabsContent value="transformer" className="m-0">
          <div className="p-6">
            <dl className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3 lg:grid-cols-4">
              {Object.entries({
                "Transformer Code": mockTransformerInfo.code,
                Capacity: mockTransformerInfo.capacity,
                Location: mockTransformerInfo.location,
                Feeders: mockTransformerInfo.feeders,
                "Connected Load (kW)": mockTransformerInfo.connectedLoad,
                "Last Maintenance": mockTransformerInfo.lastMaintenance,
              }).map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs text-muted-foreground">{k}</dt>
                  <dd className="mt-0.5 text-sm font-medium">{v}</dd>
                </div>
              ))}
              <div>
                <dt className="text-xs text-muted-foreground">Status</dt>
                <dd className="mt-1"><StatusBadge status={mockTransformerInfo.status} /></dd>
              </div>
            </dl>
          </div>
        </TabsContent>

        <TabsContent value="meter" className="m-0">
          <div className="p-6">
            <dl className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3 lg:grid-cols-4">
              {Object.entries({
                "Meter No": mockMeterInfo.meterNo,
                Make: mockMeterInfo.make,
                Type: mockMeterInfo.type,
                Phase: mockMeterInfo.phase,
                "Multiplication Factor": mockMeterInfo.mf,
                "Install Date": mockMeterInfo.installDate,
                "Last Reading": mockMeterInfo.lastReading,
                "Reading Date": mockMeterInfo.lastReadingDate,
              }).map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs text-muted-foreground">{k}</dt>
                  <dd className="mt-0.5 text-sm font-medium">{v}</dd>
                </div>
              ))}
              <div>
                <dt className="text-xs text-muted-foreground">Status</dt>
                <dd className="mt-1"><StatusBadge status={mockMeterInfo.status} /></dd>
              </div>
            </dl>
          </div>
        </TabsContent>
      </CardContent>
    </Tabs>
  </Card>
);

export default TabbedSection;

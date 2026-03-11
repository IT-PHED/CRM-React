/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetCustomersTableInformation } from "@/hooks/useApiQuery";
import { mockMeterInfo } from "@/lib/mockData";
import { formatCurrency, formatDate, formatUTCString, formatDateTime2 } from "@/utils";
import { ColumnDef } from "@tanstack/react-table";
import { AlertTriangle, Box, CreditCard, NotebookIcon, Receipt } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { DataTable } from "./DataTable";

interface Props {
  accountNumber: string;
}

interface StatusBadgeProps {
  status: 'Completed' | 'Cancelled' | 'Pending' | string;
  variant?: 'success' | 'danger' | 'warning' | 'default';
}

const getSettlementStatus = (settled: number, toSettle: number) => {
  if (settled >= toSettle && toSettle > 0) return 'Resolved';
  if (settled > 0) return 'Partially Settled';
  return 'Pending';
};

const paymentColumns: ColumnDef<ICustomerPaymentHistory, any>[] = [
  {
    accessorKey: "RECEPTNO",
    header: "Receipt No",
    cell: ({ getValue }) => (
      <span className="font-mono text-sm font-medium text-blue-600">
        {getValue()}
      </span>
    ),
  },
  {
    accessorKey: "CONSUMER_NAME",
    header: "Name",
    cell: ({ getValue }) => (
      <span className="font-medium text-gray-900">{getValue()}</span>
    ),
  },
  {
    accessorKey: "CONSUMER_TYPE",
    header: "Type",
    cell: ({ getValue }) => (
      <span className={`px-2 py-1 text-xs rounded-full ${getValue() === 'PREPAID'
        ? 'bg-green-100 text-green-700'
        : 'bg-blue-100 text-blue-700'
        }`}>
        {getValue()}
      </span>
    ),
  },
  {
    accessorKey: "METER_NO",
    header: "Meter No",
    cell: ({ getValue }) => {
      const value = getValue() as string;
      return (
        <span className={value === 'NOMETER' ? 'text-orange-500 italic' : 'font-mono text-sm'}>
          {value}
        </span>
      );
    },
  },
  {
    accessorKey: "TOKEN_NO",
    header: "Token No",
    cell: ({ getValue }) => {
      const value = getValue() as string;
      return (
        <span className={value?.trim() ? 'font-mono text-sm' : 'text-gray-400'}>
          {value?.trim() || '—'}
        </span>
      );
    },
  },
  {
    accessorKey: "AMOUNT",
    header: "Amount Paid (₦)",
    meta: { align: "right" },
    cell: ({ getValue }) => (
      <span className="font-semibold text-gray-900">
        {formatCurrency(getValue() as number)}
      </span>
    ),
  },
  {
    accessorKey: "VENDING_AMOUNT",
    header: "Vending Amount (₦)",
    meta: { align: "right" },
    cell: ({ getValue }) => {
      const value = getValue() as number | null;
      return (
        <span className={value ? 'text-green-600' : 'text-gray-400'}>
          {value ? formatCurrency(value) : '—'}
        </span>
      );
    },
  },
  {
    accessorKey: "UNIT",
    header: "Units (kWh)",
    meta: { align: "right" },
    cell: ({ getValue }) => {
      const value = getValue() as number | null;
      return (
        <span className={value ? 'text-gray-700' : 'text-gray-400'}>
          {value ? value.toLocaleString() : '—'}
        </span>
      );
    },
  },
  {
    accessorKey: "PAYMENTDATETIME",
    header: "Payment Date",
    cell: ({ getValue }) => (
      <span className="text-sm text-gray-600">
        {formatDate(getValue() as string)}
      </span>
    ),
  },
  {
    accessorKey: "TARIFF",
    header: "Tariff",
    cell: ({ getValue }) => {
      const value = getValue() as string | null;
      return (
        <span className="text-gray-600">{value || '—'}</span>
      );
    },
  },
  {
    accessorKey: "CANCELLED_STATUS",
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue() as string;
      const isCancelled = status?.trim() === 'Y';
      return (
        <StatusBadge
          status={isCancelled ? 'Cancelled' : 'Completed'}
          variant={isCancelled ? 'danger' : 'success'}
        />
      );
    },
  },
  {
    accessorKey: "CANCELLED_BY",
    header: "Cancelled By",
    cell: ({ getValue }) => {
      const value = getValue() as string | null;
      return (
        <span className="text-gray-500">{value || '—'}</span>
      );
    },
  },
  {
    accessorKey: "CANCEL_DATE",
    header: "Cancel Date",
    cell: ({ getValue }) => {
      const value = getValue() as string | null;
      return value ? (
        <span className="text-sm text-red-500">{formatDate(value)}</span>
      ) : (
        <span className="text-gray-400">—</span>
      );
    },
  },
  {
    accessorKey: "HANDLED_BY",
    header: "Handled By",
    cell: ({ getValue }) => {
      const value = getValue() as string | null;
      return (
        <span className="text-gray-600">{value || 'System'}</span>
      );
    },
  },
];

export const incidentColumns: ColumnDef<IBasicIncident, any>[] = [
  {
    accessorKey: 'INCIDENCE',
    header: 'Purpose',
    cell: ({ getValue }) => <span className="font-medium">{getValue<string>()}</span>,
  },
  {
    accessorKey: 'AMOUNTTOSETTLE',
    header: 'Amount to Settle',
    cell: ({ getValue }) => <span className="text-right">{formatCurrency(getValue<number>())}</span>,
  },
  {
    accessorKey: 'SETTLEDAMOUNT',
    header: 'Settled Amount',
    cell: ({ getValue, row }) => {
      const settled = getValue<number>();
      const toSettle = row.original.AMOUNTTOSETTLE;
      return (
        <span className="text-right font-medium text-green-600">
          {formatCurrency(settled)}
        </span>
      );
    },
  },
  {
    accessorKey: 'TOTAL_AMOUNT',
    header: 'Total Amt',
    cell: ({ getValue }) => <span className="text-right font-bold">{formatCurrency(getValue<number>())}</span>,
  },
  {
    accessorKey: 'CREATEDDATETIME',
    header: 'Created At',
    cell: ({ getValue }) => <span>{formatUTCString(getValue<string>())}</span>,
  },
  {
    accessorKey: 'INC_DATE',
    header: 'Inc Date',
    cell: ({ getValue }) => <span>{formatUTCString(getValue<string>())}</span>,
  },
  {
    accessorKey: 'SETTLEDAMOUNT', // Re-use settled amount to derive status
    header: 'Status',
    cell: ({ row }) => {
      const settled = row.original.SETTLEDAMOUNT;
      const toSettle = row.original.AMOUNTTOSETTLE;
      const status = getSettlementStatus(settled, toSettle);
      return <StatusBadge status={status} />;
    },
  },
];

const outstandingColumns: ColumnDef<IOutstanding, any>[] = [
  {
    accessorKey: "CONSUMERNO",
    header: "Acc No",
    cell: ({ getValue }) => (
      <span className="font-medium">{getValue()}</span>
    ),
  },
  {
    accessorKey: "PURPOSE",
    header: "Purpose",
    cell: ({ getValue }) => (
      <span className="text-gray-700">{getValue()}</span>
    ),
  },
  {
    accessorKey: "TOT_AMOUNT",
    header: "Total(₦)",
    meta: { align: "right" },
    cell: ({ getValue }) => `₦${(getValue() as number).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,
  },
  {
    accessorKey: "SETTLEDAMOUNT",
    header: "Settled(₦)",
    meta: { align: "right" },
    cell: ({ getValue }) => {
      const value = getValue() as number;
      return (
        <span className={value > 0 ? "text-green-600" : "text-gray-400"}>
          ₦{value.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </span>
      );
    },
  },
  {
    accessorKey: "AMOUNTTOSETTLED",
    header: "To Settle(₦)",
    meta: { align: "right" },
    cell: ({ getValue }) => {
      const value = getValue() as number;
      return (
        <span className={value > 0 ? "text-red-600 font-semibold" : "text-gray-400"}>
          ₦{value.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </span>
      );
    },
  },
  {
    accessorKey: "FACTOR_PERCENTAGE",
    header: "Factor(%)",
    meta: { align: "center" },
    cell: ({ getValue }) => `${getValue()}%`,
  },
  {
    accessorKey: "PRIORITY",
    header: "Priority",
    meta: { align: "center" },
    cell: ({ getValue }) => (
      <PriorityBadge priority={getValue() as number} />
    ),
  },
  {
    accessorKey: "COMM_DATE",
    header: "Comm Date",
    cell: ({ getValue }) => getValue() as string,
  },
  {
    accessorKey: "REASON",
    header: "Reason",
    cell: ({ getValue }) => {
      const value = getValue() as string;
      return (
        <span className={value?.trim() ? "text-gray-700" : "text-gray-400 italic"}>
          {value?.trim() || "—"}
        </span>
      );
    },
  },
  {
    accessorKey: "CREATEDON",
    header: "Created On",
    cell: ({ getValue }) => {
      const date = formatDateTime2(getValue() as string);
      return (
        <span className="text-sm text-gray-500">
          {date}
        </span>
      );
    },
  },
];

const tabTriggerClass = "gap-2 data-[state=active]:bg-accent data-[state=active]:shadow-none rounded-b-none border-b-2 border-transparent data-[state=active]:border-primary";

const TabbedSection = ({ accountNumber }: Props) => {
  const { isLoading, getCustomersTableInfoResponse } = useGetCustomersTableInformation(accountNumber);

  if (isLoading) return <TabbedSectionSkeleton />;

  console.log("Fetched Customer Table Info:", getCustomersTableInfoResponse?.data);

  const feederData = getCustomersTableInfoResponse?.data.feederMapping;
  const fields = [
    { label: 'Transformer Code', value: feederData?.DTRID },
    { label: 'Transformer Name', value: feederData?.DTRNAME },
    { label: 'Capacity (KVA)', value: feederData?.KVA ? `${feederData.KVA} KVA` : null },
    { label: '11kV Feeder ID', value: feederData?.FEEDER11ID },
    { label: '11kV Feeder Name', value: feederData?.FEEDER11NAME },
    { label: 'Substation ID', value: feederData?.SUBSTATION_ID },
    { label: 'Injection Substation', value: feederData?.INJ_NAME },
    { label: '33kV Feeder ID', value: feederData?.FEEDER33ID },
    { label: '33kV Feeder Name', value: feederData?.FEEDER33NAME },
    { label: 'TS ID', value: feederData?.TSID },
    { label: 'Transmission Station', value: feederData?.TS_NAME },
    { label: 'IBC Name', value: feederData?.IBC_NAME },
    { label: 'BSC Name', value: feederData?.BSC_NAME },
  ];

  return (
    <Card className="shadow-sm">
      <Tabs defaultValue="outstanding" className="w-full">
        <div className="border-b px-4 pt-2">
          <TabsList className="h-11 bg-transparent p-0 gap-1">
            <TabsTrigger value="outstanding" className={tabTriggerClass}><Receipt className="h-4 w-4 capitalize" /> Outstanding</TabsTrigger>
            <TabsTrigger value="payments" className={tabTriggerClass}><CreditCard className="h-4 w-4" /> Payments History</TabsTrigger>
            <TabsTrigger value="incidents" className={tabTriggerClass}><AlertTriangle className="h-4 w-4" /> Incidents</TabsTrigger>
            <TabsTrigger value="transformer" className={tabTriggerClass}><Box className="h-4 w-4" /> Transformer</TabsTrigger>
            <TabsTrigger value="basic_info" className={tabTriggerClass}><NotebookIcon className="h-4 w-4" /> Basic Info</TabsTrigger>
          </TabsList>
        </div>

        <CardContent className="p-0">
          <TabsContent value="outstanding" className="m-0">
            <DataTable columns={outstandingColumns} data={getCustomersTableInfoResponse?.data.outstanding ?? []} />
          </TabsContent>

          <TabsContent value="payments" className="m-0">
            <DataTable columns={paymentColumns} data={getCustomersTableInfoResponse?.data.paymentHistory ?? []} />
          </TabsContent>

          <TabsContent value="incidents" className="m-0">
            <DataTable columns={incidentColumns} data={getCustomersTableInfoResponse?.data.incidentRecords ?? []} />
          </TabsContent>

          <TabsContent value="transformer" className="m-0">
            <div className="p-6">
              <dl className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3 lg:grid-cols-4">
                {fields.map(({ label, value }) => (
                  <div key={label}>
                    <dt className="text-xs text-muted-foreground">{label}</dt>
                    <dd className="mt-0.5 text-sm font-medium">{value ?? "—"}</dd>
                  </div>
                ))}
                <div>
                  <dt className="text-xs text-muted-foreground">Status</dt>
                  <dd className="mt-1">
                    <StatusBadge status={feederData?.STATUS ?? "Unknown"} />
                  </dd>
                </div>
              </dl>
            </div>
          </TabsContent>

          <TabsContent value="basic_info" className="m-0">
            <div className="p-6">
              <dl className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3 lg:grid-cols-4">
                {Object.entries({
                  "IBC Name": getCustomersTableInfoResponse?.data.basicInfo?.[0].IBC_NAME || "—",
                  "BSC Name": getCustomersTableInfoResponse?.data.basicInfo?.[0].BSC_NAME || "—",
                  "Consumer Name": getCustomersTableInfoResponse?.data.basicInfo?.[0].CONSUMER_NAME || "—",
                  "Meter No": getCustomersTableInfoResponse?.data.basicInfo?.[0].METER_NO || "—",
                  "Cons Type": getCustomersTableInfoResponse?.data.basicInfo?.[0].CONS_TYPE || "—",
                  "Tariff": getCustomersTableInfoResponse?.data.basicInfo?.[0].TARIFF || "—",
                  "Load Reading": getCustomersTableInfoResponse?.data.basicInfo?.[0].LOAD || "—",
                  "Arrear": getCustomersTableInfoResponse?.data.basicInfo?.[0].ARREAR || "—",
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
  )
};

const PriorityBadge = ({ priority }) => {
  const getPriorityColor = (priority: number) => {
    if (priority <= 5) return "bg-red-100 text-red-700 border-red-200";
    if (priority <= 10) return "bg-orange-100 text-orange-700 border-orange-200";
    return "bg-green-100 text-green-700 border-green-200";
  };

  const getPriorityLabel = (priority: number) => {
    if (priority <= 5) return "High";
    if (priority <= 10) return "Medium";
    return "Low";
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(priority)}`}>
      {getPriorityLabel(priority)} ({priority})
    </span>
  );
};

const TabbedSectionSkeleton = () => (
  <Card className="shadow-sm overflow-hidden">
    {/* Tab Header Skeleton */}
    <div className="border-b px-4 pt-2">
      <div className="flex h-11 items-center gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-8 w-24 rounded-md" />
        ))}
      </div>
    </div>

    {/* Content Skeleton (mimicking a DataTable) */}
    <CardContent className="p-0">
      <div className="space-y-4 p-4">
        {/* Table Header Skeleton */}
        <div className="flex gap-4 border-b pb-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
        </div>

        {/* Table Rows Skeleton */}
        {[1, 2, 3, 4, 5].map((row) => (
          <div key={row} className="flex gap-4 pt-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant = 'default'
}) => {
  const getStyles = () => {
    switch (variant) {
      case 'success':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'danger':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStyles()}`}>
      {status}
    </span>
  );
};

export default TabbedSection;

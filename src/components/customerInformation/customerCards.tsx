import { User, MapPin, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatusBadge from "./StatusBadge";


interface CustomerData {
  name: string; accountNumber: string; meterNumber: string;
  category: string; status: "Active" | "Disconnected" | "Suspended";
  activationDate: string; phone: string; email: string;
  city: string; district: string; ward: string; pinCode: string; address: string;
  supplyType: string; supplyLevel: string; loadKW: number; loadKVA: number;
  phase: string; tariffCode: string; transformerCode: string; feederCode: string;
}

const Field = ({ label, value }: { label: string; value: string | number }) => (
  <div>
    <dt className="text-xs text-muted-foreground">{label}</dt>
    <dd className="text-sm font-medium text-foreground mt-0.5">{value}</dd>
  </div>
);

const CustomerCards = ({ customer }: { customer: CustomerData }) => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center gap-3 pb-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
          <User className="h-4.5 w-4.5 text-primary" />
        </div>
        <CardTitle className="text-base">Customer Identity</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
          <div className="col-span-2">
            <dt className="text-xs text-muted-foreground">Customer Name</dt>
            <dd className="text-sm font-semibold text-foreground mt-0.5">{customer.name}</dd>
          </div>
          <Field label="Account Number" value={customer.accountNumber} />
          <Field label="Meter Number" value={customer.meterNumber} />
          <Field label="Category" value={customer.category} />
          <div>
            <dt className="text-xs text-muted-foreground">Status</dt>
            <dd className="mt-1"><StatusBadge status={customer.status} /></dd>
          </div>
          <Field label="Activation Date" value={customer.activationDate} />
        </dl>
      </CardContent>
    </Card>

    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center gap-3 pb-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-info/10">
          <MapPin className="h-4.5 w-4.5 text-info" />
        </div>
        <CardTitle className="text-base">Contact & Address</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
          <Field label="Phone" value={customer.phone} />
          <Field label="Email" value={customer.email} />
          <Field label="City" value={customer.city} />
          <Field label="District" value={customer.district} />
          <Field label="Ward" value={customer.ward} />
          <Field label="PIN Code" value={customer.pinCode} />
          <div className="col-span-2">
            <dt className="text-xs text-muted-foreground">Full Address</dt>
            <dd className="text-sm font-medium text-foreground mt-0.5 leading-relaxed">{customer.address}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>

    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center gap-3 pb-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-warning/10">
          <Zap className="h-4.5 w-4.5 text-warning" />
        </div>
        <CardTitle className="text-base">Connection & Technical</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
          <Field label="Supply Type" value={customer.supplyType} />
          <Field label="Supply Level" value={customer.supplyLevel} />
          <Field label="Load (kW)" value={customer.loadKW} />
          <Field label="Load (kVA)" value={customer.loadKVA} />
          <Field label="Phase" value={customer.phase} />
          <Field label="Tariff Code" value={customer.tariffCode} />
          <Field label="Transformer" value={customer.transformerCode} />
          <Field label="Feeder" value={customer.feederCode} />
        </dl>
      </CardContent>
    </Card>
  </div>
);

export default CustomerCards;

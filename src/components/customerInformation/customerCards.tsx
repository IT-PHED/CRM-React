import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, MapPin, Phone, User, Zap } from "lucide-react";
import { Badge } from "../ui/badge";

const Field = ({ label, value, className }: { label: string; value: string | number; className?: string; }) => (
  <div className={className}>
    <dt className="text-xs text-muted-foreground">{label}</dt>
    <dd className="text-sm font-medium text-foreground mt-0.5">{value}</dd>
  </div>
);

const CustomerCards = ({ customer }: { customer: ICustomerProfile }) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* 1. Identity & Status */}
      <Card className="shadow-sm border-t-4 border-t-primary">
        <CardHeader className="flex flex-row items-center gap-3 pb-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <User className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-base font-bold">Customer Identity</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
            <div className="col-span-2">
              <dt className="text-xs text-muted-foreground uppercase tracking-wider">Full Name</dt>
              <dd className="text-base font-bold text-foreground mt-0.5">{customer.CONSUMER_NAME}</dd>
            </div>
            <Field label="Account No" value={customer.CONS_ACC} />
            <Field label="Meter No" value={customer.METERNO} />
            <Field label="Type" value={customer.CONS_TYPE} />
            <div>
              <dt className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Status</dt>
              <Badge variant={customer.STATUS === "Active" ? "default" : "destructive"}>
                {customer.STATUS}
              </Badge>
            </div>
            <Field label="Connection Date" value={customer.CON_DATE} />
            <Field className="col-span-2" label="CIN" value={customer.CIN?.split("_")[0]} />
          </dl>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-t-4 border-t-info">
        <CardHeader className="flex flex-row items-center gap-3 pb-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10">
            <MapPin className="h-5 w-5 text-blue-500" />
          </div>
          <CardTitle className="text-base font-bold">Contact & Location</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
            <Field label="Phone" value={customer.CON_MOBILENO} />
            <Field label="Email" value={customer.EMAIL} />
            <Field label="IBC" value={customer.IBC_NAME} />
            <Field label="BSC" value={customer.BSC_NAME} />
            <Field label="Zone" value={customer.ZONE} />
            <Field label="Book No" value={customer.BOOKNO} />
            <div className="col-span-2">
              <dt className="text-xs text-muted-foreground uppercase tracking-wider">Address</dt>
              <dd className="text-sm font-medium mt-0.5 leading-relaxed italic">
                {customer.ADDRESS}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* 3. Technical & Network */}
      <Card className="shadow-sm border-t-4 border-t-warning">
        <CardHeader className="flex flex-row items-center gap-3 pb-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10">
            <Zap className="h-5 w-5 text-orange-500" />
          </div>
          <CardTitle className="text-base font-bold">Network & Technical</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
            <Field label="Load (kW)" value={customer.LOAD} />
            <Field label="Tariff" value={customer.TARIFF} />
            <div className="col-span-2">
              <Field label="33kV Feeder" value={customer.FEEDER33NAME} />
            </div>
            <div className="col-span-2">
              <Field label="11kV Feeder" value={customer.FEEDER11NAME} />
            </div>
            <div className="col-span-2 border-t pt-2">
              <Field label="Transformer (DTR)" value={customer.DTR_NAME} />
              <p className="text-[10px] text-muted-foreground mt-0.5">ID: {customer.DTRID}</p>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* 4. Financial Status (Bonus Card) */}
      <Card className="shadow-sm border-t-4 border-t-green-500 md:col-span-2 lg:col-span-3">
        <CardHeader className="flex flex-row items-center gap-3 pb-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500/10">
            <CreditCard className="h-5 w-5 text-green-600" />
          </div>
          <CardTitle className="text-base font-bold">Billing & Financials</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase">Current Arrear</p>
              <p className="text-lg font-bold text-red-600">₦{customer.ARREAR?.toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase">Total Arrear</p>
              <p className="text-lg font-bold text-red-700">₦{customer.TOTAL_ARREAR?.toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase">Amount Payable</p>
              <p className="text-lg font-bold text-green-700">₦{customer.AMOUNT_PAYBLE?.toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase">To Settle</p>
              <p className="text-lg font-bold">₦{customer.AMOUNTTOSETTLED?.toLocaleString()}</p>
            </div>
            <div className="space-y-1 bg-slate-50 p-2 rounded">
              <div className="flex items-center gap-2 mb-1 text-blue-600">
                <Phone className="h-3 w-3" />
                <p className="text-[10px] font-bold uppercase">Marketer</p>
              </div>
              <p className="text-xs font-semibold truncate">{customer.MARKETERNAME}</p>
              <p className="text-xs text-muted-foreground">{customer.MARKETERPHONE}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerCards;

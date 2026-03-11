import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis, YAxis
} from "recharts";

interface Props {
    data: IMonthlyConsumptionResponse | null;
}

const formatMonthLabel = (isoString: string): string => {
    return new Date(isoString).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric'
    });
};

const transformConsumptionData = (data: IMonthlyDataPoint[]) => {
    return data.slice(0, 6).map(item => ({
        month: formatMonthLabel(item.MONTH),
        kWh: item.VALUE,
        rawDate: item.MONTH
    }));
};

const transformPaymentsData = (data: IMonthlyDataPoint[]) => {
    return data.slice(0, 6).map(item => ({
        month: formatMonthLabel(item.MONTH),
        amount: item.VALUE,
        rawDate: item.MONTH
    }));
};

const ConsumptionCharts = ({ data }: Props) => {
    const consumptionChartData = useMemo(() =>
        transformConsumptionData(data?.data.monthlyConsumption ?? []),
        [data?.data.monthlyConsumption]
    );

    const billingChartData = useMemo(() =>
        transformPaymentsData(data?.data.monthlyPayments ?? []),
        [data?.data.monthlyPayments]
    );

    return (
        <div className="grid gap-4 lg:grid-cols-2">
            <Card className="shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Consumption (kWh)</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                    <ResponsiveContainer width="100%" height={240}>
                        <LineChart data={consumptionChartData}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} className="fill-muted-foreground" />
                            <YAxis tick={{ fontSize: 12 }} className="fill-muted-foreground" />
                            <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
                            <Line type="monotone" dataKey="kWh" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(var(--primary))" }} />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card className="shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Billing (₦)</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={billingChartData}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} className="fill-muted-foreground" />
                            <YAxis tick={{ fontSize: 12 }} className="fill-muted-foreground" />
                            <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
                            <Bar dataKey="amount" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* <Card className="shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Peak vs Off-Peak (kWh)</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
                <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={mockConsumptionData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} className="fill-muted-foreground" />
                        <YAxis tick={{ fontSize: 12 }} className="fill-muted-foreground" />
                        <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
                        <Legend />
                        <Bar dataKey="peak" stackId="a" fill="hsl(var(--chart-3))" radius={[0, 0, 0, 0]} name="Peak" />
                        <Bar dataKey="offPeak" stackId="a" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} name="Off-Peak" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card> */}
        </div>
    )
};

export default ConsumptionCharts;

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import { ClipboardList, MessageSquare, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { useGetCategoryWiseSummary, useGetDayWiseSummary, useGetDivisionWiseSummary, useGetEscalationAndSlaSummary, useGetSlaCountSummary, useGetSlaTicketSummary } from "@/hooks/useApiQuery";

// 3. Convert the object back into a sorted array for the chart
type DswDataItem = {
  date: string;
  billing: number;
  delay: number;
  disconnection: number;
  interruption: number;
  meter: number;
  others: number;
  voltage: number;
};

export default function Dashboard() {
  const { SlaTicketData: MonthlySlaData, isLoading: isMonthlySlaDataLoading } = useGetSlaTicketSummary("MONTH");
  const { SlaTicketData: TodaySlaData, isLoading: isTodaySlaLoading } = useGetSlaTicketSummary("TODAY");
  const { SlaCountData: monthlySlaCountData, isLoading: monthlySlaLoading } = useGetSlaCountSummary("MONTH");
  const { SlaCountData: todaySlaCountData, isLoading: todaySlaCountLoading } = useGetSlaCountSummary("TODAY");
  const { CategoryWiseData, isLoading: isCategoryWiseLoading } = useGetCategoryWiseSummary();
  const { DayWiseData, isLoading: isDwDataLoading } = useGetDayWiseSummary()
  const { DivisionWiseData, isLoading: isDivWiseLoading } = useGetDivisionWiseSummary();
  const { EscalationAndSlaData, isLoading: isEscaltionAndSlaLoading } = useGetEscalationAndSlaSummary()

  const [data, setData] = useState({
    category: [],
    division: [],
    date: [],
    ticket: null,
    location: [],
    slaCount: [],
    slaDuration: [],
  });

  // color palette used for pie/chart consistency
  const colors = [
    "#60a5fa",
    "#f87171",
    "#86efac",
    "#fbbf24",
    "#a78bfa",
    "#fb923c",
    "#38bdf8",
  ];

  const slaData =
    data.slaCount && data.slaCount.length > 0 ? data.slaCount : [];


  const todaySlaSummary = useMemo(() => {
    if (isTodaySlaLoading || !TodaySlaData?.data.length) return;

    const raw = TodaySlaData?.data[0];

    const totalTickets = raw.opencount + raw.closecount;

    return {
      totalTickets, closedTickets: raw.closecount, openTickets: raw.opencount
    };
  }, [TodaySlaData?.data, isTodaySlaLoading]);

  const monthlySlaSummary = useMemo(() => {
    if (isMonthlySlaDataLoading || !MonthlySlaData?.data.length) return;

    const raw = MonthlySlaData?.data[0];

    const totalTickets = raw.opencount + raw.closecount;

    return {
      totalTickets, closedTickets: raw.closecount, openTickets: raw.opencount
    };
  }, [MonthlySlaData?.data, isMonthlySlaDataLoading]);

  const monthlySlaCount = useMemo(() => {
    if (monthlySlaLoading || !monthlySlaCountData?.data.length) return;
    const raw = monthlySlaCountData?.data[0];

    return {
      count: raw?.esclcount || 0,
    }
  }, [monthlySlaCountData?.data, monthlySlaLoading]);

  const todaySlaCount = useMemo(() => {
    if (todaySlaCountLoading || !todaySlaCountData?.data.length) return;
    const raw = todaySlaCountData?.data[0];

    return {
      count: raw?.esclcount || 0,
    }
  }, [todaySlaCountData?.data, todaySlaCountLoading]);

  const { categoryWiseData: csWiseData } = useMemo(() => {
    if (isCategoryWiseLoading || !CategoryWiseData?.length) return { categoryWiseData: [], labels: [] };

    const raw = CategoryWiseData;

    const categoryWiseData = raw.map((item, i) => ({
      name: item.categorY_NAME,
      value: Number(item.catcount),
      color: colors[i % colors.length],
    }));

    const labels = raw.map((item) => item.categorY_NAME);

    return { categoryWiseData, labels };
  }, [CategoryWiseData, colors, isCategoryWiseLoading]);

  const dswData = useMemo(() => {
    if (isDwDataLoading || !DayWiseData?.length) return [];

    const groupedByDate = DayWiseData.reduce((acc, item) => {
      const date = item.dates;
      const category = item.datE_CAT_NAME.toLowerCase();
      const count = item.datecount;

      if (!acc[date]) {
        // Initialize the object for this date
        acc[date] = {
          date: date,
          billing: 0,
          delay: 0,
          disconnection: 0,
          interruption: 0,
          meter: 0,
          others: 0,
          voltage: 0,
        };
      }

      // 2. Map the category names to the keys used in your <Bar> components
      if (category.includes("billing")) acc[date].billing += count;
      else if (category.includes("delay")) acc[date].delay += count;
      else if (category.includes("disconnection")) acc[date].disconnection += count;
      else if (category.includes("interruption")) acc[date].interruption += count;
      else if (category.includes("meter")) acc[date].meter += count;
      else if (category.includes("voltage")) acc[date].voltage += count;
      else acc[date].others += count;

      return acc;
    }, {});


    return (Object.values(groupedByDate) as DswDataItem[]).sort((a, b) => {
      // Basic date sort (assuming DD-MM-YYYY format)
      const dateA = a.date.split('-').reverse().join('');
      const dateB = b.date.split('-').reverse().join('');
      return dateA.localeCompare(dateB);
    });
  }, [DayWiseData, isDwDataLoading]);

  const divisData = useMemo(() => {
    if (isDivWiseLoading || !DivisionWiseData?.length) return [];

    const grouped = DivisionWiseData?.reduce((acc, item) => {
      const divName = item.diV_NAME;
      // Skip rows where division name is null
      if (!divName || divName === "null") return acc;

      const category = (item.diV_CAT || "").toLowerCase();
      const count = item.loC_COUNT || 0;

      if (!acc[divName]) {
        acc[divName] = {
          division: divName,
          billing: 0,
          delay: 0,
          disconnection: 0,
          interruption: 0,
          meter: 0,
          voltage: 0,
          others: 0,
          total: 0
        };
      }

      // Mapping categories to keys
      if (category.includes("billing")) acc[divName].billing += count;
      else if (category.includes("delay")) acc[divName].delay += count;
      else if (category.includes("disconnection")) acc[divName].disconnection += count;
      else if (category.includes("interruption")) acc[divName].interruption += count;
      else if (category.includes("meter")) acc[divName].meter += count;
      else if (category.includes("voltage")) acc[divName].voltage += count;
      else acc[divName].others += count;

      acc[divName].total += count;
      return acc;
    }, {});

    return (Object.values(grouped) as { total: number }[]).sort((a, b) => b.total - a.total);
  }, [DivisionWiseData, isDivWiseLoading]);

  const escalationData = useMemo(() => {
    if (isEscaltionAndSlaLoading || !EscalationAndSlaData?.length) return [];

    const grouped = EscalationAndSlaData?.reduce((acc, item) => {
      const divName = item.diV_NAME;
      if (!divName || divName === "null") return acc;

      const category = (item.diV_CAT || "").toLowerCase();
      const count = item.esclcount || 0;

      if (!acc[divName]) {
        acc[divName] = {
          division: divName,
          billing: 0,
          delay: 0,
          disconnection: 0,
          interruption: 0,
          meter: 0,
          voltage: 0,
          others: 0,
          total: 0
        };
      }

      // Mapping categories to keys
      if (category.includes("billing")) acc[divName].billing += count;
      else if (category.includes("delay")) acc[divName].delay += count;
      else if (category.includes("disconnection")) acc[divName].disconnection += count;
      else if (category.includes("interruption")) acc[divName].interruption += count;
      else if (category.includes("meter")) acc[divName].meter += count;
      else if (category.includes("voltage")) acc[divName].voltage += count;
      else acc[divName].others += count;

      acc[divName].total += count;
      return acc;
    }, {});

    return (Object.values(grouped) as { total: number }[]).sort((a, b) => b.total - a.total);
  }, [EscalationAndSlaData, isEscaltionAndSlaLoading]);


  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-blue-500/90 text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium">
              Ticket Summary
            </CardTitle>
            <ClipboardList className="h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-xs opacity-90 mb-1">Today</div>
                <div className="font-semibold">Total: {todaySlaSummary?.totalTickets ?? "0"}</div>
                <div className="font-semibold">Open: {todaySlaSummary?.openTickets ?? "0"}</div>
                <div className="font-semibold">Closed: {todaySlaSummary?.closedTickets ?? "0"}</div>
              </div>
              <div>
                <div className="text-xs opacity-90 mb-1">Monthly</div>
                <div className="font-semibold">Total: {monthlySlaSummary?.totalTickets ?? "0"}</div>
                <div className="font-semibold">Open: {monthlySlaSummary?.openTickets ?? "0"}</div>
                <div className="font-semibold">Closed: {monthlySlaSummary?.closedTickets ?? "0"}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-lime-500/90 text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium">
              Escalation Status
            </CardTitle>
            <MessageSquare className="h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-xs opacity-90 mb-1">Today</div>
                <div className="text-3xl font-bold">
                  {todaySlaCount?.count ?? "0"}
                </div>
              </div>
              <div>
                <div className="text-xs opacity-90 mb-1">Monthly</div>
                <div className="text-3xl font-bold">
                  {monthlySlaCount?.count ?? "0"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-cyan-500/90 text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium">
              Call Summary[in hrs]
            </CardTitle>
            <Phone className="h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-xs opacity-90 mb-1">Today</div>
                <div className="font-semibold">-</div>
              </div>
              <div>
                <div className="text-xs opacity-90 mb-1">Monthly</div>
                <div className="font-semibold">-</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Category Wise Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            {csWiseData?.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No category data available
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={csWiseData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                    // label={(entry) => entry.name}
                    >
                      {csWiseData?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-3 mt-4 justify-center text-xs">
                  {csWiseData?.map((item) => (
                    <div key={item.name} className="flex items-center gap-1">
                      <div
                        className="w-3 h-3 rounded-sm"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Day Wise Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            {dswData.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No day-wise ticket data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dswData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar
                    dataKey="billing"
                    stackId="a"
                    fill="#60a5fa"
                    name="Billing"
                  />
                  <Bar
                    dataKey="delay"
                    stackId="a"
                    fill="#f87171"
                    name="Delay in Connection"
                  />
                  <Bar
                    dataKey="disconnection"
                    stackId="a"
                    fill="#86efac"
                    name="Disconnection"
                  />
                  <Bar
                    dataKey="interruption"
                    stackId="a"
                    fill="#fbbf24"
                    name="Interruption"
                  />
                  <Bar
                    dataKey="meter"
                    stackId="a"
                    fill="#a78bfa"
                    name="Meter"
                  />
                  <Bar
                    dataKey="others"
                    stackId="a"
                    fill="#fb923c"
                    name="Others"
                  />
                  <Bar
                    dataKey="voltage"
                    stackId="a"
                    fill="#38bdf8"
                    name="Voltage"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Division Wise Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            {divisData.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No division data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={divisData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="division"
                    tick={{ fontSize: 10 }}
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="billing"
                    stackId="a"
                    fill="#60a5fa"
                    name="Billing"
                  />
                  <Bar
                    dataKey="delay"
                    stackId="a"
                    fill="#f87171"
                    name="Delay in Connection"
                  />
                  <Bar
                    dataKey="disconnection"
                    stackId="a"
                    fill="#86efac"
                    name="Disconnection"
                  />
                  <Bar
                    dataKey="interruption"
                    stackId="a"
                    fill="#fbbf24"
                    name="Interruption"
                  />
                  <Bar
                    dataKey="meter"
                    stackId="a"
                    fill="#a78bfa"
                    name="Meter"
                  />
                  <Bar
                    dataKey="others"
                    stackId="a"
                    fill="#fb923c"
                    name="Others"
                  />
                  <Bar
                    dataKey="voltage"
                    stackId="a"
                    fill="#38bdf8"
                    name="Voltage"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Escalation & SLA Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            {escalationData.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No SLA data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={escalationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="division"
                    tick={{ fontSize: 10 }}
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="billing"
                    stackId="a"
                    fill="#60a5fa"
                    name="Billing"
                  />
                  <Bar
                    dataKey="delay"
                    stackId="a"
                    fill="#f87171"
                    name="Delay in Connection"
                  />
                  <Bar
                    dataKey="disconnection"
                    stackId="a"
                    fill="#86efac"
                    name="Disconnection"
                  />
                  <Bar
                    dataKey="interruption"
                    stackId="a"
                    fill="#fbbf24"
                    name="Interruption"
                  />
                  <Bar
                    dataKey="meter"
                    stackId="a"
                    fill="#a78bfa"
                    name="Meter"
                  />
                  <Bar
                    dataKey="others"
                    stackId="a"
                    fill="#fb923c"
                    name="Others"
                  />
                  <Bar
                    dataKey="voltage"
                    stackId="a"
                    fill="#38bdf8"
                    name="Voltage"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

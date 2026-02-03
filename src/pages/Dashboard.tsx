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
import { ClipboardList, MessageSquare, Phone } from "lucide-react";
import {
  getCategoryWise,
  getDateWise,
  getLocationWise,
  getSlaCount,
  getSlaDivCount,
  getSlaDuration,
  getTicketSummary,
} from "@/services/dashboardServices";
import { useEffect, useState } from "react";

export default function Dashboard() {
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

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [
          category,
          division,
          date,
          ticket,
          location,
          slaCount,
          slaDuration,
        ] = await Promise.all([
          getCategoryWise(),
          getSlaDivCount(),
          getDateWise(),
          getTicketSummary(),
          getLocationWise(),
          getSlaCount(),
          getSlaDuration(),
        ]);

        setData({
          category: category || [],
          division: division || [],
          date: date || [],
          ticket: ticket ?? null,
          location: location || [],
          slaCount: slaCount || [],
          slaDuration: slaDuration || [],
        });
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    loadDashboard();
  }, []);

  // Map API responses to chart-friendly shapes with safe fallbacks
  const categoryData =
    data.category && data.category.length > 0
      ? data.category.map((c: any, i: number) => ({
          name: c.name ?? c.category ?? c.label ?? `Item ${i + 1}`,
          value: c.count ?? c.value ?? c.total ?? 0,
          color: c.color ?? colors[i % colors.length],
        }))
      : [];

  const ticketData = data.date && data.date.length > 0 ? data.date : [];

  const divisionData =
    data.division && data.division.length > 0 ? data.division : [];

  const slaData =
    data.slaCount && data.slaCount.length > 0 ? data.slaCount : [];

  // Safely read ticket summary numbers (defensive against varying API shapes)
  const getNumber = (obj: any, keys: string[]) => {
    for (const k of keys) {
      if (obj && typeof obj[k] === "number") return obj[k];
    }
    return "-";
  };

  const todayTotal = getNumber(data.ticket, [
    "todayTotal",
    "today_total",
    "today?.total",
    "today?.totalCount",
  ]);
  const todayOpen = getNumber(data.ticket, [
    "todayOpen",
    "today_open",
    "today?.open",
  ]);
  const todayClosed = getNumber(data.ticket, [
    "todayClosed",
    "today_closed",
    "today?.closed",
  ]);
  const monthlyTotal = getNumber(data.ticket, [
    "monthlyTotal",
    "monthly_total",
    "monthly?.total",
  ]);
  const monthlyOpen = getNumber(data.ticket, [
    "monthlyOpen",
    "monthly_open",
    "monthly?.open",
  ]);
  const monthlyClosed = getNumber(data.ticket, [
    "monthlyClosed",
    "monthly_closed",
    "monthly?.closed",
  ]);

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
                <div className="font-semibold">Total: {todayTotal}</div>
                <div className="font-semibold">Open: {todayOpen}</div>
                <div className="font-semibold">Closed: {todayClosed}</div>
              </div>
              <div>
                <div className="text-xs opacity-90 mb-1">Monthly</div>
                <div className="font-semibold">Total: {monthlyTotal}</div>
                <div className="font-semibold">Open: {monthlyOpen}</div>
                <div className="font-semibold">Closed: {monthlyClosed}</div>
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
                  {data.slaCount && data.slaCount.length
                    ? data.slaCount[0].escalated ?? 0
                    : 0}
                </div>
              </div>
              <div>
                <div className="text-xs opacity-90 mb-1">Monthly</div>
                <div className="text-3xl font-bold">
                  {data.slaCount && data.slaCount.length
                    ? data.slaCount.reduce(
                        (s: any, x: any) => s + (x.escalated ?? 0),
                        0
                      )
                    : 0}
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
            {categoryData.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No category data available
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={(entry) => entry.name}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-3 mt-4 justify-center text-xs">
                  {categoryData.map((item) => (
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
            {ticketData.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No day-wise ticket data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ticketData}>
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
            {divisionData.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No division data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={divisionData}>
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
                  <Bar dataKey="count" fill="#60a5fa" />
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
            {slaData.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No SLA data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={slaData}>
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
                  <Bar dataKey="count" fill="#38bdf8" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

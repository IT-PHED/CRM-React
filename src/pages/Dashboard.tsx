import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { ClipboardList, MessageSquare, Phone } from "lucide-react";

const ticketData = [
  { date: "01-11-2025", billing: 120, delay: 80, disconnection: 40, interruption: 30, meter: 60, others: 20, voltage: 50 },
  { date: "03-11-2025", billing: 140, delay: 90, disconnection: 50, interruption: 40, meter: 70, others: 25, voltage: 60 },
  { date: "05-11-2025", billing: 160, delay: 100, disconnection: 60, interruption: 50, meter: 80, others: 30, voltage: 70 },
  { date: "07-11-2025", billing: 180, delay: 110, disconnection: 70, interruption: 60, meter: 90, others: 35, voltage: 80 },
  { date: "09-11-2025", billing: 200, delay: 120, disconnection: 80, interruption: 70, meter: 100, others: 40, voltage: 90 },
  { date: "11-11-2025", billing: 170, delay: 105, disconnection: 65, interruption: 55, meter: 85, others: 32, voltage: 75 },
  { date: "13-11-2025", billing: 190, delay: 115, disconnection: 75, interruption: 65, meter: 95, others: 38, voltage: 85 },
  { date: "15-11-2025", billing: 210, delay: 125, disconnection: 85, interruption: 75, meter: 105, others: 42, voltage: 95 },
  { date: "17-11-2025", billing: 220, delay: 130, disconnection: 90, interruption: 80, meter: 110, others: 45, voltage: 100 },
  { date: "19-11-2025", billing: 200, delay: 120, disconnection: 80, interruption: 70, meter: 100, others: 40, voltage: 90 },
  { date: "21-11-2025", billing: 180, delay: 110, disconnection: 70, interruption: 60, meter: 90, others: 35, voltage: 80 },
];

const categoryData = [
  { name: "Billing", value: 2340, color: "#60a5fa" },
  { name: "Delay in Connection", value: 1560, color: "#f87171" },
  { name: "Disconnection", value: 890, color: "#86efac" },
  { name: "Interruption", value: 670, color: "#fbbf24" },
  { name: "Meter", value: 1120, color: "#a78bfa" },
  { name: "Others", value: 450, color: "#fb923c" },
  { name: "Voltage", value: 1050, color: "#38bdf8" },
];

const divisionData = [
  { division: "Calabar Urban", count: 450 },
  { division: "Calabar Rural", count: 320 },
  { division: "Ikom", count: 280 },
  { division: "Ugep", count: 380 },
  { division: "PH Urban", count: 520 },
  { division: "PH GRA", count: 410 },
  { division: "PH Industrial", count: 350 },
  { division: "PH Commercial", count: 480 },
  { division: "Uyo", count: 390 },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-blue-500/90 text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium">Ticket Summary</CardTitle>
            <ClipboardList className="h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-xs opacity-90 mb-1">Today</div>
                <div className="font-semibold">Total: 181</div>
                <div className="font-semibold">Open: 0</div>
                <div className="font-semibold">Closed: 181</div>
              </div>
              <div>
                <div className="text-xs opacity-90 mb-1">Monthly</div>
                <div className="font-semibold">Total: 9288</div>
                <div className="font-semibold">Open: 3532</div>
                <div className="font-semibold">Closed: 5756</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-lime-500/90 text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium">Escalation Status</CardTitle>
            <MessageSquare className="h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-xs opacity-90 mb-1">Today</div>
                <div className="text-3xl font-bold">0</div>
              </div>
              <div>
                <div className="text-xs opacity-90 mb-1">Monthly</div>
                <div className="text-3xl font-bold">294147</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-cyan-500/90 text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium">Call Summary[in hrs]</CardTitle>
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
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }}></div>
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Day Wise Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ticketData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="billing" stackId="a" fill="#60a5fa" name="Billing" />
                <Bar dataKey="delay" stackId="a" fill="#f87171" name="Delay in Connection" />
                <Bar dataKey="disconnection" stackId="a" fill="#86efac" name="Disconnection" />
                <Bar dataKey="interruption" stackId="a" fill="#fbbf24" name="Interruption" />
                <Bar dataKey="meter" stackId="a" fill="#a78bfa" name="Meter" />
                <Bar dataKey="others" stackId="a" fill="#fb923c" name="Others" />
                <Bar dataKey="voltage" stackId="a" fill="#38bdf8" name="Voltage" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Division Wise Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={divisionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="division" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#60a5fa" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Escalation & SLA Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={divisionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="division" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#38bdf8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { useState } from "react";
import { AdminComplaintsTable } from "@/components/dashboard/AllComplaintTable";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GetAllDeptComplaintTable, useGetCrmMonthlyStats, useGetRegions } from "@/hooks/useApiQuery";
import { Archive, BookDashed, BookmarkCheck, BookUp2Icon, BookUser, NotebookText, Search } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { useAuth } from "@/contexts/AuthContext";


const AllComplaintDepartment = () => {
    const [regionFilter, setRegionFilter] = useState('Head Office');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFrom, setDateFrom] = useState<string | undefined>();
    const [dateTo, setDateTo] = useState<string | undefined>();

    const { allDeptComplaints, isLoading } = GetAllDeptComplaintTable(searchQuery);
    const { monthlyStats } = useGetCrmMonthlyStats();
    const { allRegions } = useGetRegions();
    const { token } = useAuth();

    const regions = allRegions?.data ?? [];

    const stats = [
        {
            label: 'Total Complaints',
            value: monthlyStats?.data?.total?.toString() ?? "0",
            icon: BookUser,
            color: 'bg-primary/10 text-primary'
        },
        {
            label: 'Resolved',
            value: monthlyStats?.data?.resolved?.toString() ?? "0",
            icon: BookmarkCheck,
            color: 'bg-success/10 text-success'
        },
        {
            label: 'Pending',
            value: monthlyStats?.data?.unresolved?.toString() ?? "0",
            icon: BookDashed,
            negative: true,
            color: 'bg-blue-500/10 text-blue-600'
        },
        {
            label: 'Overdue',
            value: monthlyStats?.data?.overdue?.toString() ?? "0",
            icon: BookUp2Icon,
            negative: true,
            color: 'bg-blue-500/10 text-blue-600'
        },
        {
            label: 'Today Complaints',
            value: monthlyStats?.data?.today?.toString() ?? "0",
            icon: Archive,
            color: 'bg-warning/10 text-warning'
        },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Complaint Management</h1>
                        <p className="text-muted-foreground mt-1">Monitor Complaint activity</p>
                    </div>
                </div>


                <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
                    {stats.map((stat) => (
                        <Card key={stat.label}>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                                        <p className="text-xl md:text-2xl font-bold text-foreground">{stat.value}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                                            <stat.icon className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row gap-4 mb-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by ticket, customer name, or last 4..."
                                    className="pl-9"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Select value={regionFilter} onValueChange={setRegionFilter}>
                                <SelectTrigger className="w-full sm:w-36">
                                    <SelectValue placeholder="Regions" />
                                </SelectTrigger>
                                <SelectContent>
                                    {regions.map((region) => (
                                        <SelectItem id={region.id} value={region.id}>{region.region}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-full sm:w-36">
                                    <SelectValue placeholder="Regions" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="new">New</SelectItem>
                                    <SelectItem value="allocated">Assigned</SelectItem>
                                    <SelectItem value="approved">Resolved</SelectItem>
                                    <SelectItem value="closed">Closed</SelectItem>
                                    <SelectItem value="in progress">NERC</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button variant="secondary">
                                <Search className="text-white w-4 h-4 text-muted-foreground" />
                            </Button>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 p-4 bg-white border rounded-xl shadow-sm">
                            <div className="">
                                <DatePicker
                                    label="From Date"
                                    date={dateFrom}
                                    setDate={setDateFrom}
                                />
                            </div>

                            <div className="">
                                <DatePicker
                                    label="To Date"
                                    date={dateTo}
                                    setDate={setDateTo}
                                />
                            </div>
                        </div>

                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-0">
                        <AdminComplaintsTable data={allDeptComplaints?.data?.data ?? []} isLoading={isLoading} />
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}

export default AllComplaintDepartment;
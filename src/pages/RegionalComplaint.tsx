import { useState, useEffect } from "react";
import axiosClient from "@/services/axiosClient";
import { useNavigate } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
  flexRender,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, ArrowUpDown, Eye, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

type Complaint = {
  id: string;
  consumerId: string;
  ticket: string;
  complaintTypeId: string;
  complaintSubtypeId: string;
  status: string;
  priority: string;
  source: string;
  createdDate: string;
  meterNo: string;
  telephoneNo: string;
};

const statusColors: Record<string, string> = {
  New: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
  "IN PROGRESS": "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
  Resolved: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
  Approved: "bg-green-500/40 text-green-500 hover:bg-green-500/60",
  Closed: "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20",
};

const priorityColors: Record<string, string> = {
  Low: "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20",
  Medium: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
  High: "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20",
  Critical: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
};

const PAGE_SIZE = 50;

export default function RegionalComplaint() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(true);

    const { user } = useAuth();

      if (!user) return null;

  const fetchComplaints = async (page: number, search?: string) => {
    setLoading(true);
    try {
      const { data } = await axiosClient.get(
       // "/complaint/department/" + user.departmentId,
       `/complaint/department/${user.departmentId}/status`,
        {
          params: {
            pageNumber: page,
            status: "New",
            PageSize: PAGE_SIZE,
            ...(search && { searchTerm: search }),
          },
        }
      );
      setComplaints(data.data.data);
      setHasMore(data.data.data.length === PAGE_SIZE);
    } catch (error) {
      console.error("Failed to fetch complaints:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints(pageNumber, searchTerm);
  }, [pageNumber]);

  const handleSearch = () => {
    setPageNumber(1);
    fetchComplaints(1, searchTerm);
  };

  const handleNextPage = () => {
    if (hasMore) {
      setPageNumber((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (pageNumber > 1) {
      setPageNumber((prev) => prev - 1);
    }
  };

  const columns: ColumnDef<Complaint>[] = [
    {
      accessorKey: "ticket",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Ticket
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "consumerId",
      header: "Account No",
    },
    {
      accessorKey: "complaintTypeId",
      header: "Type",
    },
    {
      accessorKey: "complaintSubtypeId",
      header: "Subtype",
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate">
          {row.getValue("complaintSubtypeId")}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge className={statusColors[status] || statusColors.NEW}>
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => {
        const priority = row.getValue("priority") as string;
        return (
          <Badge className={priorityColors[priority] || priorityColors.MEDIUM}>
            {priority}
          </Badge>
        );
      },
    },
    {
      accessorKey: "source",
      header: "Source",
    },
    {
      accessorKey: "meterNo",
      header: "Meter No",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/complaints/${row.original.ticket}`)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: complaints,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    state: { sorting, columnFilters, globalFilter },
    manualPagination: true,
  });

  return (
    <div className="space-y-6">

      <Card>
        <CardHeader>
          <CardTitle>Department Related Complaints</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search complaints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-9"
              />
            </div>
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Search"
              )}
            </Button>
            <Select
              value={
                (table.getColumn("status")?.getFilterValue() as string) ?? "all"
              }
              onValueChange={(value) =>
                table
                  .getColumn("status")
                  ?.setFilterValue(value === "all" ? "" : value)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="NEW">New</SelectItem>
                <SelectItem value="IN PROGRESS">In Progress</SelectItem>
                <SelectItem value="RESOLVED">Resolved</SelectItem>
                <SelectItem value="CLOSED">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {!header.isPlaceholder &&
                          flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Page {pageNumber} • Showing {complaints.length} entries
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={pageNumber === 1 || loading}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={!hasMore || loading}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

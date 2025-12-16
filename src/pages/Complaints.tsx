import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, ArrowUpDown, Eye, Edit } from "lucide-react";

type Complaint = {
  id: string;
  customerName: string;
  subject: string;
  category: string;
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  priority: "Low" | "Medium" | "High" | "Critical";
  dateCreated: string;
  assignedTo: string;
};

// Sample data
const mockComplaints: Complaint[] = [
  {
    id: "CMP-001",
    customerName: "John Doe",
    subject: "Water supply issue",
    category: "Water",
    status: "Open",
    priority: "High",
    dateCreated: "2025-11-20",
    assignedTo: "Sarah Johnson",
  },
  {
    id: "CMP-002",
    customerName: "Jane Smith",
    subject: "Billing discrepancy",
    category: "Billing",
    status: "In Progress",
    priority: "Medium",
    dateCreated: "2025-11-19",
    assignedTo: "Mike Chen",
  },
  {
    id: "CMP-003",
    customerName: "Robert Brown",
    subject: "Meter reading incorrect",
    category: "Meter",
    status: "Resolved",
    priority: "Low",
    dateCreated: "2025-11-18",
    assignedTo: "Sarah Johnson",
  },
  {
    id: "CMP-004",
    customerName: "Emily Davis",
    subject: "Leak in main line",
    category: "Infrastructure",
    status: "In Progress",
    priority: "Critical",
    dateCreated: "2025-11-20",
    assignedTo: "David Wilson",
  },
  {
    id: "CMP-005",
    customerName: "Michael Wilson",
    subject: "Service disconnection request",
    category: "Service",
    status: "Open",
    priority: "Medium",
    dateCreated: "2025-11-19",
    assignedTo: "Mike Chen",
  },
];

const statusColors = {
  Open: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
  "In Progress": "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
  Resolved: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
  Closed: "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20",
};

const priorityColors = {
  Low: "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20",
  Medium: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
  High: "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20",
  Critical: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
};

export default function Complaints() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns: ColumnDef<Complaint>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-accent"
        >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "customerName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-accent"
        >
          Customer Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "subject",
      header: "Subject",
    },
    {
      accessorKey: "category",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-accent"
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as Complaint["status"];
        return (
          <Badge className={statusColors[status]}>
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => {
        const priority = row.getValue("priority") as Complaint["priority"];
        return (
          <Badge className={priorityColors[priority]}>
            {priority}
          </Badge>
        );
      },
    },
    {
      accessorKey: "dateCreated",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-accent"
        >
          Date Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "assignedTo",
      header: "Assigned To",
    },
    {
      id: "actions",
      header: "Actions",
      cell: () => (
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="hover:bg-accent">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-accent">
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: mockComplaints,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Complaints & Requests</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Complaints</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search all columns..."
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={(table.getColumn("status")?.getFilterValue() as string) ?? "all"}
              onValueChange={(value) =>
                table.getColumn("status")?.setFilterValue(value === "all" ? "" : value)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
         {/* <div className="flex items-center justify-center">
            <Tabs defaultValue="one" className="w-full">
              <TabsList>
                <TabsTrigger value="one">Complaint History</TabsTrigger>
                <TabsTrigger value="two">Billing</TabsTrigger>
                <TabsTrigger value="three">Collection</TabsTrigger>
                <TabsTrigger value="four">Credit/Debit</TabsTrigger>
              </TabsList>

              <TabsContent value="one">Content 1</TabsContent>
              <TabsContent value="two">Content 2</TabsContent>
              <TabsContent value="three">Content 3</TabsContent>
              <TabsContent value="four">Content 4</TabsContent>
            </Tabs>
          </div> */}

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
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
              Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
              {Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length
              )}{" "}
              of {table.getFilteredRowModel().rows.length} entries
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
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

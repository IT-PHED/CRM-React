import { useState, useEffect, useRef } from "react";
import axiosClient from "@/services/axiosClient";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from 'xlsx';
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
import { useNavigate } from "react-router-dom";

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
  assignedTo?: string;
  dateResolved?: string | null;
  modifiedDate?: string | null;
};

const statusColors: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
  allocated: "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20",
  approved: "bg-green-500/40 text-green-500 hover:bg-green-500/60",
  closed: "bg-gray-900/10 text-gray-800 hover:bg-gray-800/20",
  // 'IN-PROGRESS': "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
};

const statusNames: Record<string, string> = {
  new: "New",
  allocated: "Assigned",
  approved: "Resolved",
  closed: "Closed",
  // 'IN-PROGRESS': "In Progress",
};

const priorityColors: Record<string, string> = {
  low: "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20",
  medium: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
  high: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
  critical: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
};

const PAGE_SIZE = 50;

export default function Complaints() {
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const tableRef = useRef<HTMLDivElement | null>(null);

  const exportRows = complaints.map((complaint) => ({
      Ticket: complaint.ticket,
      "Account No": complaint.consumerId,
      Type: complaint.complaintTypeId,
      Subtype: complaint.complaintSubtypeId,
      Status: complaint.status,
      Priority: complaint.priority,
      Source: complaint.source,
      "Last Assigned To": complaint.assignedTo ?? "",
      "Resolved At": complaint.dateResolved
        ? new Date(complaint.dateResolved).toLocaleString("en-CA", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }).replace(",", "")
        : "",
    }));
  
    const downloadFile = (filename: string, content: string, mimeType: string) => {
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    };
  
    const exportCsv = () => {
      const rows = [
        Object.keys(exportRows[0] || {}).join(","),
        ...exportRows.map((row) =>
          Object.values(row)
            .map((value) => `"${String(value).replace(/"/g, '""')}"`)
            .join(",")
        ),
      ].join("\r\n");
  
      downloadFile("complaints.csv", rows, "text/csv;charset=utf-8;");
    };
  
    const exportExcel = () => {
      const worksheet = XLSX.utils.json_to_sheet(exportRows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Complaints");
      XLSX.writeFile(workbook, "complaints.xlsx");
    };
  
    const copyTable = async () => {
      const text = [
        Object.keys(exportRows[0] || {}).join("\t"),
        ...exportRows.map((row) => Object.values(row).join("\t")),
      ].join("\r\n");
  
      try {
        await navigator.clipboard.writeText(text);
      } catch (error) {
        console.error("Copy failed:", error);
      }
    };
  
    const printTable = () => {
      if (!tableRef.current) return;
      const printWindow = window.open("", "_blank");
      if (!printWindow) return;
  
      printWindow.document.write(`
        <html>
          <head>
            <title>Complaints Report</title>
            <style>
              table { width: 100%; border-collapse: collapse; font-family: sans-serif; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background: #f3f4f6; }
              /* This hides the actions column and buttons */
              .no-print, [data-column-id="actions"] { display: none !important; }
            </style>
          </head>
          <body>${tableRef.current.innerHTML}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    };
  
    const exportPdf = () => {
      const doc = new jsPDF();
      
      // Define columns (excluding Actions)
      const tableColumn = ["Ticket", "Account No", "Type", "Subtype", "Status", "Priority", "Source", "Last Assigned To", "Last Worked At"];
      
      // Format data
      const tableRows = complaints.map(c => [
        c.ticket,
        c.consumerId,
        c.complaintTypeId,
        c.complaintSubtypeId,
        c.status.toUpperCase(),
        c.priority,
        c.source,
        c.assignedTo ?? "",
        c.modifiedDate
          ? new Date(c.modifiedDate).toLocaleString("en-CA", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }).replace(",", "")
          : "",
      ]);
  
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 20,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [41, 128, 185] } // Professional Blue
      });
  
      doc.text("All Complaints Report", 14, 15);
      doc.save("complaints.pdf");
    };

  const fetchComplaints = async (page: number, search?: string) => {
    setLoading(true);
    try {
      const { data } = await axiosClient.get("/complaint", {
        params: {
          pageNumber: page,
          PageSize: PAGE_SIZE,
          ...(search && { searchTerm: search }),
        },
      });
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
        const status = (row.getValue("status") as string) || "";
        const key = status.toLowerCase();
        return (
          <Badge className={statusColors[key] ?? statusColors["new"]}>
            {statusNames[key] ?? statusNames["new"]}
          </Badge>
        );
      },
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => {
        const priority = (row.getValue("priority") as string) || "";
        const key = priority.toLowerCase();
        return (
          <Badge className={priorityColors[key] ?? priorityColors["medium"]}>
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
      accessorKey: "assignedTo",
      header: "Last Assigned To",
    },
    {
      accessorKey: "modifiedDate",
      header: "Last Acted On",
      cell: ({ row }) => {
        const rawDate = row.getValue("modifiedDate") as string | undefined | null;
        const formattedDate = rawDate
          ? new Date(rawDate).toLocaleString("en-CA", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }).replace(",", "")
          : "";

        return (
          <div className="max-w-[200px] truncate">
            {formattedDate}
          </div>
        );
      },
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
          <CardTitle>All Complaints</CardTitle>
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
                ((
                  (table.getColumn("status")?.getFilterValue() as string) || ""
                )?.toLowerCase() as string) ?? "all"
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
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="allocated">Assigned</SelectItem>
                <SelectItem value="approved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              className="bg-amber-500 text-white hover:bg-amber-600"
              size="sm"
              onClick={exportCsv}
            >
              Export CSV
            </Button>
            <Button
              variant="outline"
              className="bg-emerald-500 text-white hover:bg-emerald-600"
              size="sm"
              onClick={exportExcel}
            >
              Export Excel
            </Button>
            <Button
              variant="outline"
              className="bg-red-500 text-white hover:bg-red-600"
              size="sm"
              onClick={exportPdf}
            >
              Export PDF
            </Button>
            <Button
              variant="outline"
              className="bg-slate-500 text-white hover:bg-slate-600"
              size="sm"
              onClick={printTable}
            >
              Print
            </Button>
            <Button
              variant="outline"
              className="bg-blue-500 text-white hover:bg-blue-600"
              size="sm"
              onClick={copyTable}
            >
              Copy
            </Button>
          </div>

          <div className="rounded-md border" ref={tableRef}>
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

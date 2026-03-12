import { useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  getPaginationRowModel,
  RowSelectionState,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight, 
  Eye,
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  Search,
  Filter,
  Plus
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

interface AdminCardsTableProps {
  data: ITicket[];
  onTicketSelect?: (ticket: ITicket) => void;
  onCreateNew?: () => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  isLoading?: boolean;
}

// Helper function to format dates
const formatDate = (dateString: string | null) => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return '-';
  }
};

// Helper function to get priority badge
const getPriorityBadge = (priority: string) => {
  const styles = {
    High: 'bg-destructive/10 text-destructive border-destructive/20',
    Medium: 'bg-warning/10 text-warning border-warning/20',
    Low: 'bg-success/10 text-success border-success/20'
  };
  
  const icon = {
    High: <AlertCircle className="w-3 h-3" />,
    Medium: <Clock className="w-3 h-3" />,
    Low: <CheckCircle className="w-3 h-3" />
  };
  
  return (
    <Badge variant="outline" className={`${styles[priority]} gap-1.5 px-3 py-1 border`}>
      {icon[priority as keyof typeof icon]}
      {priority}
    </Badge>
  );
};

// Helper function to get status badge
const getStatusBadge = (status: string) => {
  const styles = {
    New: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    Allocated: 'bg-warning/10 text-warning border-warning/20',
    Approved: 'bg-success/10 text-success border-success/20',
    'In Progress': 'bg-primary/10 text-primary border-primary/20',
    Pending: 'bg-muted/10 text-muted-foreground border-muted/20',
    Closed: 'bg-gray-500/10 text-gray-600 border-gray-500/20'
  };
  
  const icons = {
    New: <AlertCircle className="w-3 h-3" />,
    Allocated: <CheckCircle className="w-3 h-3" />,
    Approved: <CheckCircle className="w-3 h-3" />,
    'IN-PROGRESS': <Clock className="w-3 h-3" />,
    Pending: <Clock className="w-3 h-3" />,
    Closed: <CheckCircle className="w-3 h-3" />
  };
  
  return (
    <Badge variant="outline" className={`${styles[status as keyof typeof styles] || 'bg-muted/10 text-muted-foreground border-muted/20'} gap-1.5 px-3 py-1 border`}>
      {icons[status as keyof typeof icons] || <AlertCircle className="w-3 h-3" />}
      {status}
    </Badge>
  );
};

// Helper function to get category badge
const getCategoryBadge = (category: string) => {
  const colors: Record<string, string> = {
    'C2': 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    'R2': 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
    'C1': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    'R1': 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20'
  };
  
  return (
    <Badge variant="outline" className={`${colors[category] || 'bg-gray-500/10 text-gray-600 border-gray-500/20'} px-3 py-1`}>
      {category}
    </Badge>
  );
};

// Empty state component
const EmptyState = ({ 
  searchValue, 
  onCreateNew, 
  onClearSearch 
}: { 
  searchValue?: string; 
  onCreateNew?: () => void;
  onClearSearch?: () => void;
}) => {
  if (searchValue) {
    return (
      <div className="text-center py-16 px-4">
        <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Search className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No tickets found
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          No tickets match "<span className="font-medium text-foreground">{searchValue}</span>". 
          Try adjusting your search or filter criteria.
        </p>
        <div className="flex items-center justify-center gap-3">
          {onClearSearch && (
            <Button variant="outline" onClick={onClearSearch}>
              Clear search
            </Button>
          )}
          {onCreateNew && (
            <Button onClick={onCreateNew}>
              <Plus className="w-4 h-4 mr-2" />
              Create New Ticket
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-16 px-4">
      <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <FileText className="w-8 h-8 text-primary" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        No tickets yet
      </h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        There are no complaint tickets in the system. Start by creating your first ticket.
      </p>
      {onCreateNew && (
        <Button onClick={onCreateNew} size="lg">
          <Plus className="w-5 h-5 mr-2" />
          Create First Ticket
        </Button>
      )}
    </div>
  );
};

// Loading skeleton rows
const LoadingSkeleton = () => {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={index} className="animate-pulse">
          <TableCell>
            <div className="h-5 w-5 rounded bg-muted" />
          </TableCell>
          <TableCell>
            <div className="h-6 w-32 rounded bg-muted" />
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-muted" />
              <div className="space-y-2">
                <div className="h-4 w-32 rounded bg-muted" />
                <div className="h-3 w-24 rounded bg-muted/50" />
              </div>
            </div>
          </TableCell>
          <TableCell>
            <div className="h-6 w-16 rounded-full bg-muted" />
          </TableCell>
          <TableCell>
            <div className="h-6 w-20 rounded-full bg-muted" />
          </TableCell>
          <TableCell>
            <div className="h-6 w-24 rounded-full bg-muted" />
          </TableCell>
          <TableCell>
            <div className="h-4 w-28 rounded bg-muted" />
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-1.5">
              <div className="h-3.5 w-3.5 rounded bg-muted" />
              <div className="h-4 w-20 rounded bg-muted" />
            </div>
          </TableCell>
          <TableCell>
            <div className="h-7 w-12 rounded-full bg-muted" />
          </TableCell>
          <TableCell>
            <div className="space-y-2">
              <div className="h-4 w-20 rounded bg-muted" />
              <div className="h-3 w-24 rounded bg-muted/50" />
            </div>
          </TableCell>
          <TableCell>
            <div className="h-8 w-8 rounded bg-muted" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

export function AdminComplaintsTable({ 
  data, 
  onTicketSelect, 
  onCreateNew,
  searchValue,
  onSearchChange,
  isLoading = false
}: AdminCardsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [localSearch, setLocalSearch] = useState(searchValue || '');
  const navigate = useNavigate();

  const handleSearchChange = (value: string) => {
    setLocalSearch(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  const handleClearSearch = () => {
    handleSearchChange('');
  };

  const columns: ColumnDef<ITicket>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() ? 'indeterminate' : false)
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all tickets"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select ticket"
        />
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'ticket',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="p-0 h-auto hover:bg-transparent font-medium flex items-center gap-1"
        >
          Ticket #
          <ArrowUpDown className="h-3.5 w-3.5" />
        </Button>
      ),
      cell: ({ row }) => {
        const ticket = row.original;
        return (
          <div className="font-mono font-medium text-foreground">
            {ticket.ticket}
          </div>
        );
      },
    },
    {
      accessorKey: 'name',
      header: 'Consumer',
      cell: ({ row }) => {
        const ticket = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-foreground truncate">{ticket.name}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="truncate">{ticket.meterNo}</span>
                {ticket.maxDemand && (
                  <span className="px-1.5 py-0.5 bg-muted rounded text-xs">
                    {ticket.maxDemand}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => getCategoryBadge(row.original.category),
    },
    {
      accessorKey: 'priority',
      header: 'Priority',
      cell: ({ row }) => getPriorityBadge(row.original.priority),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => getStatusBadge(row.original.status),
    },
    {
      accessorKey: 'complaintTypeId',
      header: 'Complaint Type',
      cell: ({ row }) => {
        const type = row.original.complaintTypeId;
        return (
          <div className="text-sm">
            <span className="text-foreground">{type}</span>
            {row.original.complaintSubtypeId && (
              <p className="text-xs text-muted-foreground truncate">
                {row.original.complaintSubtypeId}
              </p>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'region',
      header: 'Region',
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 text-sm">
          <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-foreground">{row.original.region}</span>
        </div>
      ),
    },
    {
      accessorKey: 'dateGenerated',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="p-0 h-auto hover:bg-transparent font-medium flex items-center gap-1"
        >
          Generated
          <ArrowUpDown className="h-3.5 w-3.5" />
        </Button>
      ),
      cell: ({ row }) => {
        const ticket = row.original;
        const isResolved = ticket.status === 'Resolved' || ticket.status === 'Closed';
        return (
          <div className="text-sm">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-foreground">{formatDate(ticket.dateGenerated)}</span>
            </div>
            {isResolved && ticket.dateResolved && (
              <p className="text-xs text-success mt-1">
                Resolved: {formatDate(ticket.dateResolved)}
              </p>
            )}
          </div>
        );
      },
    },
    // {
    //   accessorKey: 'sla_Level',
    //   header: 'SLA',
    //   cell: ({ row }) => {
    //     const sla = row.original.sla_Level;
    //     const isUrgent = parseInt(sla) <= 24;
    //     return (
    //       <Badge variant={isUrgent ? 'destructive' : 'outline'} className="font-medium">
    //         {sla}h
    //       </Badge>
    //     );
    //   },
    // },
    {
      id: 'contact',
      header: 'Contact',
      cell: ({ row }) => {
        const ticket = row.original;
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-sm">
              <Phone className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-foreground truncate">{ticket.telephoneNo || ticket.mobileNo || '-'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <Mail className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-muted-foreground truncate">{ticket.email || '-'}</span>
            </div>
          </div>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(`/complaints/${row.original.ticket}`)}
          className="h-8 w-8 hover:bg-primary/10"
          title="View ticket details"
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const isEmpty = !isLoading && data.length === 0;
  const hasSearch = !!searchValue;

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader className="bg-muted/30">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead 
                    key={header.id} 
                    className="whitespace-nowrap font-semibold h-12"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <LoadingSkeleton />
            ) : isEmpty ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="p-0">
                  <EmptyState 
                    searchValue={searchValue}
                    onCreateNew={onCreateNew}
                    onClearSearch={handleClearSearch}
                  />
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="group cursor-pointer hover:bg-muted/20 border-t"
                  onClick={() => onTicketSelect?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell 
                      key={cell.id} 
                      onClick={(e) => {
                        if (cell.column.id === 'select' || cell.column.id === 'actions') {
                          e.stopPropagation();
                        }
                      }}
                      className="py-3"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination - Only show if there's data */}
      {!isEmpty && !isLoading && (
        <div className="flex items-center justify-between px-4 py-3 border-t">
          <div className="text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{' '}
            {table.getFilteredRowModel().rows.length} ticket(s) selected
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
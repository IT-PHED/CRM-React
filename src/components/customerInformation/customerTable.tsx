import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";

interface Customer {
  accountNumber: string;
  name: string;
  address: string;
  mobileNo: string;
  consType: string;
}

const columnHelper = createColumnHelper<ILikeAccountResponse>();

const CustomerTable = ({ data, onSelect }: { data: ILikeAccountResponse[], onSelect: (id: string) => void }) => {
  const columns = [
    columnHelper.accessor("conS_ACC", { header: "Account" }),
    columnHelper.accessor("conS_NAME", { header: "Name" }),
    columnHelper.accessor("conS_ADDR1", { 
      header: "Address",
      cell: info => <div className="max-w-[200px] truncate">{info.getValue()}</div> 
    }),
    columnHelper.accessor("coN_MOBILENO", { header: "Mobile No" }),
    columnHelper.accessor("conS_METERNO", { header: "Meter No" }),
    columnHelper.accessor("conS_TYPE", { header: "Cons Type" }),
    columnHelper.display({
      id: "action",
      header: "Action",
      cell: (props) => (
        <button 
          onClick={() => onSelect(props.row.original.conS_ACC)}
          className="text-blue-600 font-bold hover:underline"
        >
          Select
        </button>
      ),
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 5 } },
  });

  return (
    <div className="space-y-4">
      <div className="rounded-md border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="p-3 text-left font-semibold text-slate-700">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="border-b hover:bg-slate-50 transition-colors">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="p-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
        <div className="flex gap-2">
          <button
            className="border rounded px-3 py-1 disabled:opacity-50"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </button>
          <button
            className="border rounded px-3 py-1 disabled:opacity-50"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerTable;
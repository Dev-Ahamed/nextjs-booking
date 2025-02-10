"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination: PaginationState;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  totalRecords: number;
  setTotalRecords: React.Dispatch<React.SetStateAction<number>>;
  isLoading?: boolean;
  globalFilter: string;
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
  searchPlaceholder?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pagination,
  setPagination,
  totalRecords,
  setTotalRecords,
  isLoading,
  globalFilter,
  setGlobalFilter,
  searchPlaceholder,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    enableRowSelection: true,
    manualPagination: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    // onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onPaginationChange: setPagination,
    pageCount:
      totalRecords > 0 ? Math.ceil(totalRecords / pagination.pageSize) : 1,
  });

  const [debouncedFilter, setDebouncedFilter] = React.useState(globalFilter);
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setGlobalFilter(debouncedFilter);
    }, 300);

    return () => clearTimeout(timeout);
  }, [debouncedFilter, setGlobalFilter]);

  return (
    <div className="space-y-4">
      <DataTableToolbar
        table={table}
        searchTerm={debouncedFilter}
        setSearchTerm={setDebouncedFilter}
        inputFieldPlaceholder={searchPlaceholder || ""}
      />
      <div
        className="rounded-md border max-h-screen overflow-auto"
        id="table-container"
      >
        <Table>
          <TableHeader className="shadow-md bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow className="border-b-0">
                <TableCell colSpan={columns.length}>
                  <div className="flex items-center justify-center">
                    <div className="relative">
                      <div className="h-5 w-5 rounded-full border-t-2 border-b-2 border-gray-200"></div>
                      <div className="absolute top-0 left-0 h-5 w-5 rounded-full border-t-2 border-b-2 border-primary animate-spin"></div>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
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
      <DataTablePagination table={table} />
    </div>
  );
}

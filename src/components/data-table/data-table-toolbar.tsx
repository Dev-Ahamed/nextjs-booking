"use client";

import { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";
import { cn } from "@/lib/utils";
import { DataTableMoreOptions } from "./data-table-more-options";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  inputFieldPlaceholder?: string;
}

export function DataTableToolbar<TData>({
  table,
  searchTerm,
  setSearchTerm,
  inputFieldPlaceholder,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const isRowSelected = table.getFilteredSelectedRowModel().rows.length > 0;

  return (
    <>
      <div className={cn("flex flex-col", isRowSelected && "space-y-4")}>
        <div className="flex items-center flex-col sm:flex-row sm:justify-between gap-4">
          <Input
            placeholder={inputFieldPlaceholder || "Search..."}
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="h-8 flex-1 sm:max-w-[50%]"
          />

          {/* <div className="flex items-center gap-2 flex-wrap">
            {table.getColumn("status") && (
              <DataTableFacetedFilter
                column={table.getColumn("status")}
                title="Status"
                options={statuses}
              />
            )}
            {table.getColumn("priority") && (
              <DataTableFacetedFilter
                column={table.getColumn("priority")}
                title="Priority"
                options={priorities}
              />
            )}
            {isFiltered && (
              <Button
                variant="ghost"
                onClick={() => table.resetColumnFilters()}
                className="h-8 px-2 lg:px-3"
              >
                Reset
                <X />
              </Button>
            )}
            
          </div> */}

          <div className="flex items-center gap-2 flex-wrap">
            <DataTableViewOptions table={table} />
            <DataTableMoreOptions table={table} />
          </div>
        </div>

        <div
          className={cn(
            "text-xs text-muted-foreground transition-all duration-500 ease-in-out",
            isRowSelected ? "opacity-100 h-auto" : "opacity-0 h-0"
          )}
        >
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
      </div>
    </>
  );
}

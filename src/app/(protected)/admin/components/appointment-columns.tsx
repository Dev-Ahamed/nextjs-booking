"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableRowActions } from "@/components/data-table/data-table-row-actions";
import { TimeSlotPeriod, TimeSlotStatus } from "@prisma/client";
import { cn } from "@/lib/utils";

export type AppointmentColumn = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  period: TimeSlotPeriod;
  status: TimeSlotStatus;
};

export const AppointmentColumns = (
  handleViewClick: (appointment: AppointmentColumn) => void,
  handleEditClick: (appointment: AppointmentColumn) => void,
  handleDeleteClick: (appointment: AppointmentColumn) => void,
  isEditAllowed: boolean,
  isDeleteAllowed: boolean
): ColumnDef<AppointmentColumn>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => <div>{row.getValue("date")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "time",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Time" />
    ),
    cell: ({ row }) => {
      const startTime = row.original.startTime;
      const endTime = row.original.endTime;
      const period = row.original.period;

      return (
        <div>
          {startTime} - {endTime} {period}
        </div>
      );
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.original.status;

      return (
        <div className="flex space-x-2 truncate">
          <div className="flex justify-center">
            <Badge
              variant={"outline"}
              className="flex w-fit items-center gap-2"
            >
              {status}
              <div
                className={cn(
                  "w-2 h-2 rounded-full",
                  status === "NOTBOOKED" || status === "CANCELLED"
                    ? "bg-red-500"
                    : " bg-green-500"
                )}
              />
            </Badge>
          </div>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions
        row={row}
        handleViewClick={() => handleViewClick(row.original)}
        handleEditClick={() => handleEditClick(row.original)}
        handleDeleteClick={() => handleDeleteClick(row.original)}
        isEditAllowed={isEditAllowed}
        isDeleteAllowed={isDeleteAllowed}
      />
    ),
  },
];

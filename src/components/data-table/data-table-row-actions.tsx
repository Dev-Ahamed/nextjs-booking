"use client";

import { Row } from "@tanstack/react-table";
import { Check, CircleX, Eye, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  handleViewClick: () => void;
  handleEditClick: () => void;
  handleDeleteClick: () => void;
  isEditAllowed: boolean;
  isDeleteAllowed: boolean;
}

export function DataTableRowActions<TData>({
  row,
  handleViewClick,
  handleEditClick,
  handleDeleteClick,
  isEditAllowed,
  isDeleteAllowed,
}: DataTableRowActionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal />
          <span className="sr-only">Actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleViewClick}>
            View
            <DropdownMenuShortcut>
              <Eye size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          {isEditAllowed && (
            <DropdownMenuItem onClick={handleEditClick}>
              Done
              <DropdownMenuShortcut>
                <Check size={16} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          )}
          {isDeleteAllowed && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleDeleteClick}
                className="hover:!bg-destructive hover:!text-white/90"
              >
                Cancel
                <DropdownMenuShortcut>
                  <CircleX size={16} />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

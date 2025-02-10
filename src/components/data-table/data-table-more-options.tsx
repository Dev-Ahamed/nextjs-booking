"use client";

import { useRouter } from "next/navigation";
import { Table } from "@tanstack/react-table";
import { MoreHorizontal, RefreshCcw } from "lucide-react";
import { FaRegFileExcel, FaRegFilePdf } from "react-icons/fa6";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DataTableMoreOptionsProps<TData> {
  table: Table<TData>;
}

export function DataTableMoreOptions<
  TData
>({}: DataTableMoreOptionsProps<TData>) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[150px]" align="end">
        <DropdownMenuLabel>More</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Download</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>
                  Save as PDF
                  <DropdownMenuShortcut>
                    <FaRegFilePdf size={16} />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Save as Excel
                  <DropdownMenuShortcut>
                    <FaRegFileExcel size={16} />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuItem onClick={() => router.refresh()}>
          Refresh
          <DropdownMenuShortcut>
            <RefreshCcw size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

"use client";

import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X } from "lucide-react";
import { MainNav } from "./main-nav";
import { cn } from "@/lib/utils";

export const MenuBar = () => {
  const [open, setOpen] = useState(false);
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger>
        {open ? (
          <X className="bg-accent" />
        ) : (
          <Menu className="hover:bg-accent" />
        )}
      </DropdownMenuTrigger>

      <div
        className={cn(
          "bg-black/50 w-full fixed left-0 top-16 transition-all duration-500 ease-in-out",
          open ? "h-screen" : "h-0"
        )}
      />

      <DropdownMenuContent
        sideOffset={22}
        align="end"
        className="w-[50vw] h-screen rounded-t-none shadow-none"
      >
        <MainNav setOpen={setOpen} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

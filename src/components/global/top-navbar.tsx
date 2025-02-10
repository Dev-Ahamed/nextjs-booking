"use client";

import { Logo } from "./logo";
import { MainNav } from "./main-nav";
import { MenuBar } from "./menu-bar";
import { UserNav } from "./user-nav";

export const TopNavbar = () => {
  return (
    <nav className="w-full bg-white shadow-md flex items-center border-b gap-4 px-4 justify-between sm:justify-start h-16">
      <div className="sm:hidden">
        <MenuBar />
      </div>
      <div className="hidden flex-1 sm:flex items-center gap-4 justify-center">
        <Logo />
        <div className="flex-1 flex justify-center">
          <MainNav />
        </div>
      </div>
      <UserNav />
    </nav>
  );
};

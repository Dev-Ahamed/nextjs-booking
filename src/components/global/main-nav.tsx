"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

import { getMainNavItems } from "@/constants/main-nav-items";
import { cn } from "@/lib/utils";

type MainNavProps = {
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

type NavItem = {
  label: string;
  href: string;
  activePaths: string[];
};

export const MainNav = ({ setOpen }: MainNavProps) => {
  const pathName = usePathname();
  const paths = pathName.split("/");
  const lastpath = paths.at(-1);

  const [mainNavItems, setMainNavItems] = useState<NavItem[]>([]);

  useEffect(() => {
    (async () => {
      const items = await getMainNavItems();
      setMainNavItems(items);
    })();
  }, []);

  return (
    <div>
      <ul className="flex flex-col sm:flex-row gap-2 items-center">
        {mainNavItems.map((item, index) => {
          const isActive = item.activePaths.includes(lastpath as string);
          return (
            <Link
              key={index}
              href={`${item.href}`}
              className={cn(
                "hover:bg-primary transition duration-300 px-2 py-1 rounded-sm hover:font-medium hover:text-white w-full",
                isActive && "bg-primary font-medium text-white"
              )}
              onClick={() => setOpen && setOpen(false)}
            >
              <li>{item.label}</li>
            </Link>
          );
        })}
      </ul>
    </div>
  );
};

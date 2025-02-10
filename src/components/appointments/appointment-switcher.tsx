"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const appointmentNavItems = [
  {
    label: "All Appointments",
    href: "/appointments",
  },
  {
    label: "My Appointments",
    href: "/appointments/my-appointments",
  },
];

export const AppointmentSwitcher = () => {
  const pathName = usePathname();

  return (
    <div className="flex items-center justify-center">
      <div className="bg-accent/50 flex p-1 gap-2 rounded-sm mx-2 text-center text-xs sm:text-sm overflow-auto">
        {appointmentNavItems.map((item, index) => (
          <Link
            href={item.href}
            key={index}
            className={cn(
              "px-4 py-2 rounded-full  transition-all duration-300 ease-in-out whitespace-nowrap",
              pathName.endsWith(item.href)
                ? "bg-white text-black shadow-md"
                : "hover:bg-accent"
            )}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

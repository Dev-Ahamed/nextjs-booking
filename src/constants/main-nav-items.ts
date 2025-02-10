"use server";

import { auth } from "@/auth";

export const getMainNavItems = async () => {
  const session = await auth();
  const role = session?.user.role;

  return [
    {
      label: "Home",
      href: "/",
      activePaths: [""],
    },
    {
      label: "Appointments",
      href: role === "ADMIN" ? "/admin" : "/appointments",
      activePaths: ["appointments", "my-appointments", "admin"],
    },
  ];
};

import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Simple Appointment Booking",
  description: "Simple appointment booking application ",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body className={`${poppins.className} antialiased`}>
          {children}
          <Toaster position="top-right" />
          {/* <TopNavbar />
        <div className="flex-1 min-h-full">{children}</div>
        <Footer /> */}
        </body>
      </html>
    </SessionProvider>
  );
}

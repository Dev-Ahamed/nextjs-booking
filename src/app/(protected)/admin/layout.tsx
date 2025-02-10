import { auth } from "@/auth";
import { BodyWrapper } from "@/components/global/body-wrapper";
import { getUserById } from "@/data/user";
import { AlertTriangle } from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await auth();
  const user = await getUserById(session?.user.id as string);
  if (!user || user.role !== "ADMIN") {
    return (
      <BodyWrapper>
        <div className="w-full bg-red-300 text-white p-4 rounded-lg flex items-center justify-center gap-2">
          <AlertTriangle size={22} />
          <span className="text-sm font-medium">You are not allowed</span>
        </div>
      </BodyWrapper>
    );
  }

  return children;
}

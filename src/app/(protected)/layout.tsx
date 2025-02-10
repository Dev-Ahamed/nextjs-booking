import { Footer } from "@/components/global/footer";
import { TopNavbar } from "@/components/global/top-navbar";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <TopNavbar />
        <div className="flex-1">{children}</div>
        <Footer />
      </div>
    </>
  );
}

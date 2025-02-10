import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getAllAppointments } from "@/data/appointment";

export async function GET(req: Request) {
  const session = await auth();
  const userId = session?.user.id;

  const url = new URL(req.url);

  const pageIndex =
    parseInt(url.searchParams.get("pageIndex") as string, 10) || 0;
  const pageSize =
    parseInt(url.searchParams.get("pageSize") as string, 10) || 10;
  const searchTerm = url.searchParams.get("searchTerm") || "";

  if (!session || !userId) {
    return NextResponse.json({ status: 401, message: "Unauthorized" });
  }

  try {
    const appointmetsData = await getAllAppointments({
      pageIndex: pageIndex,
      pageSize: pageSize,
      searchTerm,
    });

    const data = {
      appointmentsData: appointmetsData?.appointments || [],
      totalRecords: appointmetsData?.totalRecords || 0,
    };

    return NextResponse.json({ status: 200, data, message: "Success" });
  } catch (error) {
    console.error("getAllAppointmentsAPI error: " + error);
    return NextResponse.json({ status: 500, message: "Server Error" });
  }
}

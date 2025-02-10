import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getAppointmentsByDate } from "@/data/appointment";

export async function GET(req: Request) {
  const session = await auth();
  const userId = session?.user.id;

  const url = new URL(req.url);
  const dateParam = url.searchParams.get("date") || "";

  if (!session || !userId) {
    return NextResponse.json({ status: 401, message: "Unauthorized" });
  }

  if (!dateParam) {
    return NextResponse.json({ status: 400, message: "Invalid date" });
  }

  const date = new Date(`${dateParam}T00:00:00.000Z`);

  try {
    const appointmetsData = await getAppointmentsByDate(new Date(date));

    const data = {
      appointments: appointmetsData?.appointments || [],
    };

    return NextResponse.json({ status: 200, data, message: "Success" });
  } catch (error) {
    console.error("getAllAppointmentsAPI error: " + error);
    return NextResponse.json({ status: 500, message: "Server Error" });
  }
}

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const session = await auth();
  const role = session?.user.role;

  if (role !== "ADMIN") {
    return NextResponse.json({
      status: 401,
      message: "Unauthorized",
    });
  }

  const appointment = await req.json();

  try {
    await db.timeSlot.update({
      where: { id: appointment.id },
      data: {
        status: "DONE",
      },
    });

    return NextResponse.json({
      status: 200,
      message: "Appointment done successfully",
    });
  } catch (error) {
    console.log("appointmentDoneAPI error", error);

    return NextResponse.json({
      status: 500,
      message: "Internal server error",
    });
  }
}

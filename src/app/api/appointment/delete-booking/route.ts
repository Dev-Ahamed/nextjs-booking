import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function DELETE(req: Request) {
  const session = await auth();
  const userId = session?.user.id;
  const role = session?.user.role;

  if (role !== "USER" || !userId) {
    return NextResponse.json({
      status: 401,
      message: "Invalid user",
    });
  }

  const url = new URL(req.url);

  const bookingId = url.searchParams.get("bookingId");
  const timeSlotId = url.searchParams.get("timeSlotId");

  if (!bookingId || !timeSlotId) {
    return NextResponse.json({
      status: 400,
      message: "Invalid request",
    });
  }

  try {
    await db.$transaction([
      db.booking.delete({
        where: {
          id: bookingId,
          timeSlotId: timeSlotId,
          userId: session?.user.id,
        },
      }),

      db.timeSlot.update({
        where: { id: timeSlotId },
        data: {
          status: "NOTBOOKED",
        },
      }),
    ]);

    return NextResponse.json({
      status: 200,
      message: "Appointment cancelled successfully",
    });
  } catch (error) {
    console.log("appointmentDeleteAPI error", error);

    return NextResponse.json({
      status: 500,
      message: "Internal server error",
    });
  }
}

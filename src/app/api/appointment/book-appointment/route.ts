import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { bookingSchema } from "@/schemas";

export async function POST(req: Request) {
  const session = await auth();
  const userId = session?.user.id;
  const role = session?.user.role;

  if (role !== "USER" || !userId) {
    return NextResponse.json({
      status: 401,
      message: "Invalid user",
    });
  }

  const { values, appointmentId } = await req.json();
  const validatedFields = bookingSchema.safeParse(values);

  if (!validatedFields.success) {
    return NextResponse.json({
      status: 400,
      message: "Invalid fields",
    });
  }

  const { name, phone, message } = validatedFields.data;

  try {
    await db.$transaction([
      db.booking.create({
        data: {
          userId,
          timeSlotId: appointmentId,
          name,
          phoneNo: phone,
          message,
        },
      }),

      db.timeSlot.update({
        where: { id: appointmentId },
        data: { status: "BOOKED" },
      }),
    ]);

    return NextResponse.json({
      status: 200,
      message: "Appointment booked successfully",
    });
  } catch (error) {
    console.log("bookingAPI error", error);

    return NextResponse.json({
      status: 500,
      message: "Internal server error",
    });
  }
}

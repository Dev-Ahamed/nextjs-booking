import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { slotSchema } from "@/schemas";
import { Prisma } from "@prisma/client";
import { parse, format } from "date-fns";

export async function POST(req: Request) {
  const session = await auth();
  const role = session?.user.role;

  if (role !== "ADMIN") {
    return NextResponse.json({
      status: 401,
      message: "Unauthorized",
    });
  }

  const body = await req.json();
  const validatedFields = slotSchema.safeParse(body);

  if (!validatedFields.success) {
    return NextResponse.json({
      status: 400,
      message: "Invalid fields",
    });
  }

  const { date, timeSlots } = validatedFields.data;
  const parsedDate = parse(date, "MMM dd, yyyy", new Date());
  const utcFormattedDate = format(parsedDate, "yyyy-MM-dd'T'HH:mm:ss'Z'");

  try {
    await db.appointment.create({
      data: {
        date: utcFormattedDate,
        timeSlots: {
          create: timeSlots.map((slot) => ({
            startTime: slot.startTime,
            endTime: slot.endTime,
            period: slot.period,
          })),
        },
      },
    });

    return NextResponse.json({
      status: 200,
      message: "Appointment created successfully",
    });
  } catch (error) {
    console.log("createSlotAPI error", error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002" &&
      Array.isArray(error.meta?.target) &&
      error.meta.target.includes("date")
    ) {
      return NextResponse.json({
        status: 400,
        message: `Date already exists`,
      });
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002" &&
      Array.isArray(error.meta?.target) &&
      error.meta.target.includes("appointmentId")
    ) {
      return NextResponse.json({
        status: 400,
        message: `Duplicate timeslot not allowed`,
      });
    }

    return NextResponse.json({
      status: 500,
      message: "Internal server error",
    });
  }
}

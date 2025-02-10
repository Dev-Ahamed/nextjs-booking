import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { format } from "date-fns";

type getAllRolesProps = {
  pageIndex?: number;
  pageSize?: number;
  searchTerm?: string;
};

export const getAllAppointments = async ({
  pageIndex,
  pageSize,
  searchTerm,
}: getAllRolesProps) => {
  console.log("console from getAllAppointments");

  const user = await auth();

  if (!user) {
    return null;
  }

  const searchObj = searchTerm
    ? [
        {
          startTime: {
            contains: searchTerm,
            mode: Prisma.QueryMode.insensitive,
          },
        },
      ]
    : undefined;

  try {
    const [appointments, totalRecords] = await Promise.all([
      db.timeSlot.findMany({
        where: {
          OR: searchObj,
        },
        skip:
          pageIndex !== undefined && pageSize !== undefined
            ? pageIndex * pageSize
            : undefined,
        take: pageSize !== undefined ? pageSize : undefined,
        select: {
          id: true,
          startTime: true,
          endTime: true,
          period: true,
          status: true,
          appointmentId: true,
          Appointment: {
            select: {
              date: true,
            },
          },
        },
        orderBy: [
          {
            Appointment: {
              date: "desc",
            },
          },
          {
            startTime: "asc",
          },
        ],
      }),

      // Fetch total count of time slots for pagination
      db.timeSlot.count({
        where: {
          OR: searchObj,
        },
      }),
    ]);

    const formattedAppointments = appointments.map((appointment) => {
      const appointmentDate = appointment.Appointment.date;

      return {
        id: appointment.id,
        date: format(appointmentDate, "MMM, dd, yyyy"),
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        period: appointment.period,
        status: appointment.status,
      };
    });

    return { appointments: formattedAppointments, totalRecords };
  } catch (error) {
    console.log("getAllAppointments error", error);
    return null;
  }
};

export const getAppointmentsByDate = async (date: Date) => {
  console.log("console from getAppointmentsByDate");

  const user = await auth();

  if (!user) {
    return null;
  }

  try {
    const appointments = await db.timeSlot.findMany({
      where: {
        Appointment: {
          date,
        },
        status: "NOTBOOKED",
      },
      select: {
        id: true,
        startTime: true,
        endTime: true,
        period: true,
        status: true,
        appointmentId: true,
        Appointment: {
          select: {
            date: true,
          },
        },
      },
      orderBy: [
        {
          startTime: "asc",
        },
      ],
    });

    const formattedAppointments = appointments.map((appointment) => {
      const appointmentDate = appointment.Appointment.date;

      return {
        id: appointment.id,
        date: format(appointmentDate, "MMM, dd, yyyy"),
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        period: appointment.period,
        status: appointment.status,
      };
    });

    return { appointments: formattedAppointments };
  } catch (error) {
    console.log("getAppointmentsByDate error", error);
    return null;
  }
};

export const getAppointmentById = async (id: string) => {
  console.log("console from getAppointmentById");

  const user = await auth();

  if (!user) {
    return null;
  }

  try {
    const appointment = await db.timeSlot.findUnique({
      where: { id },
      include: {
        Appointment: true,
      },
    });

    return appointment;
  } catch (error) {
    console.log("getAppointmentById error", error);
    return null;
  }
};

export const getMyAppointments = async () => {
  console.log("console from getMyAppointments");

  const user = await auth();

  if (!user) {
    return null;
  }

  try {
    const myAppointments = await db.booking.findMany({
      where: { userId: user.user.id },
      include: {
        TimeSlot: {
          include: {
            Appointment: true,
          },
        },
      },
    });

    return myAppointments;
  } catch (error) {
    console.log("getMyAppointments error", error);
    return null;
  }
};

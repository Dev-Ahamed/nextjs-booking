import { TimeSlotPeriod } from "@prisma/client";
import { z } from "zod";

export const signupSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(2, { message: "At least 2 characters required" })
    .max(50, { message: "Name should be less than 50 characters" }),
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, { message: "Password should be at least 6 characters" }),
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email" }),
  password: z.string({ required_error: "Password is required" }),
});

export const slotSchema = z.object({
  date: z
    .string({
      required_error: "Date is required",
    })
    .regex(/^[A-Za-z]+ \d{2}, \d{4}$/, {
      message: "Date must be in 'Month dd, yyyy' format",
    }),
  timeSlots: z
    .array(
      z.object({
        startTime: z
          .string({ required_error: "Required" })
          .regex(/^([01][0-9]|2[0-3]):([0-5][0-9])$/, {
            message: "Invalid time (HH:MM)",
          }),
        endTime: z
          .string({ required_error: "Required" })
          .regex(/^([01][0-9]|2[0-3]):([0-5][0-9])$/, {
            message: "Invalid time (HH:MM)",
          }),
        period: z.nativeEnum(TimeSlotPeriod, { required_error: "Required" }),
      })
    )
    .min(1, { message: "At least one timeslot is required" }),
});

export const bookingSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name is required" })
    .max(50, { message: "Name should be less than 50 characters" }),
  phone: z
    .string()
    .trim()
    .min(12, { message: "Invalid Phone no" })
    .max(15, { message: "Invalid Phone no" }),
  message: z.string().optional(),
});

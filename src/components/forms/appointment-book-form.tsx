"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { bookingSchema, slotSchema } from "@/schemas";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { PhoneInput } from "@/components/ui/phone-input";

import { TimeSlotPeriod, TimeSlotStatus } from "@prisma/client";
import { useSession } from "next-auth/react";

type AppointmentBookFormProps = React.ComponentPropsWithoutRef<"div"> & {
  className?: string;
  appointment: {
    id: string;
    appointmentId: string;
    startTime: string;
    endTime: string;
    period: TimeSlotPeriod;
    status: TimeSlotStatus;
    Appointment: {
      id: string;
      date: Date;
    };
  };
};

export function AppointmentBookForm({
  className,
  appointment,
  ...props
}: AppointmentBookFormProps) {
  const session = useSession();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof bookingSchema>>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: session.data?.user.name || "",
      phone: session.data?.user.phoneNo || "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof bookingSchema>) {
    startTransition(async () => {
      try {
        const res = await fetch("/api/appointment/book-appointment", {
          method: "POST",
          body: JSON.stringify({ values, appointmentId: appointment.id }),
        });

        const result = await res.json();

        if (result.status === 200) {
          toast.success(result.message);
          form.reset();
          router.refresh();
          router.push("/appointments/my-appointments");
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        console.log("booking error", error);
        toast.error("Something went wrong");
      }
    });
  }
  return (
    <div
      className={cn(
        "flex flex-col gap-6 p-4 w-full max-w-md mx-auto",
        className
      )}
      {...props}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex gap-2 items-center">
            <Button variant={"outline"} disabled className="font-medium">
              {format(appointment.Appointment.date, "MMM,dd,yyyy")}
              <CalendarIcon size={14} />
            </Button>

            <Button variant={"outline"} disabled className="font-medium">
              {appointment.startTime} - {appointment.endTime}{" "}
              {appointment.period}
              <Clock size={14} />
            </Button>
          </div>

          {/* Name Fiels */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Name *</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value || ""}
                    onChange={field.onChange}
                    placeholder="John Doe"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone No Field */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Phone *</FormLabel>
                <FormControl>
                  <PhoneInput
                    {...field}
                    value={field.value || ""}
                    onChange={field.onChange}
                    placeholder="0771234567"
                    disabled={isPending}
                    defaultCountry="LK"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Message Field */}
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea placeholder="Write your message here" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-center sm:justify-end gap-2">
            <Button
              type="button"
              disabled={isPending}
              variant={"outline"}
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              Create
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

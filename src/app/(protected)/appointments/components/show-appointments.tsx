"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn, getTimeOfDay } from "@/lib/utils";
import { DatePicker } from "./date-picker";
import { Separator } from "@/components/ui/separator";

type ShowAppointmentsProps = {
  appointments: {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    period: string;
    status: string;
  }[];
};

export const ShowAppointments = ({ appointments }: ShowAppointmentsProps) => {
  const [data, setData] = useState(appointments);
  const [date, setDate] = useState<Date>(new Date());
  const [isPending, startTransition] = useTransition();
  const isInitialRender = useRef(true);
  const router = useRouter();

  useEffect(() => {
    setData(appointments);
  }, [appointments]);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    startTransition(async () => {
      const formattedDate = format(date, "yyyy-MM-dd");
      const res = await fetch(
        `/api/appointment/getAppointmentsByDate?date=${formattedDate}`
      );

      const result = await res.json();

      if (result.status === 200) {
        setData(result.data.appointments);
      } else {
        console.log("Error");
      }
    });
  }, [date]);

  return (
    <>
      <Card>
        <CardHeader className="flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <CardTitle>All Appointments</CardTitle>
            <CardDescription>
              Book appointments for your next visit
            </CardDescription>
          </div>
          <div>
            <DatePicker date={date} setDate={setDate} />
          </div>
        </CardHeader>
        <CardContent>
          <Separator />

          <div className="mt-4">
            {data.length > 0 && (
              <h1 className="font-medium text-sm text-muted-foreground rounded-lg">
                Available Slots
              </h1>
            )}

            {isPending && (
              <div className="flex items-center justify-center">
                <div className="relative">
                  <div className="h-5 w-5 rounded-full border-t-2 border-b-2 border-gray-200"></div>
                  <div className="absolute top-0 left-0 h-5 w-5 rounded-full border-t-2 border-b-2 border-primary animate-spin"></div>
                </div>
              </div>
            )}

            <div className="mt-4">
              {data.length === 0 ? (
                <div className="flex justify-center items-center hover:bg-accent p-2 h-28 transition-all duration-300 ease-in-out">
                  <p className="text-muted-foreground text-sm">
                    Slots are not available
                  </p>
                </div>
              ) : (
                data.map((appointment, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-4 items-center hover:bg-accent p-2 rounded-lg transition-all duration-300 ease-in-out border mb-2 md:mb-0 md:border-0 md:border-b md:last:border-b-0"
                  >
                    {/* Date */}
                    <div>
                      <p className="text-base text-center font-medium text-gray-800">
                        {appointment.date}
                      </p>
                    </div>
                    {/* Time */}
                    <div className="md:col-span-2 flex flex-col items-center">
                      <p className="text-base font-medium">
                        {appointment.startTime} - {appointment.endTime}{" "}
                        {appointment.period}
                      </p>
                      {/* <p className="text-xs text-muted-foreground">
                {getTimeOfDay(appointment.time)}
              </p> */}
                    </div>
                    {/* Status */}
                    <div className="flex justify-center">
                      <Badge
                        variant={"outline"}
                        className="flex w-fit items-center gap-2"
                      >
                        {appointment.status}
                        <div
                          className={cn(
                            "w-2 h-2 rounded-full",
                            appointment.status === "Available"
                              ? "bg-green-500"
                              : "bg-red-500"
                          )}
                        />
                      </Badge>
                    </div>
                    {/* Book Btn */}
                    {appointment.status === "NOTBOOKED" && (
                      <div className="flex justify-center md:justify-end">
                        <Button
                          onClick={() =>
                            router.push(`/book/${appointment.id}`)
                          }
                        >
                          Book now
                        </Button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

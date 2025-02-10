"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { format, set } from "date-fns";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, getTimeOfDay } from "@/lib/utils";
import { TimeSlotPeriod, TimeSlotStatus } from "@prisma/client";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type ShowAppointmentsProps = {
  data: {
    TimeSlot: {
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
  }[];
};

export const ShowMyAppointments = ({ data }: ShowAppointmentsProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  const handleDeleteBooking = async (appointment: any) => {
    startTransition(async () => {
      try {
        const res = await fetch(
          `/api/appointment/delete-booking?bookingId=${appointment.id}&timeSlotId=${appointment.timeSlotId}`,
          {
            method: "DELETE",
          }
        );

        const result = await res.json();

        if (result.status === 200) {
          setIsOpen(false);
          router.refresh();
        } else {
          toast.error(result.message, {
            action: {
              label: <X size={16} />,
              onClick: () => {},
            },
          });
        }
      } catch (error) {
        console.log("bookingDeleteError", error);
      }
    });
  };

  return (
    <div>
      {isPending && (
        <div className="flex items-center justify-center">
          <div className="relative">
            <div className="h-5 w-5 rounded-full border-t-2 border-b-2 border-gray-200"></div>
            <div className="absolute top-0 left-0 h-5 w-5 rounded-full border-t-2 border-b-2 border-primary animate-spin"></div>
          </div>
        </div>
      )}

      {data.map((appointment, index) => {
        const isDone = appointment.TimeSlot.status === "DONE";
        return (
          <div
            key={index}
            className={cn(
              "grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4 items-center hover:bg-accent p-2 rounded-lg transition-all duration-300 ease-in-out border mb-2 md:mb-0 md:border-0 md:border-b md:last:border-b-0",
              isDone && "text-muted-foreground"
            )}
          >
            {/* Date */}
            <div>
              <p className="text-base text-center font-medium">
                {format(appointment.TimeSlot.Appointment.date, "MMM, dd, yyyy")}
              </p>
            </div>
            {/* Time */}
            <div className="md:col-span-2 flex flex-col items-center">
              <p className="text-base font-medium">
                {appointment.TimeSlot.startTime} -{" "}
                {appointment.TimeSlot.endTime} {appointment.TimeSlot.period}
              </p>
              {/* <p className="text-xs text-muted-foreground">
            {getTimeOfDay(appointment.time)}
          </p> */}
            </div>

            {/* Book Btn */}

            <div className="flex justify-center md:justify-end">
              {appointment.TimeSlot.status === "DONE" ? (
                <Badge className="bg-green-500">Done</Badge>
              ) : appointment.TimeSlot.status === "CANCELLED" ? (
                <Badge className="bg-destructive">Cancelled by admin</Badge>
              ) : (
                <Button
                  variant={"destructive"}
                  onClick={() => {
                    setIsOpen(true);
                    setSelectedAppointment(appointment);
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        );
      })}

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this appointment?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/80"
              onClick={() => handleDeleteBooking(selectedAppointment)}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

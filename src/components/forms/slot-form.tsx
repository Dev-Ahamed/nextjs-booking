"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { slotSchema } from "@/schemas";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Plus, Trash } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TimeSlotPeriod } from "@prisma/client";

export function SlotForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof slotSchema>>({
    resolver: zodResolver(slotSchema),
    defaultValues: {
      date: undefined,
      timeSlots: [
        {
          startTime: "",
          endTime: "",
          period: undefined,
        },
      ],
    },
  });

  const { control } = form;

  const {
    fields: timeSlotFields,
    append: timeSlotAppend,
    remove: timeSlotRemove,
  } = useFieldArray({
    control,
    name: "timeSlots",
  });

  const removeTimeSlot = (index: number) => {
    if (timeSlotFields.length > 1) {
      timeSlotRemove(index);
    } else {
      toast.error("Atleast one timeslot is required");
    }
  };

  const handleTimeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: string) => void
  ) => {
    let value = event.target.value.replace(/[^0-9:]/g, "");
    if (value.length > 5) value = value.slice(0, 5);

    onChange(value);
  };

  async function onSubmit(values: z.infer<typeof slotSchema>) {
    startTransition(async () => {
      try {
        const res = await fetch("/api/appointment/create-slot", {
          method: "POST",
          body: JSON.stringify(values),
        });

        const result = await res.json();

        if (result.status === 200) {
          toast.success(result.message);
          form.reset();
          router.refresh();
          router.push("/admin");
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        console.log("createSlot error", error);
        toast.error("Something went wrong");
      }
    });
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date *</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(selectedDate) => {
                        if (selectedDate) {
                          const formattedDate = format(
                            selectedDate,
                            "MMM dd, yyyy"
                          );
                          field.onChange(formattedDate);
                        }
                      }}
                      disabled={{ before: new Date() }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {timeSlotFields.length > 0 && (
            <div className="flex flex-col gap-2">
              <Separator />
              <p className="font-medium text-lg">Timeslots</p>
            </div>
          )}

          {timeSlotFields.map((field, index) => (
            <div key={index} className="border p-2 rounded-md">
              <div className="flex justify-between items-center gap-2">
                <FormLabel className="text-base">Slot {index + 1}</FormLabel>
                <Button
                  onClick={() => removeTimeSlot(index)}
                  disabled={isPending}
                  type="button"
                  variant="secondary"
                  size={"sm"}
                >
                  <Trash />
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-start">
                <FormField
                  control={form.control}
                  name={`timeSlots.${index}.startTime`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Start Time *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value || ""}
                          onChange={(event) =>
                            handleTimeChange(event, field.onChange)
                          }
                          placeholder="HH:mm"
                          pattern="^([01][0-9]|2[0-3]):([0-5][0-9])$"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`timeSlots.${index}.endTime`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>End Time *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value || ""}
                          onChange={(event) =>
                            handleTimeChange(event, field.onChange)
                          }
                          placeholder="HH:mm"
                          pattern="^([01][0-9]|2[0-3]):([0-5][0-9])$"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`timeSlots.${index}.period`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Period *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a period" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(TimeSlotPeriod).map(
                            (period, index) => (
                              <SelectItem key={index} value={period}>
                                {period}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}

          <Button
            onClick={() =>
              timeSlotAppend({
                startTime: "",
                endTime: "",
                period: form.getValues(`timeSlots.0.period`),
              })
            }
            disabled={isPending}
            type="button"
          >
            <Plus />
            {timeSlotFields.length > 0 ? "Add More" : "Add Timeslot"}
          </Button>

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

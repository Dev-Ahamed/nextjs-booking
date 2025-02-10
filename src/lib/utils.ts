import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getTimeOfDay = (time: string) => {
  const [startTime] = time.split(" - ");
  const [hours, minutes] = startTime.split(":");

  const hour = parseInt(hours, 10);
  const period = time.split(" ")[3];

  if (period === "AM") {
    if (hour >= 6 && hour < 12) return "Morning";
    if (hour >= 12) return "Afternoon";
  } else if (period === "PM") {
    if (hour >= 12 && hour < 6) return "Afternoon";
    return "Evening";
  }

  return "Unknown";
};

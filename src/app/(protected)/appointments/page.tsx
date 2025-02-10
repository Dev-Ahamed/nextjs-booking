import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DatePicker } from "./components/date-picker";
import { ShowAppointments } from "./components/show-appointments";
import { getAppointmentsByDate } from "@/data/appointment";
import { format } from "date-fns";

export default async function AppointmentPage() {
  const today = format(new Date(), "yyyy-MM-dd");
  const appointmentsData = await getAppointmentsByDate(new Date(today));
  const appointments = appointmentsData?.appointments || [];

  return <ShowAppointments appointments={appointments} />;
}

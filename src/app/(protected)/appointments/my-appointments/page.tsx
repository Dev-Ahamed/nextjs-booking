import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShowMyAppointments } from "./components/show-my-appointments";
import { getMyAppointments } from "@/data/appointment";

export default async function MyAppointmentsPage() {
  let myAppointments = await getMyAppointments();

  if (!myAppointments) {
    myAppointments = [];
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Appointments</CardTitle>
        <CardDescription>Manage your appointments here!</CardDescription>
      </CardHeader>
      <CardContent>
        <Separator />

        <div className="mt-4">
          <div className="mt-4">
            {myAppointments.length === 0 ? (
              <div className="flex justify-center items-center hover:bg-accent p-2 h-28 transition-all duration-300 ease-in-out">
                <p className="text-muted-foreground text-sm">
                  No appointments found
                </p>
              </div>
            ) : (
              <ShowMyAppointments data={myAppointments} />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

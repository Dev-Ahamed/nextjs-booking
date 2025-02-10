import { AppointmentBookForm } from "@/components/forms/appointment-book-form";
import { BodyWrapper } from "@/components/global/body-wrapper";
import { getAppointmentById } from "@/data/appointment";
import { redirect } from "next/navigation";

interface AppointmentBookPageProps {
  params: { id: string };
}

export default async function AppointmentBookPage({
  params,
}: AppointmentBookPageProps) {
  const appointment = await getAppointmentById(params.id);

  if (appointment?.status !== "NOTBOOKED") {
    return redirect("/appointments");
  }

  return (
    <BodyWrapper>
      <div className="flex flex-col space-y-8">
        <div>
          <h1 className="text-2xl font-medium">Book your seat</h1>
        </div>
        <div>
          <AppointmentBookForm appointment={appointment} />
        </div>
      </div>
    </BodyWrapper>
  );
}

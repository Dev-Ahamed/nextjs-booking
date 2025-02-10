import { BodyWrapper } from "@/components/global/body-wrapper";
import { AppointmentDataTable } from "./components/appointment-data-table";
import { SlotsCreateBtn } from "./components/slots-create-btn";
import { getAllAppointments } from "@/data/appointment";

export const revalidate = 0;

export default async function AdminPage() {
  const appointmentsData = await getAllAppointments({
    pageIndex: 0,
    pageSize: 10,
  });

  const initialData = {
    data: appointmentsData?.appointments || [],
    totalRecords: appointmentsData?.totalRecords || 0,
  };

  return (
    <BodyWrapper>
      <div className="flex flex-col p-2 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-medium">All Appointments</h1>
            <p className="text-muted-foreground text-sm">
              Manage your appointments here
            </p>
          </div>
          <SlotsCreateBtn />
        </div>
        <AppointmentDataTable
          initialData={initialData}
          isAppointmentDeleteAllowed={true}
          isAppointmentEditAllowed={true}
        />
      </div>
    </BodyWrapper>
  );
}

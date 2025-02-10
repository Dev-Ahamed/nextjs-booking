"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { X } from "lucide-react";

import { AppointmentColumn, AppointmentColumns } from "./appointment-columns";
import { DataTable } from "@/components/data-table/data-table";
import { PaginationState } from "@tanstack/react-table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { toast } from "sonner";

type AppointmentDataTableProps = {
  initialData: {
    data: AppointmentColumn[];
    totalRecords: number;
  };
  isAppointmentEditAllowed: boolean;
  isAppointmentDeleteAllowed: boolean;
};

export const AppointmentDataTable = ({
  initialData,
  isAppointmentEditAllowed,
  isAppointmentDeleteAllowed,
}: AppointmentDataTableProps) => {
  const pathName = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const businessId = decodeURIComponent(pathName.split("/")[3]);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [totalRecords, setTotalRecords] = useState<number>(
    initialData.totalRecords
  );
  const [globalFilter, setGlobalFilter] = useState("");
  const [data, setData] = useState<AppointmentColumn[]>(initialData.data);
  const isFirstRender = useRef(true);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentColumn | null>(null);

  useEffect(() => {
    setData(initialData.data);
    setTotalRecords(initialData.totalRecords);
  }, [initialData]);

  const fetchData = useCallback(async () => {
    console.log(true);

    startTransition(async () => {
      try {
        const res = await fetch(
          `/api/appointment/getAllAppointments?&pageIndex=${pagination.pageIndex}&pageSize=${pagination.pageSize}&searchTerm=${globalFilter}`,
          { method: "GET" }
        );

        const result = await res.json();

        if (result.status === 200) {
          setData(result.data.appointmentsData);
          setTotalRecords(result.data.totalRecords);
        } else {
          setData([]);
          setTotalRecords(0);
        }
      } catch (error) {
        console.log("userFetchError", error);
      }
    });
  }, [pagination, globalFilter]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    fetchData();
  }, [fetchData]);

  const handleViewClick = (appointment: AppointmentColumn) => {
    setSheetOpen(true);
    setSelectedAppointment(appointment);
  };

  const handleEditClick = (appointment: AppointmentColumn) => {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/appointment/done-appointment`, {
          method: "POST",
          body: JSON.stringify(appointment),
        });

        const result = await res.json();

        if (result.status === 200) {
          router.refresh();
          console.log("Success");
        } else {
          toast.error(result.message, {
            action: {
              label: <X size={16} />,
              onClick: () => {},
            },
          });
        }
      } catch (error) {
        console.log("appointmentDoneError", error);
      }
    });
  };

  const handleDeleteClick = (appointment: AppointmentColumn) => {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/appointment/cancel-appointment`, {
          method: "POST",
          body: JSON.stringify(appointment),
        });

        const result = await res.json();

        if (result.status === 200) {
          router.refresh();
          console.log("Success");
        } else {
          toast.error(result.message, {
            action: {
              label: <X size={16} />,
              onClick: () => {},
            },
          });
        }
      } catch (error) {
        console.log("appointmentCancelError", error);
      }
    });
  };

  return (
    <>
      <DataTable
        data={data}
        columns={AppointmentColumns(
          handleViewClick,
          handleEditClick,
          handleDeleteClick,
          isAppointmentEditAllowed,
          isAppointmentDeleteAllowed
        )}
        pagination={pagination}
        setPagination={setPagination}
        totalRecords={totalRecords}
        setTotalRecords={setTotalRecords}
        isLoading={isPending}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        searchPlaceholder="Search appointments..."
      />

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        {/* <SheetTrigger>Open</SheetTrigger> */}
        <SheetContent
          side={"top"}
          className="m-4 rounded-md max-w-[95vh] max-h-[95vh] mx-auto overflow-y-auto"
        >
          <SheetHeader>
            <SheetTitle>User Detail</SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>

          <div className="w-full overflow-hidden">
            {JSON.stringify(selectedAppointment)}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

import { AppointmentSwitcher } from "@/components/appointments/appointment-switcher";
import { BodyWrapper } from "@/components/global/body-wrapper";

interface AppointmentLayoutProps {
  children: React.ReactNode;
}

export default function AppointmentLayout({
  children,
}: AppointmentLayoutProps) {
  return (
    <BodyWrapper>
      <div className="flex flex-col gap-4">
        <AppointmentSwitcher />
        <div>{children}</div>
      </div>
    </BodyWrapper>
  );
}

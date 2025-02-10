import { SlotForm } from "@/components/forms/slot-form";
import { BodyWrapper } from "@/components/global/body-wrapper";
import { Card, CardContent } from "@/components/ui/card";

export default function CreateAppointmentPage() {
  return (
    <BodyWrapper>
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-medium">Create a slot</h1>
        </div>
        <div className="flex justify-center">
          <Card className="w-full">
            <CardContent className="p-6">
              <SlotForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </BodyWrapper>
  );
}

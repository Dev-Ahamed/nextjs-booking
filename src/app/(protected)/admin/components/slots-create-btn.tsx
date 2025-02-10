"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const SlotsCreateBtn = () => {
  const router = useRouter();

  return (
    <div>
      <Button
        onClick={() => router.push(`/admin/create-slots`)}
        variant={"outline"}
      >
        <Plus />
        <span>Create</span>
      </Button>
    </div>
  );
};

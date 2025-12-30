"use client";

import { AdminHeader } from "@/components/admin-header";
import { WorkshopForm } from "@/components/workshop-form";

export default function NewWorkshopPage() {
  return (
    <>
      <AdminHeader />
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Nieuwe workshop</h1>
          <p className="text-muted-foreground">
            Maak een nieuwe workshop aan met prijzen en varianten.
          </p>
        </div>

        <WorkshopForm mode="create" />
      </div>
    </>
  );
}

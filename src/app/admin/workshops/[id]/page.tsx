"use client";

import { use } from "react";
import { AdminHeader } from "@/components/admin-header";
import { WorkshopForm } from "@/components/workshop-form";
import { api } from "@/trpc/client";
import { IconLoader2 } from "@tabler/icons-react";
import type { WorkshopFormValues } from "@/lib/validations/workshop";

type Props = {
  params: Promise<{ id: string }>;
};

export default function EditWorkshopPage({ params }: Props) {
  const { id } = use(params);
  const {
    data: workshop,
    isLoading,
    error,
  } = api.workshop.getById.useQuery({ id });

  if (isLoading) {
    return (
      <>
        <AdminHeader />
        <div className="flex flex-1 items-center justify-center p-4">
          <IconLoader2 className="h-8 w-8 animate-spin" />
        </div>
      </>
    );
  }

  if (error || !workshop) {
    return (
      <>
        <AdminHeader />
        <div className="flex flex-1 flex-col items-center justify-center gap-2 p-4">
          <p className="text-destructive">Workshop niet gevonden</p>
          <a href="/admin/workshops" className="text-primary underline">
            Terug naar overzicht
          </a>
        </div>
      </>
    );
  }

  // Transform workshop data to form values
  const formData: WorkshopFormValues & { id: string } = {
    id: workshop.id,
    slug: workshop.slug,
    title: workshop.title,
    subtitle: workshop.subtitle,
    description: workshop.description,
    longDescription: workshop.longDescription ?? "",
    image: workshop.image ?? "",
    video: workshop.video ?? "",
    duration: workshop.duration,
    groupSize: workshop.groupSize,
    location: workshop.location,
    categories: workshop.categories,
    includes: workshop.includes,
    isPublished: workshop.isPublished,
    sortOrder: workshop.sortOrder,
    priceTiers: workshop.priceTiers.map((t) => ({
      id: t.id,
      groupSize: t.groupSize,
      minParticipants: t.minParticipants,
      maxParticipants: t.maxParticipants,
      priceExclBtw: t.priceExclBtw,
      priceInclBtw: t.priceInclBtw,
      sortOrder: t.sortOrder,
    })),
    variants: workshop.variants.map((v) => ({
      id: v.id,
      name: v.name,
      description: v.description,
      duration: v.duration,
      includes: v.includes,
      sortOrder: v.sortOrder,
      priceTiers: v.priceTiers.map((t) => ({
        id: t.id,
        groupSize: t.groupSize,
        minParticipants: t.minParticipants,
        maxParticipants: t.maxParticipants,
        priceExclBtw: t.priceExclBtw,
        priceInclBtw: t.priceInclBtw,
        sortOrder: t.sortOrder,
      })),
    })),
  };

  return (
    <>
      <AdminHeader />
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Workshop bewerken
          </h1>
          <p className="text-muted-foreground">
            Bewerk de gegevens van &quot;{workshop.title}&quot;.
          </p>
        </div>

        <WorkshopForm mode="edit" initialData={formData} />
      </div>
    </>
  );
}

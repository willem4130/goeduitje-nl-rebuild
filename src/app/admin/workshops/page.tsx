"use client";

import { AdminHeader } from "@/components/admin-header";
import { api } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  IconEdit,
  IconTrash,
  IconLoader2,
  IconToolsKitchen2,
  IconEye,
  IconEyeOff,
} from "@tabler/icons-react";
import { toast } from "sonner";
import Link from "next/link";

export default function AdminWorkshopsPage() {
  const { data: workshops, isLoading } = api.workshop.list.useQuery({
    includeUnpublished: true,
  });
  const utils = api.useUtils();

  // We'll add these mutations to the workshop router
  const togglePublish = api.workshop.togglePublish.useMutation({
    onSuccess: () => {
      utils.workshop.list.invalidate();
      toast.success("Workshop bijgewerkt");
    },
  });

  const deleteWorkshop = api.workshop.delete.useMutation({
    onSuccess: () => {
      toast.success("Workshop verwijderd");
      utils.workshop.list.invalidate();
    },
    onError: () => {
      toast.error("Verwijderen mislukt");
    },
  });

  // Get lowest price from a workshop
  const getLowestPrice = (
    workshop: NonNullable<typeof workshops>[number]
  ): number => {
    let lowest = Infinity;
    for (const tier of workshop.priceTiers) {
      if (tier.priceExclBtw < lowest) lowest = tier.priceExclBtw;
    }
    for (const variant of workshop.variants) {
      for (const tier of variant.priceTiers) {
        if (tier.priceExclBtw < lowest) lowest = tier.priceExclBtw;
      }
    }
    return lowest === Infinity ? 0 : lowest;
  };

  return (
    <>
      <AdminHeader />
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Workshops</h1>
            <p className="text-muted-foreground">
              Beheer workshops, varianten en prijzen.
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/workshops/new">
              <IconToolsKitchen2 className="mr-2 h-4 w-4" />
              Nieuwe workshop
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Alle workshops</CardTitle>
            <CardDescription>
              {workshops?.length ?? 0} workshop(s) in het systeem
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <IconLoader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : workshops && workshops.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Workshop</TableHead>
                    <TableHead>Varianten</TableHead>
                    <TableHead>Prijs vanaf</TableHead>
                    <TableHead>Groepsgrootte</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Acties</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workshops.map((workshop) => (
                    <TableRow key={workshop.id}>
                      <TableCell>
                        <div>
                          <div className="font-semibold">{workshop.title}</div>
                          <div className="text-muted-foreground text-sm">
                            {workshop.subtitle}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {workshop.variants.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {workshop.variants.slice(0, 3).map((v) => (
                              <Badge key={v.id} variant="outline">
                                {v.name}
                              </Badge>
                            ))}
                            {workshop.variants.length > 3 && (
                              <Badge variant="secondary">
                                +{workshop.variants.length - 3}
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>€{getLowestPrice(workshop)}</TableCell>
                      <TableCell>{workshop.groupSize}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            workshop.isPublished ? "default" : "secondary"
                          }
                        >
                          {workshop.isPublished ? "Gepubliceerd" : "Concept"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              togglePublish.mutate({
                                id: workshop.id,
                                isPublished: !workshop.isPublished,
                              })
                            }
                            title={
                              workshop.isPublished ? "Verbergen" : "Publiceren"
                            }
                          >
                            {workshop.isPublished ? (
                              <IconEyeOff className="h-4 w-4" />
                            ) : (
                              <IconEye className="h-4 w-4" />
                            )}
                          </Button>

                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/admin/workshops/${workshop.id}`}>
                              <IconEdit className="h-4 w-4" />
                            </Link>
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <IconTrash className="text-destructive h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Workshop verwijderen?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Weet je zeker dat je &quot;{workshop.title}
                                  &quot; wilt verwijderen? Dit verwijdert ook
                                  alle varianten en prijzen. Deze actie kan niet
                                  ongedaan worden gemaakt.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuleren</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    deleteWorkshop.mutate({ id: workshop.id })
                                  }
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Verwijderen
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-muted-foreground py-8 text-center">
                Geen workshops gevonden. Run de seed script om workshops toe te
                voegen.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

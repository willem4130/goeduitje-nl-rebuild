"use client";

import { useState } from "react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  IconEdit,
  IconTrash,
  IconLoader2,
  IconPlus,
  IconEye,
  IconEyeOff,
  IconStar,
  IconStarFilled,
  IconQuote,
} from "@tabler/icons-react";
import { toast } from "sonner";

type Testimonial = {
  id: string;
  quote: string;
  author: string;
  role: string | null;
  company: string | null;
  rating: number;
  image: string | null;
  isFeatured: boolean;
  isPublished: boolean;
};

const emptyForm = {
  quote: "",
  author: "",
  role: "",
  company: "",
  rating: 5,
  image: "",
};

export default function AdminTestimonialsPage() {
  const [editingTestimonial, setEditingTestimonial] =
    useState<Testimonial | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState(emptyForm);

  const { data: testimonials, isLoading } = api.testimonials.getAll.useQuery({
    includeUnpublished: true,
  });
  const utils = api.useUtils();

  const createTestimonial = api.testimonials.create.useMutation({
    onSuccess: () => {
      toast.success("Testimonial toegevoegd");
      utils.testimonials.getAll.invalidate();
      setIsCreateOpen(false);
      setFormData(emptyForm);
    },
    onError: () => toast.error("Toevoegen mislukt"),
  });

  const updateTestimonial = api.testimonials.update.useMutation({
    onSuccess: () => {
      toast.success("Testimonial bijgewerkt");
      utils.testimonials.getAll.invalidate();
      setEditingTestimonial(null);
    },
    onError: () => toast.error("Bijwerken mislukt"),
  });

  const deleteTestimonial = api.testimonials.delete.useMutation({
    onSuccess: () => {
      toast.success("Testimonial verwijderd");
      utils.testimonials.getAll.invalidate();
    },
    onError: () => toast.error("Verwijderen mislukt"),
  });

  const togglePublish = api.testimonials.togglePublish.useMutation({
    onSuccess: () => {
      utils.testimonials.getAll.invalidate();
      toast.success("Testimonial bijgewerkt");
    },
  });

  const toggleFeatured = api.testimonials.toggleFeatured.useMutation({
    onSuccess: () => {
      utils.testimonials.getAll.invalidate();
      toast.success("Testimonial bijgewerkt");
    },
  });

  const RatingStars = ({
    rating,
    onChange,
  }: {
    rating: number;
    onChange?: (r: number) => void;
  }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          disabled={!onChange}
          className={onChange ? "cursor-pointer" : "cursor-default"}
        >
          {star <= rating ? (
            <IconStarFilled className="h-4 w-4 text-yellow-500" />
          ) : (
            <IconStar className="text-muted-foreground h-4 w-4" />
          )}
        </button>
      ))}
    </div>
  );

  return (
    <>
      <AdminHeader />
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Testimonials</h1>
            <p className="text-muted-foreground">
              Beheer klantbeoordelingen en quotes.
            </p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <IconPlus className="mr-2 h-4 w-4" />
                Nieuwe testimonial
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Nieuwe testimonial toevoegen</DialogTitle>
                <DialogDescription>
                  Voeg een nieuwe klantbeoordeling toe.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Quote *</Label>
                  <Textarea
                    value={formData.quote}
                    onChange={(e) =>
                      setFormData({ ...formData, quote: e.target.value })
                    }
                    placeholder="De testimonial quote..."
                    className="min-h-24"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Auteur *</Label>
                    <Input
                      value={formData.author}
                      onChange={(e) =>
                        setFormData({ ...formData, author: e.target.value })
                      }
                      placeholder="Naam van de auteur"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Rol/Functie</Label>
                    <Input
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                      placeholder="bijv. CEO, Manager"
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Bedrijf</Label>
                    <Input
                      value={formData.company}
                      onChange={(e) =>
                        setFormData({ ...formData, company: e.target.value })
                      }
                      placeholder="Naam van het bedrijf"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Afbeelding URL</Label>
                    <Input
                      value={formData.image}
                      onChange={(e) =>
                        setFormData({ ...formData, image: e.target.value })
                      }
                      placeholder="/images/testimonials/..."
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Beoordeling</Label>
                  <RatingStars
                    rating={formData.rating}
                    onChange={(r) => setFormData({ ...formData, rating: r })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                >
                  Annuleren
                </Button>
                <Button
                  onClick={() => createTestimonial.mutate(formData)}
                  disabled={createTestimonial.isPending}
                >
                  {createTestimonial.isPending && (
                    <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Toevoegen
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconQuote className="h-5 w-5" />
              Alle testimonials
            </CardTitle>
            <CardDescription>
              {testimonials?.length ?? 0} testimonial(s) in het systeem
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <IconLoader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : testimonials && testimonials.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Auteur</TableHead>
                    <TableHead>Quote</TableHead>
                    <TableHead>Beoordeling</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Acties</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testimonials.map((testimonial) => (
                    <TableRow key={testimonial.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {testimonial.author}
                          </div>
                          {(testimonial.role || testimonial.company) && (
                            <div className="text-muted-foreground text-sm">
                              {[testimonial.role, testimonial.company]
                                .filter(Boolean)
                                .join(", ")}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate">
                          {testimonial.quote}
                        </div>
                      </TableCell>
                      <TableCell>
                        <RatingStars rating={testimonial.rating} />
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          <Badge
                            variant={
                              testimonial.isPublished ? "default" : "secondary"
                            }
                          >
                            {testimonial.isPublished
                              ? "Gepubliceerd"
                              : "Concept"}
                          </Badge>
                          {testimonial.isFeatured && (
                            <Badge variant="outline">Uitgelicht</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              toggleFeatured.mutate({
                                id: testimonial.id,
                                isFeatured: !testimonial.isFeatured,
                              })
                            }
                            title={
                              testimonial.isFeatured
                                ? "Niet meer uitlichten"
                                : "Uitlichten"
                            }
                          >
                            {testimonial.isFeatured ? (
                              <IconStarFilled className="h-4 w-4 text-yellow-500" />
                            ) : (
                              <IconStar className="h-4 w-4" />
                            )}
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              togglePublish.mutate({
                                id: testimonial.id,
                                isPublished: !testimonial.isPublished,
                              })
                            }
                          >
                            {testimonial.isPublished ? (
                              <IconEyeOff className="h-4 w-4" />
                            ) : (
                              <IconEye className="h-4 w-4" />
                            )}
                          </Button>

                          <Dialog
                            open={editingTestimonial?.id === testimonial.id}
                            onOpenChange={(open) =>
                              !open && setEditingTestimonial(null)
                            }
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  setEditingTestimonial(testimonial)
                                }
                              >
                                <IconEdit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Testimonial bewerken</DialogTitle>
                              </DialogHeader>
                              {editingTestimonial && (
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <Label>Quote *</Label>
                                    <Textarea
                                      value={editingTestimonial.quote}
                                      onChange={(e) =>
                                        setEditingTestimonial({
                                          ...editingTestimonial,
                                          quote: e.target.value,
                                        })
                                      }
                                      className="min-h-24"
                                    />
                                  </div>
                                  <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                      <Label>Auteur *</Label>
                                      <Input
                                        value={editingTestimonial.author}
                                        onChange={(e) =>
                                          setEditingTestimonial({
                                            ...editingTestimonial,
                                            author: e.target.value,
                                          })
                                        }
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Rol/Functie</Label>
                                      <Input
                                        value={editingTestimonial.role || ""}
                                        onChange={(e) =>
                                          setEditingTestimonial({
                                            ...editingTestimonial,
                                            role: e.target.value,
                                          })
                                        }
                                      />
                                    </div>
                                  </div>
                                  <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                      <Label>Bedrijf</Label>
                                      <Input
                                        value={editingTestimonial.company || ""}
                                        onChange={(e) =>
                                          setEditingTestimonial({
                                            ...editingTestimonial,
                                            company: e.target.value,
                                          })
                                        }
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Afbeelding URL</Label>
                                      <Input
                                        value={editingTestimonial.image || ""}
                                        onChange={(e) =>
                                          setEditingTestimonial({
                                            ...editingTestimonial,
                                            image: e.target.value,
                                          })
                                        }
                                      />
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Beoordeling</Label>
                                    <RatingStars
                                      rating={editingTestimonial.rating}
                                      onChange={(r) =>
                                        setEditingTestimonial({
                                          ...editingTestimonial,
                                          rating: r,
                                        })
                                      }
                                    />
                                  </div>
                                </div>
                              )}
                              <DialogFooter>
                                <Button
                                  variant="outline"
                                  onClick={() => setEditingTestimonial(null)}
                                >
                                  Annuleren
                                </Button>
                                <Button
                                  onClick={() =>
                                    editingTestimonial &&
                                    updateTestimonial.mutate({
                                      id: editingTestimonial.id,
                                      quote: editingTestimonial.quote,
                                      author: editingTestimonial.author,
                                      role:
                                        editingTestimonial.role || undefined,
                                      company:
                                        editingTestimonial.company || undefined,
                                      rating: editingTestimonial.rating,
                                      image:
                                        editingTestimonial.image || undefined,
                                    })
                                  }
                                  disabled={updateTestimonial.isPending}
                                >
                                  {updateTestimonial.isPending && (
                                    <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                                  )}
                                  Opslaan
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <IconTrash className="text-destructive h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Testimonial verwijderen?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Weet je zeker dat je deze testimonial wilt
                                  verwijderen?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuleren</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    deleteTestimonial.mutate({
                                      id: testimonial.id,
                                    })
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
                Geen testimonials gevonden. Voeg er een toe om te beginnen.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

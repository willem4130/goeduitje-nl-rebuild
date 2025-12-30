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
  IconQuestionMark,
} from "@tabler/icons-react";
import { toast } from "sonner";

type FAQ = {
  id: string;
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
  isPublished: boolean;
};

export default function AdminFAQPage() {
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "",
  });

  const { data: faqs, isLoading } = api.faq.getAll.useQuery({
    includeUnpublished: true,
  });
  const utils = api.useUtils();

  const createFAQ = api.faq.create.useMutation({
    onSuccess: () => {
      toast.success("FAQ toegevoegd");
      utils.faq.getAll.invalidate();
      setIsCreateOpen(false);
      setFormData({ question: "", answer: "", category: "" });
    },
    onError: () => toast.error("Toevoegen mislukt"),
  });

  const updateFAQ = api.faq.update.useMutation({
    onSuccess: () => {
      toast.success("FAQ bijgewerkt");
      utils.faq.getAll.invalidate();
      setEditingFAQ(null);
    },
    onError: () => toast.error("Bijwerken mislukt"),
  });

  const deleteFAQ = api.faq.delete.useMutation({
    onSuccess: () => {
      toast.success("FAQ verwijderd");
      utils.faq.getAll.invalidate();
    },
    onError: () => toast.error("Verwijderen mislukt"),
  });

  const togglePublish = api.faq.togglePublish.useMutation({
    onSuccess: () => {
      utils.faq.getAll.invalidate();
      toast.success("FAQ bijgewerkt");
    },
  });

  const categories = [...new Set(faqs?.map((f) => f.category) || [])];

  return (
    <>
      <AdminHeader />
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">FAQ</h1>
            <p className="text-muted-foreground">
              Beheer veelgestelde vragen en antwoorden.
            </p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <IconPlus className="mr-2 h-4 w-4" />
                Nieuwe FAQ
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Nieuwe FAQ toevoegen</DialogTitle>
                <DialogDescription>
                  Voeg een nieuwe vraag en antwoord toe.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Categorie</Label>
                  <Input
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    placeholder="bijv. Boekingen, Workshops, Algemeen"
                    list="categories"
                  />
                  <datalist id="categories">
                    {categories.map((cat) => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                </div>
                <div className="space-y-2">
                  <Label>Vraag</Label>
                  <Input
                    value={formData.question}
                    onChange={(e) =>
                      setFormData({ ...formData, question: e.target.value })
                    }
                    placeholder="De vraag..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Antwoord</Label>
                  <Textarea
                    value={formData.answer}
                    onChange={(e) =>
                      setFormData({ ...formData, answer: e.target.value })
                    }
                    placeholder="Het antwoord..."
                    className="min-h-32"
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
                  onClick={() => createFAQ.mutate(formData)}
                  disabled={createFAQ.isPending}
                >
                  {createFAQ.isPending && (
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
              <IconQuestionMark className="h-5 w-5" />
              Alle vragen
            </CardTitle>
            <CardDescription>
              {faqs?.length ?? 0} FAQ(s) in het systeem
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <IconLoader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : faqs && faqs.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Categorie</TableHead>
                    <TableHead>Vraag</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Acties</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {faqs.map((faq) => (
                    <TableRow key={faq.id}>
                      <TableCell>
                        <Badge variant="outline">{faq.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-md truncate font-medium">
                          {faq.question}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={faq.isPublished ? "default" : "secondary"}
                        >
                          {faq.isPublished ? "Gepubliceerd" : "Concept"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              togglePublish.mutate({
                                id: faq.id,
                                isPublished: !faq.isPublished,
                              })
                            }
                          >
                            {faq.isPublished ? (
                              <IconEyeOff className="h-4 w-4" />
                            ) : (
                              <IconEye className="h-4 w-4" />
                            )}
                          </Button>

                          <Dialog
                            open={editingFAQ?.id === faq.id}
                            onOpenChange={(open) =>
                              !open && setEditingFAQ(null)
                            }
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setEditingFAQ(faq)}
                              >
                                <IconEdit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>FAQ bewerken</DialogTitle>
                              </DialogHeader>
                              {editingFAQ && (
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <Label>Categorie</Label>
                                    <Input
                                      value={editingFAQ.category}
                                      onChange={(e) =>
                                        setEditingFAQ({
                                          ...editingFAQ,
                                          category: e.target.value,
                                        })
                                      }
                                      list="categories-edit"
                                    />
                                    <datalist id="categories-edit">
                                      {categories.map((cat) => (
                                        <option key={cat} value={cat} />
                                      ))}
                                    </datalist>
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Vraag</Label>
                                    <Input
                                      value={editingFAQ.question}
                                      onChange={(e) =>
                                        setEditingFAQ({
                                          ...editingFAQ,
                                          question: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Antwoord</Label>
                                    <Textarea
                                      value={editingFAQ.answer}
                                      onChange={(e) =>
                                        setEditingFAQ({
                                          ...editingFAQ,
                                          answer: e.target.value,
                                        })
                                      }
                                      className="min-h-32"
                                    />
                                  </div>
                                </div>
                              )}
                              <DialogFooter>
                                <Button
                                  variant="outline"
                                  onClick={() => setEditingFAQ(null)}
                                >
                                  Annuleren
                                </Button>
                                <Button
                                  onClick={() =>
                                    editingFAQ &&
                                    updateFAQ.mutate({
                                      id: editingFAQ.id,
                                      question: editingFAQ.question,
                                      answer: editingFAQ.answer,
                                      category: editingFAQ.category,
                                    })
                                  }
                                  disabled={updateFAQ.isPending}
                                >
                                  {updateFAQ.isPending && (
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
                                  FAQ verwijderen?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Weet je zeker dat je deze FAQ wilt
                                  verwijderen?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuleren</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    deleteFAQ.mutate({ id: faq.id })
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
                Geen FAQs gevonden. Voeg er een toe om te beginnen.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

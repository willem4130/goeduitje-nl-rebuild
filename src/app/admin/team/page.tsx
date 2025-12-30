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
  IconUsers,
} from "@tabler/icons-react";
import { toast } from "sonner";

type TeamMember = {
  id: string;
  name: string;
  role: string;
  origin: string | null;
  bio: string;
  quote: string | null;
  image: string | null;
  sortOrder: number;
  isPublished: boolean;
};

const emptyForm = {
  name: "",
  role: "",
  origin: "",
  bio: "",
  quote: "",
  image: "",
};

export default function AdminTeamPage() {
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState(emptyForm);

  const { data: members, isLoading } = api.team.getAll.useQuery({
    includeUnpublished: true,
  });
  const utils = api.useUtils();

  const createMember = api.team.create.useMutation({
    onSuccess: () => {
      toast.success("Teamlid toegevoegd");
      utils.team.getAll.invalidate();
      setIsCreateOpen(false);
      setFormData(emptyForm);
    },
    onError: () => toast.error("Toevoegen mislukt"),
  });

  const updateMember = api.team.update.useMutation({
    onSuccess: () => {
      toast.success("Teamlid bijgewerkt");
      utils.team.getAll.invalidate();
      setEditingMember(null);
    },
    onError: () => toast.error("Bijwerken mislukt"),
  });

  const deleteMember = api.team.delete.useMutation({
    onSuccess: () => {
      toast.success("Teamlid verwijderd");
      utils.team.getAll.invalidate();
    },
    onError: () => toast.error("Verwijderen mislukt"),
  });

  const togglePublish = api.team.togglePublish.useMutation({
    onSuccess: () => {
      utils.team.getAll.invalidate();
      toast.success("Teamlid bijgewerkt");
    },
  });

  return (
    <>
      <AdminHeader />
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Team</h1>
            <p className="text-muted-foreground">
              Beheer teamleden en hun profielen.
            </p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <IconPlus className="mr-2 h-4 w-4" />
                Nieuw teamlid
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Nieuw teamlid toevoegen</DialogTitle>
                <DialogDescription>
                  Voeg een nieuw teamlid toe.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Naam *</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Volledige naam"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Rol *</Label>
                    <Input
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                      placeholder="bijv. Chef-kok, Manager"
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Afkomst</Label>
                    <Input
                      value={formData.origin}
                      onChange={(e) =>
                        setFormData({ ...formData, origin: e.target.value })
                      }
                      placeholder="bijv. Marokko, Nederland"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Afbeelding URL</Label>
                    <Input
                      value={formData.image}
                      onChange={(e) =>
                        setFormData({ ...formData, image: e.target.value })
                      }
                      placeholder="/images/team/naam.jpg"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Bio *</Label>
                  <Textarea
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    placeholder="Korte biografie..."
                    className="min-h-24"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Quote</Label>
                  <Textarea
                    value={formData.quote}
                    onChange={(e) =>
                      setFormData({ ...formData, quote: e.target.value })
                    }
                    placeholder="Een persoonlijke quote..."
                    className="min-h-16"
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
                  onClick={() => createMember.mutate(formData)}
                  disabled={createMember.isPending}
                >
                  {createMember.isPending && (
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
              <IconUsers className="h-5 w-5" />
              Alle teamleden
            </CardTitle>
            <CardDescription>
              {members?.length ?? 0} teamlid/leden in het systeem
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <IconLoader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : members && members.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Naam</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Afkomst</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Acties</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">
                        {member.name}
                      </TableCell>
                      <TableCell>{member.role}</TableCell>
                      <TableCell>{member.origin || "-"}</TableCell>
                      <TableCell>
                        <Badge
                          variant={member.isPublished ? "default" : "secondary"}
                        >
                          {member.isPublished ? "Gepubliceerd" : "Concept"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              togglePublish.mutate({
                                id: member.id,
                                isPublished: !member.isPublished,
                              })
                            }
                          >
                            {member.isPublished ? (
                              <IconEyeOff className="h-4 w-4" />
                            ) : (
                              <IconEye className="h-4 w-4" />
                            )}
                          </Button>

                          <Dialog
                            open={editingMember?.id === member.id}
                            onOpenChange={(open) =>
                              !open && setEditingMember(null)
                            }
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setEditingMember(member)}
                              >
                                <IconEdit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Teamlid bewerken</DialogTitle>
                              </DialogHeader>
                              {editingMember && (
                                <div className="space-y-4">
                                  <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                      <Label>Naam *</Label>
                                      <Input
                                        value={editingMember.name}
                                        onChange={(e) =>
                                          setEditingMember({
                                            ...editingMember,
                                            name: e.target.value,
                                          })
                                        }
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Rol *</Label>
                                      <Input
                                        value={editingMember.role}
                                        onChange={(e) =>
                                          setEditingMember({
                                            ...editingMember,
                                            role: e.target.value,
                                          })
                                        }
                                      />
                                    </div>
                                  </div>
                                  <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                      <Label>Afkomst</Label>
                                      <Input
                                        value={editingMember.origin || ""}
                                        onChange={(e) =>
                                          setEditingMember({
                                            ...editingMember,
                                            origin: e.target.value,
                                          })
                                        }
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Afbeelding URL</Label>
                                      <Input
                                        value={editingMember.image || ""}
                                        onChange={(e) =>
                                          setEditingMember({
                                            ...editingMember,
                                            image: e.target.value,
                                          })
                                        }
                                      />
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Bio *</Label>
                                    <Textarea
                                      value={editingMember.bio}
                                      onChange={(e) =>
                                        setEditingMember({
                                          ...editingMember,
                                          bio: e.target.value,
                                        })
                                      }
                                      className="min-h-24"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Quote</Label>
                                    <Textarea
                                      value={editingMember.quote || ""}
                                      onChange={(e) =>
                                        setEditingMember({
                                          ...editingMember,
                                          quote: e.target.value,
                                        })
                                      }
                                      className="min-h-16"
                                    />
                                  </div>
                                </div>
                              )}
                              <DialogFooter>
                                <Button
                                  variant="outline"
                                  onClick={() => setEditingMember(null)}
                                >
                                  Annuleren
                                </Button>
                                <Button
                                  onClick={() =>
                                    editingMember &&
                                    updateMember.mutate({
                                      id: editingMember.id,
                                      name: editingMember.name,
                                      role: editingMember.role,
                                      origin: editingMember.origin || undefined,
                                      bio: editingMember.bio,
                                      quote: editingMember.quote || undefined,
                                      image: editingMember.image || undefined,
                                    })
                                  }
                                  disabled={updateMember.isPending}
                                >
                                  {updateMember.isPending && (
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
                                  Teamlid verwijderen?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Weet je zeker dat je {member.name} wilt
                                  verwijderen?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuleren</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    deleteMember.mutate({ id: member.id })
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
                Geen teamleden gevonden. Voeg er een toe om te beginnen.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

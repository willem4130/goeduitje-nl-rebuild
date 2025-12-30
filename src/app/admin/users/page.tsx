"use client";

import { useState } from "react";
import { AdminHeader } from "@/components/admin-header";
import { UserManagementForm } from "@/components/user-management-form";
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
import {
  IconEdit,
  IconTrash,
  IconUserPlus,
  IconLoader2,
} from "@tabler/icons-react";
import { toast } from "sonner";

export default function AdminUsersPage() {
  const [editingUser, setEditingUser] = useState<{
    id: string;
    name: string | null;
    email: string;
    role: string;
    bio?: string | null;
  } | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data: users, isLoading } = api.user.getAll.useQuery();
  const utils = api.useUtils();

  const deleteUser = api.user.delete.useMutation({
    onSuccess: () => {
      toast.success("Gebruiker verwijderd");
      utils.user.getAll.invalidate();
    },
    onError: () => {
      toast.error("Verwijderen mislukt");
    },
  });

  const roleColors: Record<string, "default" | "secondary" | "destructive"> = {
    admin: "destructive",
    moderator: "secondary",
    user: "default",
  };

  return (
    <>
      <AdminHeader />
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Gebruikers</h1>
            <p className="text-muted-foreground">
              Beheer gebruikersaccounts en rechten.
            </p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <IconUserPlus className="mr-2 h-4 w-4" />
                Nieuwe gebruiker
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Nieuwe gebruiker</DialogTitle>
                <DialogDescription>
                  Voeg een nieuwe gebruiker toe aan het systeem.
                </DialogDescription>
              </DialogHeader>
              <UserManagementForm
                mode="create"
                onSuccess={() => setIsCreateOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Alle gebruikers</CardTitle>
            <CardDescription>
              {users?.length ?? 0} gebruiker(s) geregistreerd
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <IconLoader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : users && users.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Naam</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Aangemaakt</TableHead>
                    <TableHead className="text-right">Acties</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.name || "-"}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={roleColors[user.role] ?? "default"}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString("nl-NL")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog
                            open={editingUser?.id === user.id}
                            onOpenChange={(open: boolean) =>
                              !open && setEditingUser(null)
                            }
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setEditingUser(user)}
                              >
                                <IconEdit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Gebruiker bewerken</DialogTitle>
                                <DialogDescription>
                                  Wijzig de gegevens van{" "}
                                  {user.name || user.email}
                                </DialogDescription>
                              </DialogHeader>
                              {editingUser && (
                                <UserManagementForm
                                  mode="edit"
                                  user={{
                                    id: editingUser.id,
                                    name: editingUser.name || "",
                                    email: editingUser.email,
                                    role: editingUser.role as
                                      | "user"
                                      | "moderator"
                                      | "admin",
                                    bio: editingUser.bio || "",
                                  }}
                                  onSuccess={() => setEditingUser(null)}
                                  onCancel={() => setEditingUser(null)}
                                />
                              )}
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
                                  Gebruiker verwijderen?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Weet je zeker dat je {user.name || user.email}{" "}
                                  wilt verwijderen? Deze actie kan niet ongedaan
                                  worden gemaakt.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuleren</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    deleteUser.mutate({ id: user.id })
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
                Nog geen gebruikers. Klik op &quot;Nieuwe gebruiker&quot; om te
                beginnen.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

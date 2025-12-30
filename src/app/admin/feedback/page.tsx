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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  IconTrash,
  IconLoader2,
  IconMail,
  IconMailOpened,
  IconEye,
  IconInbox,
} from "@tabler/icons-react";
import { toast } from "sonner";

export default function AdminFeedbackPage() {
  const { data: feedback, isLoading } = api.feedback.getAll.useQuery();
  const { data: stats } = api.feedback.getStats.useQuery();
  const utils = api.useUtils();

  const toggleRead = api.feedback.toggleRead.useMutation({
    onSuccess: () => {
      utils.feedback.getAll.invalidate();
      utils.feedback.getStats.invalidate();
    },
  });

  const deleteFeedback = api.feedback.delete.useMutation({
    onSuccess: () => {
      toast.success("Bericht verwijderd");
      utils.feedback.getAll.invalidate();
      utils.feedback.getStats.invalidate();
    },
    onError: () => {
      toast.error("Verwijderen mislukt");
    },
  });

  return (
    <>
      <AdminHeader />
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">
              Berichten & Feedback
            </h1>
            <p className="text-muted-foreground">
              Bekijk en beheer contactformulier inzendingen.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Totaal berichten</CardDescription>
              <CardTitle className="text-3xl">{stats?.total ?? 0}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Ongelezen</CardDescription>
              <CardTitle className="text-3xl text-orange-500">
                {stats?.unread ?? 0}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Gem. beoordeling</CardDescription>
              <CardTitle className="text-3xl">
                {stats?.averageRating ? stats.averageRating.toFixed(1) : "-"}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconInbox className="h-5 w-5" />
              Inbox
            </CardTitle>
            <CardDescription>
              {feedback?.filter((f) => !f.isRead).length ?? 0} ongelezen
              bericht(en)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <IconLoader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : feedback && feedback.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-8"></TableHead>
                    <TableHead>Van</TableHead>
                    <TableHead>Onderwerp</TableHead>
                    <TableHead>Datum</TableHead>
                    <TableHead className="text-right">Acties</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feedback.map((item) => (
                    <TableRow
                      key={item.id}
                      className={item.isRead ? "opacity-60" : ""}
                    >
                      <TableCell>
                        {item.isRead ? (
                          <IconMailOpened className="text-muted-foreground h-4 w-4" />
                        ) : (
                          <IconMail className="text-primary h-4 w-4" />
                        )}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className={item.isRead ? "" : "font-semibold"}>
                            {item.name}
                          </div>
                          <div className="text-muted-foreground text-sm">
                            {item.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={item.isRead ? "" : "font-semibold"}>
                          {item.subject || "Contact formulier"}
                        </div>
                        <div className="text-muted-foreground max-w-[200px] truncate text-sm">
                          {item.message.substring(0, 50)}...
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(item.createdAt).toLocaleDateString("nl-NL", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  if (!item.isRead) {
                                    toggleRead.mutate({
                                      id: item.id,
                                      isRead: true,
                                    });
                                  }
                                }}
                              >
                                <IconEye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>
                                  {item.subject || "Contact formulier"}
                                </DialogTitle>
                                <DialogDescription>
                                  Van {item.name} ({item.email}) op{" "}
                                  {new Date(item.createdAt).toLocaleString(
                                    "nl-NL"
                                  )}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                {item.phone && (
                                  <div>
                                    <span className="font-semibold">Tel: </span>
                                    {item.phone}
                                  </div>
                                )}
                                {item.rating && (
                                  <div>
                                    <span className="font-semibold">
                                      Beoordeling:{" "}
                                    </span>
                                    <Badge>{item.rating}/5</Badge>
                                  </div>
                                )}
                                <div className="bg-muted rounded-lg p-4 whitespace-pre-wrap">
                                  {item.message}
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    onClick={() =>
                                      toggleRead.mutate({
                                        id: item.id,
                                        isRead: !item.isRead,
                                      })
                                    }
                                  >
                                    {item.isRead
                                      ? "Markeer als ongelezen"
                                      : "Markeer als gelezen"}
                                  </Button>
                                  <Button variant="outline" asChild>
                                    <a href={`mailto:${item.email}`}>
                                      Beantwoorden
                                    </a>
                                  </Button>
                                </div>
                              </div>
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
                                  Bericht verwijderen?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Weet je zeker dat je dit bericht wilt
                                  verwijderen? Deze actie kan niet ongedaan
                                  worden gemaakt.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuleren</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    deleteFeedback.mutate({ id: item.id })
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
                Geen berichten. Berichten van het contactformulier verschijnen
                hier.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

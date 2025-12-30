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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  IconEdit,
  IconLoader2,
  IconPlus,
  IconFileDescription,
} from "@tabler/icons-react";
import { toast } from "sonner";

type ContentItem = {
  section: string;
  key: string;
  value: string;
  type: string;
};

export default function AdminContentPage() {
  const [editingItem, setEditingItem] = useState<{
    page: string;
    item: ContentItem;
  } | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    page: "",
    section: "",
    key: "",
    value: "",
    type: "text" as "text" | "richtext" | "url",
  });

  const { data: content, isLoading } = api.content.getAll.useQuery();
  const { data: pages } = api.content.getPages.useQuery();
  const utils = api.useUtils();

  const updateContent = api.content.update.useMutation({
    onSuccess: () => {
      toast.success("Content bijgewerkt");
      utils.content.getAll.invalidate();
      setEditingItem(null);
    },
    onError: () => toast.error("Bijwerken mislukt"),
  });

  const createContent = api.content.update.useMutation({
    onSuccess: () => {
      toast.success("Content toegevoegd");
      utils.content.getAll.invalidate();
      utils.content.getPages.invalidate();
      setIsCreateOpen(false);
      setNewItem({
        page: "",
        section: "",
        key: "",
        value: "",
        type: "text",
      });
    },
    onError: () => toast.error("Toevoegen mislukt"),
  });

  const pageList = content ? Object.keys(content).sort() : [];

  return (
    <>
      <AdminHeader />
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">
              Pagina Content
            </h1>
            <p className="text-muted-foreground">
              Beheer teksten en content per pagina.
            </p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <IconPlus className="mr-2 h-4 w-4" />
                Nieuwe content
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Nieuwe content toevoegen</DialogTitle>
                <DialogDescription>
                  Voeg een nieuw content item toe aan een pagina.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Pagina</Label>
                    <Input
                      value={newItem.page}
                      onChange={(e) =>
                        setNewItem({ ...newItem, page: e.target.value })
                      }
                      placeholder="bijv. homepage, ons-verhaal"
                      list="pages-list"
                    />
                    <datalist id="pages-list">
                      {pages?.map((page) => (
                        <option key={page} value={page} />
                      ))}
                    </datalist>
                  </div>
                  <div className="space-y-2">
                    <Label>Sectie</Label>
                    <Input
                      value={newItem.section}
                      onChange={(e) =>
                        setNewItem({ ...newItem, section: e.target.value })
                      }
                      placeholder="bijv. hero, cta, intro"
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Sleutel</Label>
                    <Input
                      value={newItem.key}
                      onChange={(e) =>
                        setNewItem({ ...newItem, key: e.target.value })
                      }
                      placeholder="bijv. title, description"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select
                      value={newItem.type}
                      onValueChange={(v) =>
                        setNewItem({
                          ...newItem,
                          type: v as "text" | "richtext" | "url",
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Tekst</SelectItem>
                        <SelectItem value="richtext">Rich text</SelectItem>
                        <SelectItem value="url">URL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Waarde</Label>
                  <Textarea
                    value={newItem.value}
                    onChange={(e) =>
                      setNewItem({ ...newItem, value: e.target.value })
                    }
                    placeholder="De content..."
                    className="min-h-24"
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
                  onClick={() =>
                    createContent.mutate({
                      page: newItem.page,
                      section: newItem.section,
                      key: newItem.key,
                      value: newItem.value,
                      type: newItem.type,
                    })
                  }
                  disabled={createContent.isPending}
                >
                  {createContent.isPending && (
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
              <IconFileDescription className="h-5 w-5" />
              Content per pagina
            </CardTitle>
            <CardDescription>
              {pageList.length} pagina(s) met content
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <IconLoader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : pageList.length > 0 ? (
              <Accordion type="multiple" className="w-full">
                {pageList.map((page) => (
                  <AccordionItem key={page} value={page}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{page}</span>
                        <Badge variant="secondary">
                          {content![page].length} items
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pt-2">
                        {content![page].map((item) => (
                          <div
                            key={`${item.section}-${item.key}`}
                            className="flex items-start justify-between rounded-lg border p-3"
                          >
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">
                                  {item.section}.{item.key}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {item.type}
                                </Badge>
                              </div>
                              <p className="text-muted-foreground line-clamp-2 text-sm">
                                {item.value}
                              </p>
                            </div>
                            <Dialog
                              open={
                                editingItem?.page === page &&
                                editingItem?.item.section === item.section &&
                                editingItem?.item.key === item.key
                              }
                              onOpenChange={(open) =>
                                !open && setEditingItem(null)
                              }
                            >
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setEditingItem({ page, item })}
                                >
                                  <IconEdit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Content bewerken</DialogTitle>
                                  <DialogDescription>
                                    {page} / {item.section} / {item.key}
                                  </DialogDescription>
                                </DialogHeader>
                                {editingItem && (
                                  <div className="space-y-4">
                                    <div className="space-y-2">
                                      <Label>Type</Label>
                                      <Select
                                        value={editingItem.item.type}
                                        onValueChange={(v) =>
                                          setEditingItem({
                                            ...editingItem,
                                            item: {
                                              ...editingItem.item,
                                              type: v,
                                            },
                                          })
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="text">
                                            Tekst
                                          </SelectItem>
                                          <SelectItem value="richtext">
                                            Rich text
                                          </SelectItem>
                                          <SelectItem value="url">
                                            URL
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Waarde</Label>
                                      <Textarea
                                        value={editingItem.item.value}
                                        onChange={(e) =>
                                          setEditingItem({
                                            ...editingItem,
                                            item: {
                                              ...editingItem.item,
                                              value: e.target.value,
                                            },
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
                                    onClick={() => setEditingItem(null)}
                                  >
                                    Annuleren
                                  </Button>
                                  <Button
                                    onClick={() =>
                                      editingItem &&
                                      updateContent.mutate({
                                        page: editingItem.page,
                                        section: editingItem.item.section,
                                        key: editingItem.item.key,
                                        value: editingItem.item.value,
                                        type: editingItem.item.type as
                                          | "text"
                                          | "richtext"
                                          | "url",
                                      })
                                    }
                                    disabled={updateContent.isPending}
                                  >
                                    {updateContent.isPending && (
                                      <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    Opslaan
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="text-muted-foreground py-8 text-center">
                Geen content gevonden. Voeg content toe om te beginnen.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

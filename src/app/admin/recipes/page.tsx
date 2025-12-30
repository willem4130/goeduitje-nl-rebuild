"use client";

import { useState } from "react";
import { AdminHeader } from "@/components/admin-header";
import { api } from "@/trpc/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  IconPlus,
  IconPencil,
  IconTrash,
  IconEye,
  IconEyeOff,
  IconLoader2,
  IconChefHat,
  IconClock,
} from "@tabler/icons-react";

type Recipe = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  prepTime: number | null;
  cookTime: number | null;
  servings: number | null;
  difficulty: string | null;
  category: string | null;
  ingredients: string[];
  steps: string[];
  tips: string | null;
  isPublished: boolean;
};

const CATEGORIES = ["Voorgerecht", "Hoofdgerecht", "Bijgerecht", "Dessert"];
const DIFFICULTIES = ["Makkelijk", "Gemiddeld", "Moeilijk"];

export default function RecipesAdminPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    imageUrl: "",
    prepTime: "",
    cookTime: "",
    servings: "",
    difficulty: "",
    category: "",
    ingredients: "",
    steps: "",
    tips: "",
  });

  const utils = api.useUtils();
  const { data: recipes, isLoading } = api.recipes.getAll.useQuery({
    includeUnpublished: true,
  });

  const createMutation = api.recipes.create.useMutation({
    onSuccess: () => {
      toast.success("Recept aangemaakt");
      utils.recipes.getAll.invalidate();
      resetForm();
    },
    onError: (err) => toast.error(err.message || "Fout bij aanmaken"),
  });

  const updateMutation = api.recipes.update.useMutation({
    onSuccess: () => {
      toast.success("Recept bijgewerkt");
      utils.recipes.getAll.invalidate();
      resetForm();
    },
    onError: (err) => toast.error(err.message || "Fout bij bijwerken"),
  });

  const deleteMutation = api.recipes.delete.useMutation({
    onSuccess: () => {
      toast.success("Recept verwijderd");
      utils.recipes.getAll.invalidate();
    },
    onError: (err) => toast.error(err.message || "Fout bij verwijderen"),
  });

  const togglePublishMutation = api.recipes.togglePublish.useMutation({
    onSuccess: () => {
      toast.success("Status bijgewerkt");
      utils.recipes.getAll.invalidate();
    },
    onError: (err) => toast.error(err.message || "Fout bij bijwerken"),
  });

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      description: "",
      imageUrl: "",
      prepTime: "",
      cookTime: "",
      servings: "",
      difficulty: "",
      category: "",
      ingredients: "",
      steps: "",
      tips: "",
    });
    setEditingRecipe(null);
    setDialogOpen(false);
  };

  const openEditDialog = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setFormData({
      title: recipe.title,
      slug: recipe.slug,
      description: recipe.description ?? "",
      imageUrl: recipe.imageUrl ?? "",
      prepTime: recipe.prepTime?.toString() ?? "",
      cookTime: recipe.cookTime?.toString() ?? "",
      servings: recipe.servings?.toString() ?? "",
      difficulty: recipe.difficulty ?? "",
      category: recipe.category ?? "",
      ingredients: recipe.ingredients.join("\n"),
      steps: recipe.steps.join("\n"),
      tips: recipe.tips ?? "",
    });
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    const data = {
      title: formData.title,
      slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, "-"),
      description: formData.description || undefined,
      imageUrl: formData.imageUrl || undefined,
      prepTime: formData.prepTime ? parseInt(formData.prepTime) : undefined,
      cookTime: formData.cookTime ? parseInt(formData.cookTime) : undefined,
      servings: formData.servings ? parseInt(formData.servings) : undefined,
      difficulty: formData.difficulty || undefined,
      category: formData.category || undefined,
      ingredients: formData.ingredients.split("\n").filter((i) => i.trim()),
      steps: formData.steps.split("\n").filter((s) => s.trim()),
      tips: formData.tips || undefined,
    };

    if (editingRecipe) {
      updateMutation.mutate({ id: editingRecipe.id, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <>
      <AdminHeader />
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Recepten</h1>
            <p className="text-muted-foreground">
              Beheer de recepten die op de website worden getoond.
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <IconPlus className="mr-2 h-4 w-4" />
                Nieuw recept
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingRecipe ? "Recept bewerken" : "Nieuw recept"}
                </DialogTitle>
                <DialogDescription>
                  Vul de gegevens van het recept in.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Titel *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="Hummus"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) =>
                        setFormData({ ...formData, slug: e.target.value })
                      }
                      placeholder="hummus (auto-generated)"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Beschrijving</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Een korte beschrijving van het recept..."
                    className="min-h-20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Afbeelding URL</Label>
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, imageUrl: e.target.value })
                    }
                    placeholder="https://..."
                  />
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="prepTime">Voorbereiden (min)</Label>
                    <Input
                      id="prepTime"
                      type="number"
                      value={formData.prepTime}
                      onChange={(e) =>
                        setFormData({ ...formData, prepTime: e.target.value })
                      }
                      placeholder="15"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cookTime">Bereiden (min)</Label>
                    <Input
                      id="cookTime"
                      type="number"
                      value={formData.cookTime}
                      onChange={(e) =>
                        setFormData({ ...formData, cookTime: e.target.value })
                      }
                      placeholder="30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="servings">Porties</Label>
                    <Input
                      id="servings"
                      type="number"
                      value={formData.servings}
                      onChange={(e) =>
                        setFormData({ ...formData, servings: e.target.value })
                      }
                      placeholder="4"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Moeilijkheid</Label>
                    <Select
                      value={formData.difficulty}
                      onValueChange={(v) =>
                        setFormData({ ...formData, difficulty: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Kies..." />
                      </SelectTrigger>
                      <SelectContent>
                        {DIFFICULTIES.map((d) => (
                          <SelectItem key={d} value={d}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Categorie</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(v) =>
                      setFormData({ ...formData, category: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Kies een categorie..." />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ingredients">
                    Ingrediënten (één per regel)
                  </Label>
                  <Textarea
                    id="ingredients"
                    value={formData.ingredients}
                    onChange={(e) =>
                      setFormData({ ...formData, ingredients: e.target.value })
                    }
                    placeholder="400g kikkererwten&#10;2 el tahini&#10;1 teentje knoflook"
                    className="min-h-32"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="steps">
                    Bereidingsstappen (één per regel)
                  </Label>
                  <Textarea
                    id="steps"
                    value={formData.steps}
                    onChange={(e) =>
                      setFormData({ ...formData, steps: e.target.value })
                    }
                    placeholder="Doe de kikkererwten in een zeef en spoel ze af.&#10;Voeg alle ingrediënten toe aan de foodprocessor.&#10;Blend tot een gladde massa."
                    className="min-h-32"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tips">Tips</Label>
                  <Textarea
                    id="tips"
                    value={formData.tips}
                    onChange={(e) =>
                      setFormData({ ...formData, tips: e.target.value })
                    }
                    placeholder="Serveer met warm pitabrood..."
                    className="min-h-20"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={resetForm}>
                  Annuleren
                </Button>
                <Button onClick={handleSubmit} disabled={isPending}>
                  {isPending && (
                    <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {editingRecipe ? "Opslaan" : "Aanmaken"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <IconLoader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : !recipes || recipes.length === 0 ? (
          <div className="text-muted-foreground py-12 text-center">
            <IconChefHat className="mx-auto mb-4 h-12 w-12 opacity-50" />
            <p>Nog geen recepten.</p>
            <p className="text-sm">
              Klik op &quot;Nieuw recept&quot; om te beginnen.
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titel</TableHead>
                  <TableHead>Categorie</TableHead>
                  <TableHead>Moeilijkheid</TableHead>
                  <TableHead>Tijd</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[120px]">Acties</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recipes.map((recipe) => (
                  <TableRow key={recipe.id}>
                    <TableCell className="font-medium">
                      {recipe.title}
                    </TableCell>
                    <TableCell>{recipe.category ?? "-"}</TableCell>
                    <TableCell>{recipe.difficulty ?? "-"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <IconClock className="h-3 w-3" />
                        {(recipe.prepTime ?? 0) + (recipe.cookTime ?? 0)} min
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                          recipe.isPublished
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {recipe.isPublished ? "Gepubliceerd" : "Verborgen"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            togglePublishMutation.mutate({
                              id: recipe.id,
                              isPublished: !recipe.isPublished,
                            })
                          }
                          title={
                            recipe.isPublished ? "Verbergen" : "Publiceren"
                          }
                        >
                          {recipe.isPublished ? (
                            <IconEyeOff className="h-4 w-4" />
                          ) : (
                            <IconEye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(recipe)}
                          title="Bewerken"
                        >
                          <IconPencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (
                              confirm(
                                "Weet je zeker dat je dit recept wilt verwijderen?"
                              )
                            ) {
                              deleteMutation.mutate({ id: recipe.id });
                            }
                          }}
                          title="Verwijderen"
                        >
                          <IconTrash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </>
  );
}

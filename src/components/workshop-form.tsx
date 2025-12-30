"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/client";
import { toast } from "sonner";
import {
  workshopFormSchema,
  type WorkshopFormValues,
} from "@/lib/validations/workshop";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { IconLoader2, IconPlus, IconTrash, IconX } from "@tabler/icons-react";
import { useState } from "react";

type FormType = ReturnType<typeof useForm<WorkshopFormValues>>;

type WorkshopFormProps = {
  mode: "create" | "edit";
  initialData?: WorkshopFormValues & { id: string };
};

export function WorkshopForm({ mode, initialData }: WorkshopFormProps) {
  const router = useRouter();
  const utils = api.useUtils();

  const form = useForm<WorkshopFormValues>({
    resolver: zodResolver(workshopFormSchema),
    defaultValues: initialData ?? {
      slug: "",
      title: "",
      subtitle: "",
      description: "",
      longDescription: "",
      image: "",
      video: "",
      duration: "",
      groupSize: "",
      location: "",
      categories: [],
      includes: [],
      isPublished: true,
      sortOrder: 0,
      priceTiers: [],
      variants: [],
    },
  });

  const priceTiersArray = useFieldArray({
    control: form.control,
    name: "priceTiers",
  });
  const variantsArray = useFieldArray({
    control: form.control,
    name: "variants",
  });

  const createMutation = api.workshop.createWorkshop.useMutation({
    onSuccess: () => {
      toast.success("Workshop aangemaakt");
      utils.workshop.list.invalidate();
      router.push("/admin/workshops");
    },
    onError: (error) => toast.error(error.message || "Aanmaken mislukt"),
  });

  const updateMutation = api.workshop.updateWorkshop.useMutation({
    onSuccess: () => {
      toast.success("Workshop bijgewerkt");
      utils.workshop.list.invalidate();
      utils.workshop.getById.invalidate({ id: initialData?.id });
      router.push("/admin/workshops");
    },
    onError: (error) => toast.error(error.message || "Bijwerken mislukt"),
  });

  const onSubmit = (data: WorkshopFormValues) => {
    if (mode === "create") {
      createMutation.mutate(data);
    } else if (initialData?.id) {
      updateMutation.mutate({ ...data, id: initialData.id });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Basis informatie</CardTitle>
          <CardDescription>
            Titel, slug en beschrijving van de workshop.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titel *</Label>
              <Input
                id="title"
                {...form.register("title")}
                placeholder="Kookworkshop"
              />
              {form.formState.errors.title && (
                <p className="text-destructive text-sm">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                {...form.register("slug")}
                placeholder="kookworkshop"
              />
              {form.formState.errors.slug && (
                <p className="text-destructive text-sm">
                  {form.formState.errors.slug.message}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="subtitle">Ondertitel *</Label>
            <Input
              id="subtitle"
              {...form.register("subtitle")}
              placeholder="Ontdek nieuwe smaken"
            />
            {form.formState.errors.subtitle && (
              <p className="text-destructive text-sm">
                {form.formState.errors.subtitle.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Korte beschrijving *</Label>
            <Textarea
              id="description"
              {...form.register("description")}
              placeholder="Een korte beschrijving..."
              className="min-h-20"
            />
            {form.formState.errors.description && (
              <p className="text-destructive text-sm">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="longDescription">Uitgebreide beschrijving</Label>
            <Textarea
              id="longDescription"
              {...form.register("longDescription")}
              placeholder="Een uitgebreide beschrijving met meer details..."
              className="min-h-32"
            />
          </div>
        </CardContent>
      </Card>

      {/* Media */}
      <Card>
        <CardHeader>
          <CardTitle>Media</CardTitle>
          <CardDescription>
            Afbeelding en video voor de workshop.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="image">Afbeelding URL</Label>
              <Input
                id="image"
                {...form.register("image")}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="video">Video URL</Label>
              <Input
                id="video"
                {...form.register("video")}
                placeholder="https://..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details */}
      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
          <CardDescription>Duur, groepsgrootte en locatie.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duur *</Label>
              <Input
                id="duration"
                {...form.register("duration")}
                placeholder="2-3 uur"
              />
              {form.formState.errors.duration && (
                <p className="text-destructive text-sm">
                  {form.formState.errors.duration.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="groupSize">Groepsgrootte *</Label>
              <Input
                id="groupSize"
                {...form.register("groupSize")}
                placeholder="8-30 personen"
              />
              {form.formState.errors.groupSize && (
                <p className="text-destructive text-sm">
                  {form.formState.errors.groupSize.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Locatie *</Label>
              <Input
                id="location"
                {...form.register("location")}
                placeholder="Nijmegen"
              />
              {form.formState.errors.location && (
                <p className="text-destructive text-sm">
                  {form.formState.errors.location.message}
                </p>
              )}
            </div>
          </div>

          <TagInput
            form={form}
            name="categories"
            label="Categorieën"
            placeholder="Typ en druk Enter..."
          />
          <TagInput
            form={form}
            name="includes"
            label="Inclusief"
            placeholder="Typ wat er bij is inbegrepen..."
          />

          <div className="flex items-center gap-4">
            <div className="space-y-2">
              <Label htmlFor="sortOrder">Sorteervolgorde</Label>
              <Input
                id="sortOrder"
                type="number"
                {...form.register("sortOrder", { valueAsNumber: true })}
                className="w-24"
              />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <Switch
                id="isPublished"
                checked={form.watch("isPublished")}
                onCheckedChange={(checked: boolean) =>
                  form.setValue("isPublished", checked)
                }
              />
              <Label htmlFor="isPublished">Gepubliceerd</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Price Tiers */}
      <Card>
        <CardHeader>
          <CardTitle>Prijsstaffels</CardTitle>
          <CardDescription>
            Prijzen op basis van groepsgrootte (alleen voor workshops zonder
            varianten).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {priceTiersArray.fields.map((field, index) => (
            <div key={field.id} className="border-border rounded-lg border p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium">
                  Prijsstaffel {index + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => priceTiersArray.remove(index)}
                >
                  <IconTrash className="h-4 w-4" />
                </Button>
              </div>
              <PriceTierFields form={form} basePath={`priceTiers.${index}`} />
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              priceTiersArray.append({
                groupSize: "",
                minParticipants: null,
                maxParticipants: null,
                priceExclBtw: 0,
                priceInclBtw: 0,
                sortOrder: priceTiersArray.fields.length,
              })
            }
          >
            <IconPlus className="mr-2 h-4 w-4" />
            Prijsstaffel toevoegen
          </Button>
        </CardContent>
      </Card>

      {/* Variants */}
      <Card>
        <CardHeader>
          <CardTitle>Varianten</CardTitle>
          <CardDescription>
            Optionele varianten met eigen beschrijving en prijzen (bijv.
            Arabisch, Turks).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {variantsArray.fields.map((field, vIndex) => (
            <VariantSection
              key={field.id}
              form={form}
              index={vIndex}
              onRemove={() => variantsArray.remove(vIndex)}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              variantsArray.append({
                name: "",
                description: "",
                duration: "",
                includes: [],
                sortOrder: variantsArray.fields.length,
                priceTiers: [],
              })
            }
          >
            <IconPlus className="mr-2 h-4 w-4" />
            Variant toevoegen
          </Button>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/workshops")}
        >
          Annuleren
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending && <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === "create" ? "Aanmaken" : "Opslaan"}
        </Button>
      </div>
    </form>
  );
}

// Tag input for arrays like categories and includes
function TagInput({
  form,
  name,
  label,
  placeholder,
}: {
  form: FormType;
  name: "categories" | "includes";
  label: string;
  placeholder: string;
}) {
  const [inputValue, setInputValue] = useState("");
  const values = form.watch(name) || [];

  const addTag = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !values.includes(trimmed)) {
      form.setValue(name, [...values, trimmed]);
      setInputValue("");
    }
  };

  const removeTag = (tag: string) => {
    form.setValue(
      name,
      values.filter((v) => v !== tag)
    );
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="mb-2 flex flex-wrap gap-2">
        {values.map((tag) => (
          <span
            key={tag}
            className="bg-secondary text-secondary-foreground inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:text-destructive"
            >
              <IconX className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            addTag();
          }
        }}
        onBlur={addTag}
        placeholder={placeholder}
      />
    </div>
  );
}

// Price tier fields component
function PriceTierFields({
  form,
  basePath,
}: {
  form: FormType;
  basePath: `priceTiers.${number}` | `variants.${number}.priceTiers.${number}`;
}) {
  return (
    <div className="grid grid-cols-5 gap-3">
      <div className="space-y-1">
        <Label className="text-xs">Groepsgrootte</Label>
        <Input
          {...form.register(`${basePath}.groupSize`)}
          placeholder="8-10 personen"
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Min. deelnemers</Label>
        <Input
          type="number"
          {...form.register(`${basePath}.minParticipants`, {
            valueAsNumber: true,
          })}
          placeholder="8"
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Max. deelnemers</Label>
        <Input
          type="number"
          {...form.register(`${basePath}.maxParticipants`, {
            valueAsNumber: true,
          })}
          placeholder="10"
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Prijs excl. BTW</Label>
        <Input
          type="number"
          step="0.01"
          {...form.register(`${basePath}.priceExclBtw`, {
            valueAsNumber: true,
          })}
          placeholder="45.00"
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Prijs incl. BTW</Label>
        <Input
          type="number"
          step="0.01"
          {...form.register(`${basePath}.priceInclBtw`, {
            valueAsNumber: true,
          })}
          placeholder="54.45"
        />
      </div>
    </div>
  );
}

// Variant section with nested price tiers
function VariantSection({
  form,
  index,
  onRemove,
}: {
  form: FormType;
  index: number;
  onRemove: () => void;
}) {
  const variantPriceTiers = useFieldArray({
    control: form.control,
    name: `variants.${index}.priceTiers`,
  });

  const [includeInput, setIncludeInput] = useState("");
  const includes = form.watch(`variants.${index}.includes`) || [];

  const addInclude = () => {
    const trimmed = includeInput.trim();
    if (trimmed && !includes.includes(trimmed)) {
      form.setValue(`variants.${index}.includes`, [...includes, trimmed]);
      setIncludeInput("");
    }
  };

  const removeInclude = (item: string) => {
    form.setValue(
      `variants.${index}.includes`,
      includes.filter((i) => i !== item)
    );
  };

  return (
    <div className="border-border rounded-lg border p-4">
      <div className="mb-4 flex items-center justify-between">
        <span className="font-medium">Variant {index + 1}</span>
        <Button type="button" variant="ghost" size="icon" onClick={onRemove}>
          <IconTrash className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Naam *</Label>
            <Input
              {...form.register(`variants.${index}.name`)}
              placeholder="Arabisch"
            />
          </div>
          <div className="space-y-2">
            <Label>Duur *</Label>
            <Input
              {...form.register(`variants.${index}.duration`)}
              placeholder="2.5 uur"
            />
          </div>
          <div className="space-y-2">
            <Label>Sorteervolgorde</Label>
            <Input
              type="number"
              {...form.register(`variants.${index}.sortOrder`, {
                valueAsNumber: true,
              })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Beschrijving *</Label>
          <Textarea
            {...form.register(`variants.${index}.description`)}
            placeholder="Beschrijving van deze variant..."
          />
        </div>

        <div className="space-y-2">
          <Label>Inclusief</Label>
          <div className="mb-2 flex flex-wrap gap-2">
            {includes.map((item) => (
              <span
                key={item}
                className="bg-secondary text-secondary-foreground inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm"
              >
                {item}
                <button
                  type="button"
                  onClick={() => removeInclude(item)}
                  className="hover:text-destructive"
                >
                  <IconX className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
          <Input
            value={includeInput}
            onChange={(e) => setIncludeInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addInclude();
              }
            }}
            onBlur={addInclude}
            placeholder="Typ en druk Enter..."
          />
        </div>

        <Separator />

        <div className="space-y-3">
          <Label className="text-sm font-medium">
            Prijsstaffels voor deze variant
          </Label>
          {variantPriceTiers.fields.map((field, tIndex) => (
            <div key={field.id} className="bg-muted/50 rounded-md p-3">
              <div className="mb-2 flex justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => variantPriceTiers.remove(tIndex)}
                >
                  <IconTrash className="h-3 w-3" />
                </Button>
              </div>
              <PriceTierFields
                form={form}
                basePath={`variants.${index}.priceTiers.${tIndex}`}
              />
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              variantPriceTiers.append({
                groupSize: "",
                minParticipants: null,
                maxParticipants: null,
                priceExclBtw: 0,
                priceInclBtw: 0,
                sortOrder: variantPriceTiers.fields.length,
              })
            }
          >
            <IconPlus className="mr-2 h-4 w-4" />
            Prijsstaffel
          </Button>
        </div>
      </div>
    </div>
  );
}

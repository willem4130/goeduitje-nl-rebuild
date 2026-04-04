import { describe, it, expect, vi, beforeEach } from "vitest";
import { appRouter } from "@/server/api/root";
import { prisma } from "@/lib/prisma";

const caller = appRouter.createCaller({} as any);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("recipes.getAll", () => {
  const mockRecipes = [
    {
      id: "r1",
      title: "Pasta",
      slug: "pasta",
      isPublished: true,
      category: "Hoofdgerecht",
    },
    {
      id: "r2",
      title: "Tiramisu",
      slug: "tiramisu",
      isPublished: true,
      category: "Dessert",
    },
  ];

  it("returns published recipes by default", async () => {
    vi.mocked(prisma.recipe.findMany).mockResolvedValue(mockRecipes as any);

    const result = await caller.recipes.getAll();

    expect(result).toEqual(mockRecipes);
    expect(prisma.recipe.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ isPublished: true }),
        orderBy: { createdAt: "desc" },
        take: 50,
      })
    );
  });

  it("filters by category", async () => {
    vi.mocked(prisma.recipe.findMany).mockResolvedValue([
      mockRecipes[0]!,
    ] as any);

    await caller.recipes.getAll({ category: "Hoofdgerecht" });

    expect(prisma.recipe.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ category: "Hoofdgerecht" }),
      })
    );
  });

  it("filters by search", async () => {
    vi.mocked(prisma.recipe.findMany).mockResolvedValue([
      mockRecipes[0]!,
    ] as any);

    await caller.recipes.getAll({ search: "Pasta" });

    expect(prisma.recipe.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: [
            { title: { contains: "Pasta", mode: "insensitive" } },
            { description: { contains: "Pasta", mode: "insensitive" } },
          ],
        }),
      })
    );
  });

  it("includes unpublished when flag set", async () => {
    vi.mocked(prisma.recipe.findMany).mockResolvedValue(mockRecipes as any);

    await caller.recipes.getAll({ includeUnpublished: true });

    const call = vi.mocked(prisma.recipe.findMany).mock.calls[0]![0] as any;
    expect(call.where).not.toHaveProperty("isPublished");
  });
});

describe("recipes.getBySlug", () => {
  it("returns recipe by slug", async () => {
    const mockRecipe = {
      id: "r1",
      title: "Pasta",
      slug: "pasta",
      isPublished: true,
    };
    vi.mocked(prisma.recipe.findUnique).mockResolvedValue(mockRecipe as any);

    const result = await caller.recipes.getBySlug({ slug: "pasta" });

    expect(result).toEqual(mockRecipe);
    expect(prisma.recipe.findUnique).toHaveBeenCalledWith({
      where: { slug: "pasta", isPublished: true },
    });
  });
});

describe("recipes.getCategories", () => {
  it("returns sorted categories (Voorgerecht, Hoofdgerecht, Bijgerecht, Dessert)", async () => {
    vi.mocked(prisma.recipe.findMany).mockResolvedValue([
      { category: "Dessert" },
      { category: "Voorgerecht" },
      { category: "Hoofdgerecht" },
      { category: "Bijgerecht" },
    ] as any);

    const result = await caller.recipes.getCategories();

    expect(result).toEqual([
      "Voorgerecht",
      "Hoofdgerecht",
      "Bijgerecht",
      "Dessert",
    ]);
  });
});

describe("recipes.create", () => {
  it("creates a new recipe", async () => {
    const input = {
      title: "Pasta Carbonara",
      slug: "pasta-carbonara",
      description: "Klassieke Italiaanse pasta",
      category: "Hoofdgerecht",
      ingredients: ["pasta", "ei", "spek"],
      steps: ["Kook pasta", "Bak spek", "Meng samen"],
    };

    const mockCreated = { id: "r1", ...input, isPublished: true };
    vi.mocked(prisma.recipe.create).mockResolvedValue(mockCreated as any);

    const result = await caller.recipes.create(input);

    expect(result).toEqual(mockCreated);
    expect(prisma.recipe.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        title: "Pasta Carbonara",
        slug: "pasta-carbonara",
        isPublished: true,
      }),
    });
  });
});

describe("recipes.update", () => {
  it("updates an existing recipe", async () => {
    const mockUpdated = { id: "r1", title: "Updated Pasta" };
    vi.mocked(prisma.recipe.update).mockResolvedValue(mockUpdated as any);

    const result = await caller.recipes.update({
      id: "r1",
      title: "Updated Pasta",
    });

    expect(result).toEqual(mockUpdated);
    expect(prisma.recipe.update).toHaveBeenCalledWith({
      where: { id: "r1" },
      data: expect.objectContaining({ title: "Updated Pasta" }),
    });
  });
});

describe("recipes.delete", () => {
  it("deletes a recipe by ID", async () => {
    vi.mocked(prisma.recipe.delete).mockResolvedValue({} as any);

    const result = await caller.recipes.delete({ id: "r1" });

    expect(result).toEqual({ success: true });
    expect(prisma.recipe.delete).toHaveBeenCalledWith({ where: { id: "r1" } });
  });
});

describe("recipes.togglePublish", () => {
  it("toggles publish status", async () => {
    const mockUpdated = { id: "r1", isPublished: false };
    vi.mocked(prisma.recipe.update).mockResolvedValue(mockUpdated as any);

    const result = await caller.recipes.togglePublish({
      id: "r1",
      isPublished: false,
    });

    expect(result).toEqual(mockUpdated);
    expect(prisma.recipe.update).toHaveBeenCalledWith({
      where: { id: "r1" },
      data: { isPublished: false },
    });
  });
});

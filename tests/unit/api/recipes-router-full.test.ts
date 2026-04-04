import { describe, it, expect, vi, beforeEach } from "vitest";
import { appRouter } from "@/server/api/root";
import { prisma } from "@/lib/prisma";

const caller = appRouter.createCaller({
  headers: new Headers({ "x-api-secret": "test-api-secret" }),
} as any);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("recipes.getById", () => {
  it("returns recipe by ID (including unpublished)", async () => {
    const mockRecipe = {
      id: "r1",
      title: "Pasta",
      slug: "pasta",
      isPublished: false,
    };
    vi.mocked(prisma.recipe.findUnique).mockResolvedValue(mockRecipe as any);
    const result = await caller.recipes.getById({ id: "r1" });
    expect(result).toEqual(mockRecipe);
    expect(prisma.recipe.findUnique).toHaveBeenCalledWith({
      where: { id: "r1" },
    });
  });
});

describe("recipes.getAll with difficulty", () => {
  it("filters by difficulty", async () => {
    vi.mocked(prisma.recipe.findMany).mockResolvedValue([]);
    await caller.recipes.getAll({ difficulty: "Makkelijk" });
    expect(prisma.recipe.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ difficulty: "Makkelijk" }),
      })
    );
  });

  it("filters by both category and difficulty", async () => {
    vi.mocked(prisma.recipe.findMany).mockResolvedValue([]);
    await caller.recipes.getAll({
      category: "Dessert",
      difficulty: "Moeilijk",
      limit: 10,
    });
    expect(prisma.recipe.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          category: "Dessert",
          difficulty: "Moeilijk",
        }),
        take: 10,
      })
    );
  });
});

describe("recipes.getCategories with null filter", () => {
  it("filters out null categories", async () => {
    vi.mocked(prisma.recipe.findMany).mockResolvedValue([
      { category: "Dessert" },
      { category: null },
      { category: "Hoofdgerecht" },
    ] as any);
    const result = await caller.recipes.getCategories();
    expect(result).not.toContain(null);
    expect(result).toHaveLength(2);
  });

  it("sorts unknown categories after known ones", async () => {
    vi.mocked(prisma.recipe.findMany).mockResolvedValue([
      { category: "Unknown" },
      { category: "Dessert" },
      { category: "Voorgerecht" },
    ] as any);
    const result = await caller.recipes.getCategories();
    expect(result[0]).toBe("Voorgerecht");
    expect(result[1]).toBe("Dessert");
    expect(result[2]).toBe("Unknown");
  });
});

describe("recipes.getStats", () => {
  it("returns total, byCategory, and byDifficulty", async () => {
    vi.mocked(prisma.recipe.count).mockResolvedValue(10 as any);
    vi.mocked(prisma.recipe.groupBy)
      .mockResolvedValueOnce([
        { category: "Hoofdgerecht", _count: { id: 5 } },
        { category: "Dessert", _count: { id: 3 } },
      ] as any)
      .mockResolvedValueOnce([
        { difficulty: "Makkelijk", _count: { id: 4 } },
        { difficulty: "Gemiddeld", _count: { id: 6 } },
      ] as any);

    const result = await caller.recipes.getStats();
    expect(result.total).toBe(10);
    expect(result.byCategory).toEqual({ Hoofdgerecht: 5, Dessert: 3 });
    expect(result.byDifficulty).toEqual({ Makkelijk: 4, Gemiddeld: 6 });
  });
});

describe("recipes.create with isPublished=false", () => {
  it("creates an unpublished recipe", async () => {
    vi.mocked(prisma.recipe.create).mockResolvedValue({
      id: "r1",
      isPublished: false,
    } as any);
    await caller.recipes.create({
      title: "Draft Recipe",
      slug: "draft-recipe",
      isPublished: false,
    });
    expect(prisma.recipe.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ isPublished: false }),
    });
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { appRouter } from "@/server/api/root";
import { prisma } from "@/lib/prisma";

const caller = appRouter.createCaller({
  headers: new Headers({ "x-api-secret": "test-api-secret" }),
} as any);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("team.getAll", () => {
  const mockMembers = [
    { id: "tm1", name: "Jan", role: "Chef", sortOrder: 0, isPublished: true },
    {
      id: "tm2",
      name: "Piet",
      role: "Sous Chef",
      sortOrder: 1,
      isPublished: true,
    },
  ];

  it("returns published team members ordered by sortOrder", async () => {
    vi.mocked(prisma.teamMember.findMany).mockResolvedValue(mockMembers as any);

    const result = await caller.team.getAll();

    expect(result).toEqual(mockMembers);
    expect(prisma.teamMember.findMany).toHaveBeenCalledWith({
      where: { isPublished: true },
      orderBy: { sortOrder: "asc" },
    });
  });

  it("includes unpublished when flag set", async () => {
    vi.mocked(prisma.teamMember.findMany).mockResolvedValue(mockMembers as any);

    await caller.team.getAll({ includeUnpublished: true });

    expect(prisma.teamMember.findMany).toHaveBeenCalledWith({
      where: {},
      orderBy: { sortOrder: "asc" },
    });
  });
});

describe("team.getById", () => {
  it("returns team member by ID", async () => {
    const mockMember = { id: "tm1", name: "Jan", role: "Chef" };
    vi.mocked(prisma.teamMember.findUnique).mockResolvedValue(
      mockMember as any
    );

    const result = await caller.team.getById({ id: "tm1" });

    expect(result).toEqual(mockMember);
    expect(prisma.teamMember.findUnique).toHaveBeenCalledWith({
      where: { id: "tm1" },
    });
  });
});

describe("team.create", () => {
  it("creates a team member with default sortOrder and isPublished", async () => {
    const input = {
      name: "Jan Jansen",
      role: "Chef-kok",
      bio: "Ervaren kok met passie voor Italiaans",
    };

    const mockCreated = {
      id: "tm1",
      ...input,
      sortOrder: 0,
      isPublished: true,
    };
    vi.mocked(prisma.teamMember.create).mockResolvedValue(mockCreated as any);

    const result = await caller.team.create(input);

    expect(result).toEqual(mockCreated);
    expect(prisma.teamMember.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        name: "Jan Jansen",
        role: "Chef-kok",
        bio: "Ervaren kok met passie voor Italiaans",
        sortOrder: 0,
        isPublished: true,
      }),
    });
  });
});

describe("team.update", () => {
  it("updates a team member", async () => {
    const mockUpdated = { id: "tm1", name: "Jan Updated", role: "Head Chef" };
    vi.mocked(prisma.teamMember.update).mockResolvedValue(mockUpdated as any);

    const result = await caller.team.update({ id: "tm1", name: "Jan Updated" });

    expect(result).toEqual(mockUpdated);
    expect(prisma.teamMember.update).toHaveBeenCalledWith({
      where: { id: "tm1" },
      data: { name: "Jan Updated" },
    });
  });
});

describe("team.delete", () => {
  it("deletes a team member by ID", async () => {
    vi.mocked(prisma.teamMember.delete).mockResolvedValue({} as any);

    const result = await caller.team.delete({ id: "tm1" });

    expect(result).toEqual({ success: true });
    expect(prisma.teamMember.delete).toHaveBeenCalledWith({
      where: { id: "tm1" },
    });
  });
});

describe("team.reorder", () => {
  it("updates sortOrder for multiple members", async () => {
    vi.mocked(prisma.teamMember.update).mockResolvedValue({} as any);

    const input = [
      { id: "tm1", sortOrder: 1 },
      { id: "tm2", sortOrder: 0 },
    ];

    const result = await caller.team.reorder(input);

    expect(result).toEqual({ success: true });
    expect(prisma.teamMember.update).toHaveBeenCalledTimes(2);
    expect(prisma.teamMember.update).toHaveBeenCalledWith({
      where: { id: "tm1" },
      data: { sortOrder: 1 },
    });
    expect(prisma.teamMember.update).toHaveBeenCalledWith({
      where: { id: "tm2" },
      data: { sortOrder: 0 },
    });
  });
});

describe("team.togglePublish", () => {
  it("toggles publish status", async () => {
    const mockUpdated = { id: "tm1", isPublished: false };
    vi.mocked(prisma.teamMember.update).mockResolvedValue(mockUpdated as any);

    const result = await caller.team.togglePublish({
      id: "tm1",
      isPublished: false,
    });

    expect(result).toEqual(mockUpdated);
    expect(prisma.teamMember.update).toHaveBeenCalledWith({
      where: { id: "tm1" },
      data: { isPublished: false },
    });
  });
});

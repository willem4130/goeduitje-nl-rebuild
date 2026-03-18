import { describe, it, expect, vi, beforeEach } from "vitest";
import { appRouter } from "@/server/api/root";
import { prisma } from "@/lib/prisma";

const caller = appRouter.createCaller({} as any);

beforeEach(() => {
  vi.clearAllMocks();
});

// Need to add user mock since it's not in setup
vi.mock("@/lib/prisma", async (importOriginal) => {
  const original = await importOriginal<typeof import("@/lib/prisma")>();
  return {
    ...original,
    prisma: {
      ...original.prisma,
      user: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
    },
  };
});

const mockUser = {
  id: "u1",
  name: "Jan Jansen",
  email: "jan@test.nl",
  role: "user",
  bio: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("user.getAll", () => {
  it("returns all users", async () => {
    vi.mocked(prisma.user.findMany).mockResolvedValue([mockUser] as any);
    const result = await caller.user.getAll();
    expect(result).toEqual([mockUser]);
    expect(prisma.user.findMany).toHaveBeenCalledWith({ orderBy: { createdAt: "desc" } });
  });
});

describe("user.getById", () => {
  it("returns user by ID", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any);
    const result = await caller.user.getById({ id: "u1" });
    expect(result).toEqual(mockUser);
  });
});

describe("user.create", () => {
  it("creates a user", async () => {
    vi.mocked(prisma.user.create).mockResolvedValue(mockUser as any);
    const result = await caller.user.create({ name: "Jan Jansen", email: "jan@test.nl", role: "user" });
    expect(result).toEqual(mockUser);
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: { name: "Jan Jansen", email: "jan@test.nl", role: "user" },
    });
  });
});

describe("user.update", () => {
  it("updates a user", async () => {
    vi.mocked(prisma.user.update).mockResolvedValue({ ...mockUser, name: "Piet" } as any);
    await caller.user.update({ id: "u1", name: "Piet", email: "piet@test.nl", role: "admin" });
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: "u1" },
      data: { name: "Piet", email: "piet@test.nl", role: "admin" },
    });
  });
});

describe("user.delete", () => {
  it("deletes a user", async () => {
    vi.mocked(prisma.user.delete).mockResolvedValue(mockUser as any);
    const result = await caller.user.delete({ id: "u1" });
    expect(result).toEqual(mockUser);
    expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: "u1" } });
  });
});

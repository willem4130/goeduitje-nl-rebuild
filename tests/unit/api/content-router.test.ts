import { describe, it, expect, vi, beforeEach } from "vitest";
import { appRouter } from "@/server/api/root";
import { prisma } from "@/lib/prisma";

const caller = appRouter.createCaller({} as any);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("content.getByPage", () => {
  it("returns content grouped by section", async () => {
    vi.mocked(prisma.pageContent.findMany).mockResolvedValue([
      {
        page: "home",
        section: "hero",
        key: "title",
        value: "Welcome",
        type: "text",
        updatedAt: new Date(),
      },
      {
        page: "home",
        section: "hero",
        key: "subtitle",
        value: "Subtitle",
        type: "text",
        updatedAt: new Date(),
      },
      {
        page: "home",
        section: "about",
        key: "text",
        value: "About us",
        type: "text",
        updatedAt: new Date(),
      },
    ] as any);

    const result = await caller.content.getByPage({ page: "home" });
    expect(result).toEqual({
      hero: { title: "Welcome", subtitle: "Subtitle" },
      about: { text: "About us" },
    });
  });

  it("returns empty object for empty page", async () => {
    vi.mocked(prisma.pageContent.findMany).mockResolvedValue([]);
    const result = await caller.content.getByPage({ page: "nonexistent" });
    expect(result).toEqual({});
  });
});

describe("content.get", () => {
  it("returns a specific content value", async () => {
    vi.mocked(prisma.pageContent.findUnique).mockResolvedValue({
      page: "home",
      section: "hero",
      key: "title",
      value: "Welcome",
    } as any);
    const result = await caller.content.get({
      page: "home",
      section: "hero",
      key: "title",
    });
    expect(result).toBe("Welcome");
  });

  it("returns null for nonexistent key", async () => {
    vi.mocked(prisma.pageContent.findUnique).mockResolvedValue(null);
    const result = await caller.content.get({
      page: "home",
      section: "hero",
      key: "missing",
    });
    expect(result).toBeNull();
  });
});

describe("content.getAll", () => {
  it("returns all content grouped by page", async () => {
    vi.mocked(prisma.pageContent.findMany).mockResolvedValue([
      {
        page: "home",
        section: "hero",
        key: "title",
        value: "Welcome",
        type: "text",
      },
      {
        page: "about",
        section: "intro",
        key: "text",
        value: "About",
        type: "text",
      },
    ] as any);

    const result = await caller.content.getAll();
    expect(result).toEqual({
      home: [{ section: "hero", key: "title", value: "Welcome", type: "text" }],
      about: [{ section: "intro", key: "text", value: "About", type: "text" }],
    });
  });
});

describe("content.update", () => {
  it("upserts a content item", async () => {
    const mockContent = {
      id: "c1",
      page: "home",
      section: "hero",
      key: "title",
      value: "New Title",
      type: "text",
    };
    vi.mocked(prisma.pageContent.upsert).mockResolvedValue(mockContent as any);

    await caller.content.update({
      page: "home",
      section: "hero",
      key: "title",
      value: "New Title",
    });
    expect(prisma.pageContent.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          page_section_key: { page: "home", section: "hero", key: "title" },
        },
        update: { value: "New Title", type: undefined },
        create: expect.objectContaining({ value: "New Title", type: "text" }),
      })
    );
  });

  it("supports custom type", async () => {
    vi.mocked(prisma.pageContent.upsert).mockResolvedValue({} as any);
    await caller.content.update({
      page: "p",
      section: "s",
      key: "k",
      value: "v",
      type: "richtext",
    });
    expect(prisma.pageContent.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        update: { value: "v", type: "richtext" },
        create: expect.objectContaining({ type: "richtext" }),
      })
    );
  });
});

describe("content.updateMany", () => {
  it("upserts multiple content items", async () => {
    vi.mocked(prisma.pageContent.upsert).mockResolvedValue({} as any);
    const result = await caller.content.updateMany({
      page: "home",
      content: [
        { section: "hero", key: "title", value: "Title" },
        { section: "hero", key: "subtitle", value: "Sub" },
      ],
    });
    expect(result).toEqual({ success: true });
    expect(prisma.pageContent.upsert).toHaveBeenCalledTimes(2);
  });
});

describe("content.delete", () => {
  it("deletes a content item", async () => {
    vi.mocked(prisma.pageContent.delete).mockResolvedValue({} as any);
    const result = await caller.content.delete({
      page: "home",
      section: "hero",
      key: "title",
    });
    expect(result).toEqual({ success: true });
    expect(prisma.pageContent.delete).toHaveBeenCalledWith({
      where: {
        page_section_key: { page: "home", section: "hero", key: "title" },
      },
    });
  });
});

describe("content.getPages", () => {
  it("returns unique page names", async () => {
    vi.mocked(prisma.pageContent.findMany).mockResolvedValue([
      { page: "home" },
      { page: "about" },
    ] as any);
    const result = await caller.content.getPages();
    expect(result).toEqual(["home", "about"]);
  });
});

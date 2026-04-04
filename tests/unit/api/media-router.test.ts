import { describe, it, expect, vi, beforeEach } from "vitest";
import { appRouter } from "@/server/api/root";
import { prisma } from "@/lib/prisma";

const caller = appRouter.createCaller({} as any);

beforeEach(() => {
  vi.clearAllMocks();
});

const mockMedia = {
  id: 1,
  blobUrl: "https://blob.vercel-storage.com/test.jpg",
  fileName: "test.jpg",
  fileSize: 1024,
  mimeType: "image/jpeg",
  category: "workshop",
  showOnWebsite: true,
  featuredOnHomepage: false,
  displayOrder: 0,
  tags: null,
};

describe("media.getAll", () => {
  it("returns visible content media excluding site assets", async () => {
    vi.mocked(prisma.mediaGallery.findMany).mockResolvedValue([
      mockMedia,
    ] as any);
    const result = await caller.media.getAll();
    expect(result).toEqual([mockMedia]);
    expect(prisma.mediaGallery.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          showOnWebsite: true,
          NOT: { category: { startsWith: "site-" } },
        }),
      })
    );
  });

  it("filters by category", async () => {
    vi.mocked(prisma.mediaGallery.findMany).mockResolvedValue([]);
    await caller.media.getAll({ category: "food" });
    expect(prisma.mediaGallery.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ category: "food" }),
      })
    );
  });

  it("supports limit", async () => {
    vi.mocked(prisma.mediaGallery.findMany).mockResolvedValue([]);
    await caller.media.getAll({ limit: 5 });
    expect(prisma.mediaGallery.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 5 })
    );
  });
});

describe("media.getFeatured", () => {
  it("returns featured homepage media", async () => {
    vi.mocked(prisma.mediaGallery.findMany).mockResolvedValue([
      mockMedia,
    ] as any);
    const result = await caller.media.getFeatured();
    expect(result).toEqual([mockMedia]);
    expect(prisma.mediaGallery.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          showOnWebsite: true,
          featuredOnHomepage: true,
          NOT: { category: { startsWith: "site-" } },
        }),
        take: 10,
      })
    );
  });

  it("supports custom limit", async () => {
    vi.mocked(prisma.mediaGallery.findMany).mockResolvedValue([]);
    await caller.media.getFeatured({ limit: 3 });
    expect(prisma.mediaGallery.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 3 })
    );
  });
});

describe("media.getByCategory", () => {
  it("returns media by content category", async () => {
    vi.mocked(prisma.mediaGallery.findMany).mockResolvedValue([
      mockMedia,
    ] as any);
    const result = await caller.media.getByCategory({ category: "workshop" });
    expect(result).toEqual([mockMedia]);
    expect(prisma.mediaGallery.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { showOnWebsite: true, category: "workshop" },
      })
    );
  });
});

describe("media.getById", () => {
  it("returns single media item", async () => {
    vi.mocked(prisma.mediaGallery.findUnique).mockResolvedValue(
      mockMedia as any
    );
    const result = await caller.media.getById({ id: 1 });
    expect(result).toEqual(mockMedia);
  });
});

describe("media.getSiteAsset", () => {
  it("returns site asset by category", async () => {
    vi.mocked(prisma.mediaGallery.findFirst).mockResolvedValue(
      mockMedia as any
    );
    const result = await caller.media.getSiteAsset({
      category: "site-hero-video",
    });
    expect(result).toEqual(mockMedia);
  });

  it("filters by variant tag", async () => {
    vi.mocked(prisma.mediaGallery.findFirst).mockResolvedValue(
      mockMedia as any
    );
    await caller.media.getSiteAsset({
      category: "site-hero-poster",
      variant: "mobile",
    });
    expect(prisma.mediaGallery.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          category: "site-hero-poster",
          tags: { array_contains: ["mobile"] },
        }),
      })
    );
  });
});

describe("media.getSiteAssets", () => {
  it("returns all site assets for category", async () => {
    vi.mocked(prisma.mediaGallery.findMany).mockResolvedValue([
      mockMedia,
    ] as any);
    const result = await caller.media.getSiteAssets({ category: "site-logo" });
    expect(result).toEqual([mockMedia]);
  });
});

describe("media.getHeroMedia", () => {
  it("returns structured hero media with variants", async () => {
    const desktopVideo = {
      ...mockMedia,
      id: 1,
      category: "site-hero-video",
      tags: ["desktop"],
    };
    const mobileVideo = {
      ...mockMedia,
      id: 2,
      category: "site-hero-video",
      tags: ["mobile"],
    };
    const desktopPoster = {
      ...mockMedia,
      id: 3,
      category: "site-hero-poster",
      tags: ["desktop"],
    };

    vi.mocked(prisma.mediaGallery.findMany)
      .mockResolvedValueOnce([desktopVideo, mobileVideo] as any) // videos
      .mockResolvedValueOnce([desktopPoster] as any); // posters

    const result = await caller.media.getHeroMedia();
    expect(result.videos.desktop).toEqual(desktopVideo);
    expect(result.videos.mobile).toEqual(mobileVideo);
    expect(result.posters.desktop).toEqual(desktopPoster);
    expect(result.posters.mobile).toBeNull();
  });

  it("falls back to first item when no variant tag", async () => {
    const video = {
      ...mockMedia,
      id: 1,
      category: "site-hero-video",
      tags: null,
    };
    vi.mocked(prisma.mediaGallery.findMany)
      .mockResolvedValueOnce([video] as any)
      .mockResolvedValueOnce([]);

    const result = await caller.media.getHeroMedia();
    expect(result.videos.desktop).toEqual(video);
    expect(result.videos.mobile).toBeNull();
  });
});

describe("media.getLogos", () => {
  it("returns nav and footer logos", async () => {
    const navLogo = { ...mockMedia, id: 1, tags: ["nav"] };
    const footerLogo = { ...mockMedia, id: 2, tags: ["footer"] };
    vi.mocked(prisma.mediaGallery.findMany).mockResolvedValue([
      navLogo,
      footerLogo,
    ] as any);

    const result = await caller.media.getLogos();
    expect(result.nav).toEqual(navLogo);
    expect(result.footer).toEqual(footerLogo);
  });

  it("falls back to first logo when no variants", async () => {
    const logo = { ...mockMedia, id: 1, tags: null };
    vi.mocked(prisma.mediaGallery.findMany).mockResolvedValue([logo] as any);

    const result = await caller.media.getLogos();
    expect(result.nav).toEqual(logo);
    expect(result.footer).toEqual(logo);
  });
});

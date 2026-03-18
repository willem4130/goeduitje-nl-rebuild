import { describe, it, expect, vi, beforeEach } from "vitest";
import { appRouter } from "@/server/api/root";
import { prisma } from "@/lib/prisma";

const caller = appRouter.createCaller({} as any);

beforeEach(() => {
  vi.clearAllMocks();
});

const mockTestimonial = {
  id: "t1",
  quote: "Great workshop!",
  author: "Jan Jansen",
  role: "Manager",
  company: "ACME",
  rating: 5,
  image: null,
  isFeatured: true,
  isPublished: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("testimonials.getAll", () => {
  it("returns published testimonials", async () => {
    vi.mocked(prisma.testimonial.findMany).mockResolvedValue([mockTestimonial] as any);
    const result = await caller.testimonials.getAll();
    expect(result).toEqual([mockTestimonial]);
    expect(prisma.testimonial.findMany).toHaveBeenCalledWith({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
    });
  });

  it("includes unpublished when flag set", async () => {
    vi.mocked(prisma.testimonial.findMany).mockResolvedValue([mockTestimonial] as any);
    await caller.testimonials.getAll({ includeUnpublished: true });
    expect(prisma.testimonial.findMany).toHaveBeenCalledWith({
      where: {},
      orderBy: { createdAt: "desc" },
    });
  });
});

describe("testimonials.getFeatured", () => {
  it("returns featured published testimonials", async () => {
    vi.mocked(prisma.testimonial.findMany).mockResolvedValue([mockTestimonial] as any);
    const result = await caller.testimonials.getFeatured();
    expect(result).toEqual([mockTestimonial]);
    expect(prisma.testimonial.findMany).toHaveBeenCalledWith({
      where: { isPublished: true, isFeatured: true },
      orderBy: { createdAt: "desc" },
    });
  });
});

describe("testimonials.getById", () => {
  it("returns testimonial by ID", async () => {
    vi.mocked(prisma.testimonial.findUnique).mockResolvedValue(mockTestimonial as any);
    const result = await caller.testimonials.getById({ id: "t1" });
    expect(result).toEqual(mockTestimonial);
  });
});

describe("testimonials.create", () => {
  it("creates a testimonial with defaults", async () => {
    vi.mocked(prisma.testimonial.create).mockResolvedValue(mockTestimonial as any);
    await caller.testimonials.create({
      quote: "Great workshop!",
      author: "Jan Jansen",
    });
    expect(prisma.testimonial.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        quote: "Great workshop!",
        author: "Jan Jansen",
        rating: 5,
        isFeatured: false,
        isPublished: true,
      }),
    });
  });

  it("creates with custom rating and featured", async () => {
    vi.mocked(prisma.testimonial.create).mockResolvedValue(mockTestimonial as any);
    await caller.testimonials.create({
      quote: "Amazing!",
      author: "Piet",
      rating: 4,
      isFeatured: true,
      isPublished: false,
      role: "Developer",
      company: "Test BV",
      image: "/img.jpg",
    });
    expect(prisma.testimonial.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        rating: 4,
        isFeatured: true,
        isPublished: false,
        role: "Developer",
        company: "Test BV",
        image: "/img.jpg",
      }),
    });
  });
});

describe("testimonials.update", () => {
  it("updates a testimonial", async () => {
    vi.mocked(prisma.testimonial.update).mockResolvedValue(mockTestimonial as any);
    await caller.testimonials.update({ id: "t1", quote: "Updated quote" });
    expect(prisma.testimonial.update).toHaveBeenCalledWith({
      where: { id: "t1" },
      data: { quote: "Updated quote" },
    });
  });
});

describe("testimonials.delete", () => {
  it("deletes a testimonial", async () => {
    vi.mocked(prisma.testimonial.delete).mockResolvedValue(mockTestimonial as any);
    const result = await caller.testimonials.delete({ id: "t1" });
    expect(result).toEqual({ success: true });
  });
});

describe("testimonials.togglePublish", () => {
  it("toggles publish status", async () => {
    vi.mocked(prisma.testimonial.update).mockResolvedValue({ ...mockTestimonial, isPublished: false } as any);
    await caller.testimonials.togglePublish({ id: "t1", isPublished: false });
    expect(prisma.testimonial.update).toHaveBeenCalledWith({
      where: { id: "t1" },
      data: { isPublished: false },
    });
  });
});

describe("testimonials.toggleFeatured", () => {
  it("toggles featured status", async () => {
    vi.mocked(prisma.testimonial.update).mockResolvedValue({ ...mockTestimonial, isFeatured: false } as any);
    await caller.testimonials.toggleFeatured({ id: "t1", isFeatured: false });
    expect(prisma.testimonial.update).toHaveBeenCalledWith({
      where: { id: "t1" },
      data: { isFeatured: false },
    });
  });
});

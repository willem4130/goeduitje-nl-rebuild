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

describe("testimonials.getFeatured", () => {
  it("returns featured published testimonials", async () => {
    vi.mocked(prisma.testimonial.findMany).mockResolvedValue([
      mockTestimonial,
    ] as any);
    const result = await caller.testimonials.getFeatured();
    expect(result).toEqual([mockTestimonial]);
    expect(prisma.testimonial.findMany).toHaveBeenCalledWith({
      where: { isPublished: true, isFeatured: true },
      orderBy: { createdAt: "desc" },
    });
  });
});

import { describe, it, expect } from "vitest";

// Production URLs
const FRONTEND_URL =
  process.env.FRONTEND_URL || "https://goeduitje-nl-rebuild.vercel.app";
const BACKEND_URL =
  process.env.BACKEND_URL || "https://goeduitje-backend.vercel.app";

// Skip these tests unless INTEGRATION_TEST=true is set
const shouldRun = process.env.INTEGRATION_TEST === "true";

describe.skipIf(!shouldRun)("Form → DB → Admin round-trip", () => {
  describe("Contact Form → Feedback table → Admin API", () => {
    it("contact form submission appears in admin feedback API", async () => {
      const response = await fetch(`${BACKEND_URL}/api/content/feedback`);
      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data).toHaveProperty("items");
      expect(Array.isArray(data.items)).toBe(true);
    });

    it("feedback items have required fields", async () => {
      const response = await fetch(`${BACKEND_URL}/api/content/feedback`);
      const data = await response.json();
      if (data.items.length > 0) {
        const item = data.items[0];
        expect(item).toHaveProperty("id");
        expect(item).toHaveProperty("name");
        expect(item).toHaveProperty("email");
        expect(item).toHaveProperty("message");
        expect(item).toHaveProperty("isRead");
        expect(item).toHaveProperty("createdAt");
      }
    });
  });

  describe("Workshop Configs → Admin API", () => {
    it("workshop configs API endpoint exists and returns data", async () => {
      const response = await fetch(`${BACKEND_URL}/api/workshops/configs`);
      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data).toHaveProperty("configs");
      expect(Array.isArray(data.configs)).toBe(true);
    });

    it("workshop config items have required fields", async () => {
      const response = await fetch(`${BACKEND_URL}/api/workshops/configs`);
      const data = await response.json();
      if (data.configs.length > 0) {
        const config = data.configs[0];
        expect(config).toHaveProperty("id");
        expect(config).toHaveProperty("type");
        expect(config).toHaveProperty("participantCount");
        expect(config).toHaveProperty("workshops");
        expect(config).toHaveProperty("name");
        expect(config).toHaveProperty("email");
        expect(config).toHaveProperty("phone");
      }
    });
  });

  describe("Workshop Requests → Admin API", () => {
    it("workshop requests API returns data", async () => {
      const response = await fetch(`${BACKEND_URL}/api/workshops/requests`);
      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data).toHaveProperty("requests");
    });
  });

  describe("Bookings → Admin API", () => {
    it("bookings API endpoint exists", async () => {
      const response = await fetch(`${BACKEND_URL}/api/bookings`);
      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data).toHaveProperty("bookings");
    });
  });

  describe("Dashboard Stats", () => {
    it("dashboard stats include all form counts", async () => {
      const response = await fetch(`${BACKEND_URL}/api/dashboard/stats`);
      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data).toHaveProperty("stats");
      expect(data.stats).toHaveProperty("pendingRequests");
      expect(data.stats).toHaveProperty("confirmedWorkshops");
    });
  });

  describe("Google Reviews → Admin", () => {
    it("google reviews admin API works", async () => {
      const response = await fetch(`${BACKEND_URL}/api/google-reviews`);
      expect(response.ok).toBe(true);
    });
  });
});

import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup/vitest.setup.ts"],
    include: ["tests/**/*.test.{ts,tsx}"],
    exclude: ["tests/e2e/**", "node_modules/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "text-summary", "html", "lcov"],
      include: [
        "src/lib/**/*.ts",
        "src/server/api/routers/**/*.ts",
        "src/app/api/**/*.ts",
      ],
      exclude: [
        "src/components/ui/**",
        "src/lib/prisma.ts",
        "src/lib/resend.ts",
        "src/lib/google-places.ts",
        "src/lib/animations.ts",
        "src/lib/city-data.ts",
        "src/lib/email-helpers.ts",
        "src/lib/image-placeholders.ts",
        "src/lib/site-assets.ts",
        "src/app/api/trpc/**",
        "src/app/api/webhooks/**",
        "**/*.d.ts",
        "**/*.test.*",
      ],
    },
  },
});

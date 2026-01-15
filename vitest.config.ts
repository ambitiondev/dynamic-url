import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      reportOnFailure: true,
      include: ["src/**/*.{ts,tsx}"],
    },
  },
});

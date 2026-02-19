import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/main.ts"],
  outDir: "dist",
  format: ["cjs"],
  platform: "node",
  target: "node20",
  sourcemap: true,
  clean: true,
  dts: false,
  splitting: false,
});

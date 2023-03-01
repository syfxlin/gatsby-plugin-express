import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/gatsby/gatsby-node.ts", "src/server/index.ts"],
  splitting: true,
  clean: true,
  dts: true,
  format: ["cjs"],
});

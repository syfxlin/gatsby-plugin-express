import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/gatsby/gatsby-node.ts", "src/server/bin.ts"],
  splitting: true,
  clean: true,
  dts: true,
  format: ["cjs"],
});

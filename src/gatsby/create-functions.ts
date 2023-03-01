import fs from "fs-extra";
import path from "path";
import { PluginState } from "./create-plugin-state";
import { IGatsbyFunction } from "gatsby/internal";

export const createFunctions = async (state: PluginState) => {
  const content = await fs.readFile(path.join(state.folder.functions, "manifest.json"), "utf-8");
  return JSON.parse(content) as IGatsbyFunction[];
};

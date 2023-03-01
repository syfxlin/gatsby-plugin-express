import fs from "fs-extra";
import path from "path";
import { PluginConfig } from "../gatsby/plugin-config";

export const loadConfig = (): PluginConfig => {
  try {
    const content = fs.readFileSync(path.resolve(".cache", "gatsby-plugin-express.json"), "utf-8");
    return JSON.parse(content);
  } catch (e) {
    return {};
  }
};

import { Express, Router } from "express";
import { PluginConfig } from "../gatsby/plugin-config";
import { Logger } from "pino";

export type Context = {
  app: Express;
  router: Router;
  logger: Logger;
  config: PluginConfig;
};

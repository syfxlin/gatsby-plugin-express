import { Context } from "./types";
import path from "path";
import fs from "fs-extra";
import { applyModuleResHeader, Modules } from "./headers";
import { NextFunction, Request, Response } from "express";

export const applyInternalError = async ({ router, logger }: Context) => {
  const file = path.resolve("public", "500.html");
  const exists = await fs.exists(file);

  logger.info(`Registering 500 error page`);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  router.use((e: Error, request: Request, response: Response, next: NextFunction) => {
    logger.error(e);
    applyModuleResHeader(response, Modules.INTERNAL_ERROR);
    if (exists) {
      response.status(500).type("text/html").sendFile(file);
    } else {
      response.status(500).send("Internal Server Error");
    }
  });
};

import { Context } from "./types";
import path from "path";
import fs from "fs-extra";
import { applyModuleResHeader, Modules } from "./headers";

export const applyNotFound = async ({ router, logger }: Context) => {
  const file = path.resolve("public", "404.html");
  const exists = await fs.exists(file);

  logger.info(`Registering 404 error page`);
  router.use((request, response) => {
    applyModuleResHeader(response, Modules.NOT_FOUND);
    if (exists) {
      response.status(404).type("text/html").sendFile(file);
    } else {
      response.status(404).send("Not Found");
    }
  });
};

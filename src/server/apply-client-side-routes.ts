import { Context } from "./types";
import { applyModuleResHeader, Modules } from "./headers";
import path from "path";
import { wrap } from "./utils";

export const applyClientSideRoutes = async ({ router, config, logger }: Context) => {
  logger.info(`Registering ${config.clientSideRoutes?.length ?? 0} client-only route(s)`);

  if (config.clientSideRoutes?.length) {
    for (const route of config.clientSideRoutes) {
      logger.debug(`Registering client-only route: ${route.path}`);
      router.get(
        route.matchPath ?? route.path,
        wrap(async (request, response) => {
          applyModuleResHeader(response, Modules.CLIENT);
          response.type("text/html").sendFile(path.resolve("public", route.path, "index.html"));
        })
      );
    }
  }
};

import path from "path";
import { reverseFixedPagePath } from "gatsby/dist/utils/page-data";
import { Context } from "./types";
import { applyModuleResHeader, Modules } from "./headers";

export const applyServerSideRoutes = async ({ router, config, logger }: Context) => {
  if (config.serverSideRoutes && config.serverSideRoutes.length) {
    const counts = { DSG: 0, SSR: 0 };
    for (const route of config.serverSideRoutes) {
      counts[route.mode]++;
    }
    logger.info(`Registering ${counts.DSG} DSG route(s)`);
    logger.info(`Registering ${counts.SSR} SSR route(s)`);

    const { GraphQLEngine } = (await import(
      path.resolve(".cache", "query-engine")
    )) as typeof import("gatsby/dist/schema/graphql-engine/entry");
    const { getData, renderPageData, renderHTML } = (await import(
      path.resolve(".cache", "page-ssr")
    )) as typeof import("gatsby/dist/utils/page-ssr-module/entry");

    const graphqlEngine = new GraphQLEngine({ dbPath: path.resolve(".cache", "data", "datastore") });

    for (const route of config.serverSideRoutes) {
      const dataPath = path.posix.join("/page-data", route.path, "page-data.json");
      const matchPath = route.matchPath ?? route.path;

      router.get(dataPath, async (request, response) => {
        const potentialPagePath = reverseFixedPagePath(route.path);
        const page = graphqlEngine.findPageByPath(potentialPagePath);

        if (!page) {
          response.status(404).send(`Not Found`);
          return;
        }

        applyModuleResHeader(response, page.mode === "SSR" ? Modules.SSR : Modules.DSG);

        try {
          const pageQueryData = await getData({ pathName: request.path, graphqlEngine, req: request });

          const pageData = await renderPageData({ data: pageQueryData });

          if (page.mode === "SSR") {
            if (pageQueryData?.serverDataHeaders) {
              response.header(pageQueryData.serverDataHeaders);
            }
            if (pageQueryData?.serverDataStatus) {
              response.status(pageQueryData.serverDataStatus);
            }
          }

          response.send(pageData);
        } catch (e) {
          logger.error(e, `Handle SSR/DSG failed.`);
          throw new Error(`Error executing Gatsby SSR/DSG.`);
        }
      });

      router.get(matchPath, async (request, response) => {
        const potentialPagePath = reverseFixedPagePath(route.path);
        const page = graphqlEngine.findPageByPath(potentialPagePath);

        if (!page) {
          response.status(404).send(`Not Found`);
          return;
        }

        applyModuleResHeader(response, page.mode === "SSR" ? Modules.SSR : Modules.DSG);

        try {
          const pageQueryData = await getData({ pathName: request.path, graphqlEngine, req: request });

          const pageHtml = await renderHTML({ data: pageQueryData });

          if (page.mode === "SSR") {
            if (pageQueryData?.serverDataHeaders) {
              response.header(pageQueryData.serverDataHeaders);
            }
            if (pageQueryData?.serverDataStatus) {
              response.status(pageQueryData.serverDataStatus);
            }
          }

          response.type("text/html").send(pageHtml);
        } catch (e) {
          logger.error(e, `Handle SSR/DSG failed.`);
          throw new Error(`Error executing Gatsby SSR/DSG.`);
        }
      });
    }
  }
};

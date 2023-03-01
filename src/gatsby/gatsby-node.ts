import fs from "fs-extra";
import path from "path";
import { GatsbyNode } from "gatsby";
import { createPluginState } from "./create-plugin-state";
import { createRedirects } from "./create-redirects";
import { createFunctions } from "./create-functions";
import { createClientSideRoutes } from "./create-client-side-routes";
import { PluginConfig } from "./plugin-config";
import { createServerSideRoutes } from "./create-server-side-routes";

export const onPostBuild: GatsbyNode["onPostBuild"] = async ({ store, reporter }) => {
  try {
    const state = await createPluginState(store);

    const redirects = await createRedirects(state);
    const functions = await createFunctions(state);
    const clientSideRoutes = await createClientSideRoutes(state);
    const serverSideRoutes = await createServerSideRoutes(state);

    const data: PluginConfig = {
      pathPrefix: state.config.pathPrefix,
      headers: state.config.headers,
      redirects,
      functions,
      clientSideRoutes,
      serverSideRoutes,
    };

    await fs.writeFile(path.join(state.folder.cache, "gatsby-plugin-express.json"), JSON.stringify(data, undefined, 2));
  } catch (e) {
    if (e instanceof Error) {
      reporter.error("Error building config for Fastify Server", e, "gatsby-plugin-express");
    }
  }
};

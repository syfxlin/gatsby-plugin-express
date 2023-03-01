import { PluginState } from "./create-plugin-state";
import { PluginConfig } from "./plugin-config";

export const createClientSideRoutes = async (state: PluginState) => {
  const routes: PluginConfig["clientSideRoutes"] = [];
  for (const page of state.pages.values()) {
    if (page && page.matchPath && page.mode !== "SSR" && page.mode !== "DSG") {
      routes.push({
        matchPath: page.matchPath,
        path: page.path,
      });
    }
  }
  return routes;
};

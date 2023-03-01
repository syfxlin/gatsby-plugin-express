import { PluginState } from "./create-plugin-state";
import { PluginConfig } from "./plugin-config";

export const createServerSideRoutes = async (state: PluginState) => {
  const routes: PluginConfig["serverSideRoutes"] = [];
  for (const page of state.pages.values()) {
    if (page && (page.mode === "SSR" || page.mode === "DSG")) {
      routes.push({
        matchPath: page.matchPath ?? page.path,
        path: page.path,
        mode: page.mode,
      });
    }
  }
  return routes;
};

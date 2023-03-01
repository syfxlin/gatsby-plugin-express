import { PluginState } from "./create-plugin-state";

export const createRedirects = async (state: PluginState) => {
  const pathPrefix = state.config.pathPrefix;
  if (state.redirects && pathPrefix) {
    state.redirects = state.redirects.map((redirect) => {
      if (redirect.fromPath.startsWith(pathPrefix)) {
        redirect.fromPath = redirect.fromPath.slice(pathPrefix.length);
      }
      if (redirect.toPath.startsWith(pathPrefix)) {
        redirect.toPath = redirect.toPath.slice(pathPrefix.length);
      }
      return redirect;
    });
  }
  return state.redirects;
};

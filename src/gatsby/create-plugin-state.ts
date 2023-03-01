import { Store } from "gatsby";
import { IGatsbyState } from "gatsby/internal";
import path from "path";

export const createPluginState = async (store: Store): Promise<PluginState> => {
  const { program, config, pages, redirects } = store.getState() as IGatsbyState;

  const folder = {
    cache: path.join(program.directory, ".cache"),
    public: path.join(program.directory, "public"),
    functions: path.join(program.directory, ".cache", "functions"),
  };

  return { program, config, pages, redirects, folder };
};

export type PluginState = {
  program: IGatsbyState["program"];
  config: IGatsbyState["config"] & { headers?: Record<string, Record<string, string>> };
  pages: IGatsbyState["pages"];
  redirects: IGatsbyState["redirects"];
  folder: {
    cache: string;
    public: string;
    functions: string;
  };
};

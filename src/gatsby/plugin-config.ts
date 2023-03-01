export type PluginConfig = {
  pathPrefix?: string | undefined;
  headers?: Record<string, Record<string, string>>;
  redirects?: Array<{
    fromPath: string;
    toPath: string;
    isPermanent?: boolean;
    statusCode?: number;
  }>;
  functions?: Array<{
    functionRoute: string;
    relativeCompiledFilePath: string;
    absoluteCompiledFilePath: string;
    matchPath: string | undefined;
    pluginName: string;
  }>;
  clientSideRoutes?: Array<{
    matchPath: string;
    path: string;
  }>;
  serverSideRoutes?: Array<{
    matchPath: string;
    path: string;
    mode: "DSG" | "SSR";
  }>;
};

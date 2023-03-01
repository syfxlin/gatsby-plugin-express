import { IncomingMessage, ServerResponse } from "http";

export enum Modules {
  DSG = "DSG",
  SSR = "SSR",
  STATIC = "Static",
  CLIENT = "Client",
  FUNCTIONS = "Functions",
  REDIRECTS = "Redirects",
  PROXIES = "Proxies",
  NOT_FOUND = "NotFound",
  INTERNAL_ERROR = "InternalError",
}

export const applyModuleReqHeader = (request: IncomingMessage, module: Modules) => {
  request.headers["X-Gatsby-Served-By"] = module;
};

export const applyModuleResHeader = (response: ServerResponse, module: Modules) => {
  response.setHeader("X-Gatsby-Served-By", module);
};

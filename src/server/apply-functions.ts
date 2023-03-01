import path from "path";
import express, { NextFunction, Request, Response } from "express";
import { applyModuleResHeader, Modules } from "./headers";
import { GatsbyFunctionBodyParserConfig, GatsbyFunctionConfig } from "gatsby";
import cookieParser from "cookie-parser";
import { Context } from "./types";
import { wrap } from "./utils";

const bodyParser = (type: keyof GatsbyFunctionBodyParserConfig, config?: GatsbyFunctionConfig) => {
  return (request: Request, response: Response, next: NextFunction) => {
    if (config?.bodyParser) {
      const bodyParserConfig = config.bodyParser[type];
      express[type](bodyParserConfig)(request, response, next);
    } else {
      next();
    }
  };
};

export const applyFunctions = async ({ router, config, logger }: Context) => {
  logger.info(`Registering ${config.functions?.length ?? 0} function(s) handler.`);

  if (config.functions?.length) {
    for (const item of config.functions) {
      const matchPath = path.posix.join(`/api`, item.matchPath ?? item.functionRoute);
      const importPath = path.resolve(".cache", "functions", item.relativeCompiledFilePath);

      const mod = await import(importPath);
      const fun = mod?.default ?? mod;

      logger.debug(`Registering function: ${item.functionRoute}`);
      router.all(
        matchPath,
        cookieParser(),
        bodyParser("raw"),
        bodyParser("text"),
        bodyParser("urlencoded"),
        bodyParser("json"),
        wrap(async (request, response) => {
          try {
            applyModuleResHeader(response, Modules.FUNCTIONS);
            await Promise.resolve(fun(request, response));
          } catch (e) {
            logger.error(e, `Handle function failed.`);
            throw new Error(`Error executing Gatsby Function.`);
          }
        })
      );
    }
  }
};

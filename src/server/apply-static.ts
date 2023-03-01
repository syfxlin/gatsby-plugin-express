import path from "path";
import send from "send";
import { NextFunction, Request, Response } from "express";
import { applyModuleResHeader, Modules } from "./headers";
import { Context } from "./types";
import { wrap } from "./utils";

export const applyStatic = async ({ router, logger }: Context) => {
  logger.info(`Registering static file handler.`);

  router.use(
    wrap(async (request: Request, response: Response, next: NextFunction) => {
      if (request.method !== "GET" && request.method !== "HEAD") {
        return next();
      }

      const stream = send(request, request.path === "/" ? "" : request.path, {
        root: path.resolve("public"),
        dotfiles: "allow",
      });

      stream.redirect = async function (p) {
        this.sendIndex(p);
      };
      stream.on("headers", (response: Response) => {
        applyModuleResHeader(response, Modules.STATIC);
      });
      stream.on("error", (error) => {
        if (error.statusCode < 500) {
          next();
        } else {
          next(error);
        }
      });

      stream.pipe(response);
    })
  );
};

import pino from "pino";
import cors from "cors";
import http from "pino-http";
import express from "express";
import compression from "compression";
import pjson from "../../package.json" assert { type: "json" };
import { loadConfig } from "./config";
import { applyStatic } from "./apply-static";
import { applyFunctions } from "./apply-functions";
import { applyRedirects } from "./apply-redirects";
import { applyClientSideRoutes } from "./apply-client-side-routes";
import { applyNotFound } from "./apply-not-found";
import { applyInternalError } from "./apply-internal-error";
import { applyHeaders } from "./apply-headers";
import { Command } from "commander";
import { applyServerSideRoutes } from "./apply-server-side-routes";

const cli = new Command("gserve");

cli.version(pjson.version, "-v, --version", "Output depker version number");
cli.option("-l, --log-level <level>", "Set log level", "info");
cli.option("-p, --port <port>", "Port to run the server on", "3000");
cli.option("-h, --host <host>", "Host to run the server on", "0.0.0.0");

cli.action(async (options: Record<string, any>) => {
  const app = express();
  const config = loadConfig();
  const logger = pino({ level: options.logLevel });
  const router = express.Router();
  const context = { app, config, logger, router };

  try {
    app.use(cors());
    app.use(compression());
    app.use(http({ logger }));
    if (config.pathPrefix) {
      app.use(config.pathPrefix, router);
    } else {
      app.use(router);
    }

    await applyHeaders(context);
    await applyClientSideRoutes(context);
    await applyServerSideRoutes(context);
    await applyFunctions(context);
    await applyRedirects(context);
    await applyStatic(context);
    await applyNotFound(context);
    await applyInternalError(context);

    await new Promise<void>((resolve) => app.listen(parseInt(options.port), options.host, resolve));
    logger.info(`Starting gatsby-server successfully.`);
  } catch (e) {
    logger.fatal(e, `Starting gatsby-server failed.`);
    process.exit(1);
  }
});

(async () => {
  try {
    await cli.parseAsync(process.argv);
  } catch (e) {
    process.exit(1);
  }
})();

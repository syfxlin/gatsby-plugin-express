import { Context } from "./types";
import { wrap } from "./utils";

export const applyHeaders = async ({ router, config, logger }: Context) => {
  logger.info(`Registering ${config.headers?.length ?? 0} header(s).`);

  const regexps = Object.entries(config.headers ?? {}).map(
    ([p, h]) => [new RegExp(p.replace(/\*/g, ".*")), h] as const
  );

  router.use(
    wrap(async (request, response, next) => {
      const headers = regexps.filter(([r]) => r.test(request.path)).map(([, h]) => h);
      for (const header of headers) {
        response.header(header);
      }
      next();
    })
  );
};

import { createProxyMiddleware } from "http-proxy-middleware";
import { Context } from "./types";
import { applyModuleReqHeader, applyModuleResHeader, Modules } from "./headers";
import { wrap } from "./utils";

export const applyRedirects = ({ router, config, logger }: Context) => {
  logger.info(`Registering ${config.redirects?.length ?? 0} redirect(s) handler.`);

  const redirects = config.redirects?.filter((r) => r.statusCode != 200);
  const proxies = config.redirects?.filter((r) => r.statusCode == 200);

  if (redirects?.length) {
    for (const redirect of redirects) {
      logger.debug(`Registering "${redirect.fromPath}" as redirect to "${redirect.toPath}".`);
      router.all(
        redirect.fromPath,
        wrap(async (request, response) => {
          applyModuleResHeader(response, Modules.REDIRECTS);
          const data = { ...request.params, ...request.query };
          const status = redirect.statusCode || (redirect.isPermanent ? 301 : 302);
          const replace = redirect.toPath.replace(/:(\w+)|(\*)/gi, (match, p1, p2) => {
            if (p1 && !data[p1]) return match;
            return data[p1 ?? p2] as string;
          });
          response.status(status).redirect(replace);
        })
      );
    }
  }
  if (proxies?.length) {
    for (const proxy of proxies) {
      logger.debug(`Registering "${proxy.fromPath}" as proxy to "${proxy.toPath}".`);
      router.all(
        proxy.fromPath,
        createProxyMiddleware({
          changeOrigin: true,
          router: (request) => {
            const data = { ...request.params, ...request.query };
            return proxy.toPath.replace(/:(\w+)|(\*)/gi, (match, p1, p2) => {
              if (p1 && !data[p1]) return match;
              return data[p1 ?? p2] as string;
            });
          },
          onProxyRes: (request) => {
            applyModuleReqHeader(request, Modules.PROXIES);
          },
        })
      );
    }
  }
};

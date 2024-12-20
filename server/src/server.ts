import express, { Request, Response } from "express";
import RateLimit from "express-rate-limit";
import expressStaticGzip from "express-static-gzip";
import helmet from "helmet";
import path from "path";
import { register } from "prom-client";
import { serveViteMode } from "@navikt/vite-mode";
import Configuration, { Environment } from "./config";
import { requestSecurelogInfo } from "./logger";
import { enforceAzureADMiddleware, userInfo } from "./middlewares";
import { routeProxyWithOboToken } from "./proxy";

export const server = express();

const SERVER_PORT = 8080;
const BUILD_PATH = path.resolve(__dirname, "../dist");

server.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'", "https://www.nav.no", "https://cdn.nav.no"],
      "connect-src": [
        "'self'",
        "http://localhost:5173",
        "https://telemetry.ekstern.dev.nav.no",
        "https://telemetry.nav.no/collect",
        "https://umami.nav.no",
      ],
    },
  }),
);

const startServer = () => {
  server.use(express.urlencoded({ extended: true }));
  server.use(express.json());

  server.use(
    expressStaticGzip(BUILD_PATH, {
      index: false,
      enableBrotli: true,
      orderPreference: ["br"],
    }),
    RateLimit({
      windowMs: 60 * 1000, // 1 minute
      max: 100,
    }),
  );

  // Logging middleware
  server.use(requestSecurelogInfo);

  // Health checks
  server.get("/internal/isAlive", (_req: Request, res: Response) => {
    res.sendStatus(200);
  });

  server.get("/internal/isReady", (_req: Request, res: Response) => {
    res.sendStatus(200);
  });

  // Metrics
  server.get("/internal/metrics", async (_req: Request, res: Response) => {
    res.setHeader("Content-Type", register.contentType);
    res.send(await register.metrics());
  });

  // Enforce Azure AD authentication
  server.use(`*`, enforceAzureADMiddleware);

  // Azure AD user info
  server.get("/userinfo", userInfo);

  // Proxy routes
  Configuration.apiConfig.forEach((app) => {
    if (Configuration.NAIS_CLUSTER_NAME === "dev-gcp") {
      routeProxyWithOboToken({
        apiUrl: app.apiUrl,
        apiAudience: app.apiAudience,
        apiProxy: app.apiProxy,
      });
    } else {
      if (app.environment.includes(Environment.PROD)) {
        routeProxyWithOboToken({
          apiUrl: app.apiUrl,
          apiAudience: app.apiAudience,
          apiProxy: app.apiProxy,
        });
      }
    }
  });

  serveViteMode(server, { port: "5173" });

  server.use(`/assets`, express.static(`${BUILD_PATH}/assets`));

  server.get(["/", "/*"], (_req: Request, res: Response) =>
    res.sendFile(`${BUILD_PATH}/index.html`),
  );

  server.listen(SERVER_PORT, () =>
    // eslint-disable-next-line no-console
    console.log(`Server listening on port ${SERVER_PORT}`),
  );
};

startServer();

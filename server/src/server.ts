import express, { Express, Request, Response } from "express";
import path from "path";
import expressStaticGzip from "express-static-gzip";
import RateLimit from "express-rate-limit";
import { hentBrukerIdent, initializeAzureAd } from "./azureAd";
import { logger } from "./logger";

const BUILD_PATH = path.resolve(__dirname, "../dist");
const PORT = process.env.APP_PORT || 8080;
const server: Express = express();

const startServer = () => {
  server.use(express.urlencoded());
  server.use(express.json());
  server.disable("x-powered-by");

  server.use(
    expressStaticGzip(BUILD_PATH, {
      index: false,
      enableBrotli: true,
      orderPreference: ["br"],
    }),
    RateLimit({
      windowMs: 10 * 1000,
      max: 20,
    })
  );

  server.get("/brukerident", hentBrukerIdent);

  server.get([`/internal/isAlive`, `/internal/isReady`], (_, res) => res.sendStatus(200));

  // Match everything except internal og static
  server.use(/^(?!.*\/(internal|static)\/).*$/, (_req: Request, res: Response) =>
    res.sendFile(`${BUILD_PATH}/index.html`)
  );

  server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
};

initializeAzureAd()
  .then(() => startServer())
  .catch((e) => logger.error("Kunne ikke starte server", e.message));

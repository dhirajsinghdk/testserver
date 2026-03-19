
import * as glob from "glob";
import { Application, Router } from "express";
import Logger from "../middleware/logsHandler";
import path from "path";

export default (app: Application): void => {
  const isDev = process.env.NODE_ENV === "development";
  let routePath = path.resolve(__dirname, "../modules/**/*.routes.{ts,js}");

  if (isDev) {
    routePath = routePath.replace(/\\/g, "/");
  }

  Logger.info(`${process.env.NODE_ENV} environment detected. Using route path: ${routePath}`);

  const version = "/api/v1/en";
  const mainRouter = Router();

  glob.sync(routePath).forEach((file: string) => {
    try {
      const route = require(file).default;

      if (route && typeof route.stack === "object") {
        mainRouter.use(version, route);
      } else {
        Logger.warn(`File ${file} does not export an Express Router`);
      }
    } catch (err: any) {
      Logger.error(`Error loading route file ${file}: ${err.message}`);
    }
  });

  app.use(mainRouter);
};

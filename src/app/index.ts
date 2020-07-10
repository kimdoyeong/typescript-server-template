import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import morgan from "morgan";

import errorMiddleware from "@packages/utils/middlewares/error";
import Router from "@packages/utils/Router";
import notFoundMiddleware from "@packages/utils/middlewares/notFound";
import settings from "./settings";
import environments from "./environments";
import Logger from "@packages/utils/logger";

class App {
  private port: number;
  private app = express();
  private static rootRouter = express.Router();

  constructor(port: number) {
    this.port = port;

    this.configureApp();

    Logger.info("DB에 연결하는 중...");
    mongoose
      .connect(environments.MONGO_URL, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      })
      .then(() => {
        this.startApp();
      });
  }
  public static registerRouter(path: string, router: Router) {
    this.rootRouter.use(path, router.router);
  }

  private configureApp() {
    if (settings.cors)
      this.app.use(
        cors({
          origin: settings.cors,
        })
      );
    this.app.use(
      morgan(environments.NODE_ENV === "development" ? "dev" : "common")
    );
    this.app.use(express.json());
    this.app.use(App.rootRouter);
    this.app.use(notFoundMiddleware);
    this.app.use(errorMiddleware);
  }
  private startApp() {
    this.app.listen(this.port, () => {
      Logger.info(`${this.port}번 포트에서 앱이 시작되었습니다.`);
    });
  }
}

export default App;

import express from "express";
import errorMiddleware from "@packages/utils/middlewares/error";
import Router from "@packages/utils/Router";
import notFoundMiddleware from "@packages/utils/middlewares/notFound";

class App {
  private port: number;
  private app = express();
  private static rootRouter = express.Router();

  constructor(port: number) {
    this.port = port;
    this.app.use(App.rootRouter);
    this.app.use(notFoundMiddleware);
    this.app.use(errorMiddleware);
    this.app.listen(this.port, () => {
      console.log(`App started at port ${this.port}`);
    });
  }
  public static registerRouter(path: string, router: Router) {
    this.rootRouter.use(path, router.router);
  }
}

export default App;

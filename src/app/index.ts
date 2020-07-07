import express from "express";
import errorMiddleware from "@packages/utils/middlewares/error";

class App {
  private port: number;
  private app = express();

  constructor(port: number) {
    this.port = port;

    this.app.use(errorMiddleware);
    this.app.listen(this.port, () => {
      console.log(`App started at port ${this.port}`);
    });
  }
}

export default App;

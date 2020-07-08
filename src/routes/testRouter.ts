import Router from "@packages/utils/Router";
import { Response } from "express";
import App from "app";

class testRouter extends Router {
  constructor() {
    super();

    this.router.get("/", this.getDate);
  }

  private getDate(_: any, res: Response) {
    res.json({
      time: new Date().getTime(),
    });
  }
}

App.registerRouter("/", new testRouter());

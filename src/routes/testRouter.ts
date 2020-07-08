import Router from "@packages/utils/Router";
import { Response, Request } from "express";
import App from "app";

class testRouter extends Router {
  constructor() {
    super();
    this.router.get("/", this.getDate.bind(this));
  }
  @Router.routes
  async getDate(req: Request, res: Response) {
    return {
      data: new Date().getDate(),
    };
  }
}

App.registerRouter("/", new testRouter());

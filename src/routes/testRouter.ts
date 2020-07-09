import Router from "@packages/utils/Router";
import { Response, Request } from "express";
import App from "app";

/*
  This is a example router.
  If you want to delete this file, Please remove import that pointing this file in 'routes/index.ts'.
*/
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

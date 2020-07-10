import Router from "@packages/utils/Router";
import App from "app";
import ModelRouter from "@packages/utils/ModelRouter";
import User, { UserDocument } from "models/User";

/*
  This is a example router.
  If you want to delete this file, Please remove import that pointing this file in 'routes/index.ts'.
*/
class testRouter extends Router {
  modelRouter: ModelRouter<UserDocument>;
  constructor() {
    super();

    this.modelRouter = new ModelRouter(User);
    this.router.post("/user", this.modelRouter.create());
  }
}

App.registerRouter("/", new testRouter());

# typescript-server-template

This is a template that combined with Typescript, Express, Mongoose, and many utils to use easlier this template.

## Getting Started

To start project from this template, use github template or run this command:

```
git clone -depth 1 https://github.com/kimdoyeong/typescript-server-template [Project name]
```

To run this command, you can start server.

```
npm run start:dev
yarn start:dev

# Watch mode
npm run start:watch
yarn start:watch
```

## Usage

To create new router, coding like this:

```typescript
import Router from "@packages/utils/Router";
import App from "app";
import { Request, Response } from "express";

class brandNewRouter extends Router {
  constructor() {
    super();

    this.router.get("/", this.getTime.bind(this));
  }

  @Router.routes
  async getTime(req: Request, res: Response) {
    return {
      status: 200,
      data: new Date().getTime(),
    };
  }
}

App.registerRouter("/", new brandNewRouter());
```

And import this file to `src/routes/index.ts`.

```typescript
import "./testRouter.ts";
```

`@Router.routes` Decorator can help you to make asyncnorized request handler. If you remove this decorator, Server can't catch and show you formatted error response.

`modelRouter` helps reduce your code to CRUD responses. Check out this code (`src/routes/testRouter.ts`)

```typescript
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
    this.router.get("/user", this.modelRouter.getMany());
    this.router.get(
      "/user/:username",
      this.modelRouter.getOne({
        conditions: (req) => ({ username: req.params.username }),
        projection: ["username"],
      })
    );
    this.router.post("/user", this.modelRouter.create());
    this.router.put(
      "/user/:username",
      this.modelRouter.update({
        conditions: (req) => ({ username: req.params.username }),
      })
    );
    this.router.delete(
      "/user/:username",
      this.modelRouter.delete({
        conditions: (req) => ({ username: req.params.username }),
      })
    );
  }
}

App.registerRouter("/", new testRouter());
```

# Issues

Have a issue? Please report me via github issue tracker or `hello@doyeong.dev`. It will be welcomed to report me a issue like bugs, syntax error, or fix my poor english expression and pull request.

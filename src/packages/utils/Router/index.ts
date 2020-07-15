import express, { Request, Response, NextFunction } from "express";
import RouterReturnType from "./RouterReturnType";

class Router {
  public router = express.Router();

  public static routes<T extends RequestHandler>(
    target: any,
    key: string,
    descriptor: TypedPropertyDescriptor<T>
  ) {
    const requestHandler = descriptor.value;
    if (!requestHandler) return;

    (descriptor.value as any) = Router.createRequestHandler(requestHandler.bind(target));
  }
  public static createRequestHandler(
    handler: (req: Request, res: Response, next: NextFunction) => any
  ) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await Promise.resolve(handler(req, res, next));
        data.status && res.status(data.status);
        res.json(data.data || { success: true });
      } catch (e) {
        next(e);
      }
    };
  }
}

type RequestHandler = (req: Request, res: Response, next?: NextFunction) => any;

export default Router;

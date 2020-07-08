import express, { Request, Response, NextFunction } from "express";
import RouterReturnType from "./RouterReturnType";

class Router {
  public router = express.Router();

  public static routes<T extends RequestHandler>(
    target: Router,
    key: string,
    descriptor: TypedPropertyDescriptor<T>
  ) {
    const requestHandler = descriptor.value;
    if (!requestHandler) return;

    (descriptor.value as any) = (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      requestHandler(req, res, next)
        .then((data: RouterReturnType | any) => {
          data.status && res.status(data.status);
          res.json(data.data || { success: true });
        })
        .catch((e) => {
          next(e);
        });
    };
  }
}

type RequestHandler = (
  req: Request,
  res: Response,
  next?: NextFunction
) => Promise<RouterReturnType | any>;

export default Router;

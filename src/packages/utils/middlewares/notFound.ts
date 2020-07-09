import { RequestHandler } from "express";
import { ActionNotFoundError } from "@packages/error/NotFoundError";

const notFoundMiddleware: RequestHandler = (req, res, next) => {
  next(ActionNotFoundError);
};

export default notFoundMiddleware;

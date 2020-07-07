import { ErrorRequestHandler } from "express";
import { ServerError } from "@packages/error";
import { InternalServerError } from "@packages/error/Internal";

const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  const error = err instanceof ServerError ? err : InternalServerError;

  res.status(error.getStatus()).json(error.getResponse());
};

export default errorMiddleware;

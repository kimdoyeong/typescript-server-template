import { ErrorRequestHandler } from "express";
import { InternalServerError } from "@packages/error/Internal";
import Logger from "../logger";

const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  const error = err.status && err.code ? err : InternalServerError;

  if (!err.status && !err.code) Logger.error(err);
  res.status(error.status).json({
    message: error.message,
    code: error.code,
    status: error.status,
  });
};

export default errorMiddleware;

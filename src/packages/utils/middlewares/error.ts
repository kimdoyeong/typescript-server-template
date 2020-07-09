import { ErrorRequestHandler } from "express";
import { InternalServerError } from "@packages/error/Internal";

const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  const error = err.status && err.code ? err : InternalServerError;
  res.status(error.status).json({
    message: error.message,
    code: error.code,
    status: error.status,
  });
};

export default errorMiddleware;

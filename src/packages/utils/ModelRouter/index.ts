import {
  Model,
  Document,
  MongooseFilterQuery,
  CreateQuery,
  Mongoose,
  MongooseUpdateQuery,
} from "mongoose";
import { Request, Response, RequestHandler } from "express";
import { ServerError } from "@packages/error";
import Router from "../Router";
import Logger from "../logger";

class ModelRouter<T extends Document> {
  private model: Model<T>;
  private modelName: string;

  private NotFoundError: ServerError;

  constructor(model: Model<T>, modelName?: string) {
    this.model = model;
    this.modelName = modelName || this.model.modelName;
    this.NotFoundError = new ServerError(
      404,
      "DATA_NOT_FOUND",
      "데이터를 찾을 수 없습니다."
    );
  }
  getOne({
    conditions,
    projection,
    onResponse,
    NotFoundError,
  }: Partial<GetOptions<T>> = {}) {
    return Router.createRequestHandler(async (req, res) => {
      const data = await this.model.findOne(
        conditions && conditions(req),
        projection
      );
      if (!data) throw NotFoundError || this.NotFoundError;
      const response = onResponse ? onResponse(data) : data.toObject();

      return {
        data: response,
      };
    });
  }
  create({
    setCreateQuery,
    queryValidate,
    onResponse,
    onError,
  }: Partial<CreateOptions<T>> = {}) {
    return Router.createRequestHandler(async (req, res) => {
      const createQuery = setCreateQuery
        ? setCreateQuery(req)
        : req.method.toLowerCase() !== "get"
        ? req.body
        : req.query;
      try {
        queryValidate && queryValidate(createQuery);
        const data = await this.model.create(createQuery);
        const response = onResponse ? onResponse(data) : { success: true };

        return {
          status: 201,
          data: response,
        };
      } catch (e) {
        if (onError) onError(e);
        else this.handleError(e);
      }
    });
  }
  getMany({
    conditions,
    projection,
    onError,
    onResponse,
  }: Partial<GetManyOptions<T>> = {}) {
    return Router.createRequestHandler(async (req, res) => {
      try {
        const data = await this.model.find(
          (conditions && conditions(req)) || {},
          projection
        );
        const response = onResponse ? onResponse(data) : data;

        return {
          status: 200,
          data: response,
        };
      } catch (e) {
        if (onError) onError(e);
        else this.handleError(e);
      }
    });
  }
  update({
    conditions,
    queryValidate,
    onResponse,
    onError,
    setUpdateQuery,
    mode = "one",
  }: Partial<UpdateOptions<T>> = {}) {
    return Router.createRequestHandler(async (req, res) => {
      try {
        const query = setUpdateQuery
          ? setUpdateQuery(req)
          : req.method.toLowerCase() !== "get"
          ? req.body
          : req.query;
        queryValidate && queryValidate(query);

        const condition = (conditions && conditions(req)) || {};
        const data = await this.model[mode === "one" ? "updateOne" : "update"](
          condition,
          query
        );
        const response = onResponse ? onResponse(data) : { success: true };

        return {
          status: 200,
          data: response,
        };
      } catch (e) {
        if (onError) onError(e);
        else this.handleError(e);
      }
    });
  }
  delete({
    conditions,
    onResponse,
    onError,
    mode = "one",
  }: Partial<DeleteOptions<T>> = {}) {
    return Router.createRequestHandler(async (req, res) => {
      try {
        const condition = (conditions && conditions(req)) || {};
        const data = await this.model[
          mode === "one" ? "deleteOne" : "deleteMany"
        ](condition);
        const response = (onResponse && onResponse(data)) || { success: true };

        return {
          status: 200,
          data: response,
        };
      } catch (e) {
        if (onError) onError(e);
        else this.handleError(e);
      }
    });
  }
  private handleError(e: any) {
    Logger.error(e);
    if (e.name === "ValidationError") {
      const messages = Object.entries(e.errors)
        .map(([key, value]: [string, any]) =>
          value.kind === "required"
            ? `${key} 필드가 필요합니다.`
            : `${key}의 검증에 실패했습니다.`
        )
        .join("\n");

      throw new ServerError(400, "VALIDATION_ERROR", messages);
    }
    if (e.name === "MongoError" && e.code === 11000) {
      const keys = Object.keys(e.keyValue);

      throw new ServerError(
        409,
        "CONFLICT",
        `이미 존재하는 ${keys.join(", ")}입니다.`
      );
    }
    throw e;
  }
}

interface Options<T extends Document> {
  onResponse(data: T | T[]): object;
  onError(error: any): void;
}
interface GetOptions<T extends Document> extends Options<T> {
  conditions(req: Request): MongooseFilterQuery<T>;
  projection: any;
  NotFoundError: ServerError;
}
interface GetManyOptions<T extends Document> extends Options<T> {
  conditions(req: Request): MongooseFilterQuery<T>;
  projection: any;
}
interface CreateOptions<T extends Document> extends Options<T> {
  setCreateQuery(req: Request): CreateQuery<T> | CreateQuery<T>[];
  queryValidate(query: CreateQuery<T> | CreateQuery<T>[]): void;
}
interface UpdateOptions<T extends Document> extends Options<T> {
  conditions(req: Request): MongooseFilterQuery<T>;
  setUpdateQuery(req: Request): MongooseUpdateQuery<T>;
  queryValidate(query: MongooseUpdateQuery<T>): void;
  mode: "one" | "many";
}
interface DeleteOptions<T extends Document> {
  conditions: (req: Request) => MongooseFilterQuery<T>;
  mode: "one" | "many";
  onError(error: any): void;
  onResponse(
    data: {
      ok?: number | undefined;
      n?: number | undefined;
    } & {
      deletedCount?: number | undefined;
    }
  ): object;
}
export default ModelRouter;

import { Model, Document, MongooseFilterQuery, CreateQuery } from "mongoose";
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
      const data = await this.model.findOne(conditions, projection);
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
    throw e;
  }
}

interface Options<T extends Document> {
  onResponse(data: T): object;
  onError(error: any): void;
}
interface GetOptions<T extends Document> extends Options<T> {
  conditions: MongooseFilterQuery<T>;
  projection: any;
  NotFoundError: ServerError;
}
interface CreateOptions<T extends Document> extends Options<T> {
  setCreateQuery(req: Request): CreateQuery<T> | CreateQuery<T>[];
  queryValidate(query: CreateQuery<T> | CreateQuery<T>[]): void;
}
export default ModelRouter;

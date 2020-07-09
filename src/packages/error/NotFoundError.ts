import ServerError from "./ServerError";

export const ActionNotFoundError = new ServerError(
  404,
  "ACTION_NOT_FOUND",
  "액션을 찾을 수 없습니다."
);

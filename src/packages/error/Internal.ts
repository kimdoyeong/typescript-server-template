import ServerError from "./ServerError";

export const InternalServerError = new ServerError(
  500,
  "INTERNAL_SERVER",
  "서버에서 오류가 발생했습니다."
);

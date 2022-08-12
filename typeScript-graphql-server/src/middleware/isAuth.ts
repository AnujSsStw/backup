import { Context } from "../utils/types";
import { MiddlewareFn } from "type-graphql";

export const isAuth: MiddlewareFn<Context> = ({ context }, next) => {
  if (!context.req.session.userId) {
    throw new Error("Not authenticated");
  }
  return next();
};

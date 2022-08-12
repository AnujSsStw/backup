import Redis from "ioredis";
import { v4 } from "uuid";

export const createConfirmEmailUrl = async (
  baseUrl: string, // http://sometjlaj
  userId: string,
  redis: Redis
) => {
  const token = v4();
  await redis!.set("confirm-email" + token, userId, "EX", 1000 * 60 * 60 * 24);
  return `${baseUrl}/confirmEmail/${token}`;
};

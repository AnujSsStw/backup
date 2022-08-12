import { Request, Response } from "express";
import Redis from "ioredis";

declare module "express-session" {
  export interface Session {
    userId: string;
  }
}

export type Context = {
  Redis: Redis;
  req: Request;
  res?: Response;
};

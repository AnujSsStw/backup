import "dotenv/config";
import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/user";
import { AppDataSource } from "./data-source";
import cookieParser from "cookie-parser";
import { verify } from "jsonwebtoken";
import { User } from "./entity/User";
import { createAccessToken, createRefreshToken } from "./auth";
import { setRefreshTokenCookies } from "./setRefreshTokenCookies";
import cors from "cors";

const main = async () => {
  await AppDataSource.initialize();

  const app = express();
  app.set("trust proxy", true);
  app.use(
    cors({
      credentials: true,
      origin: ["https://studio.apollographql.com", "http://localhost:5173"],
    })
  );
  app.use(cookieParser());

  app.get("/", (_req, res) => res.send("hola"));

  app.post("/refresh_token", async (req, res) => {
    const token = req.cookies.jwt;
    if (!token) {
      return res.send({
        ok: false,
        accessToken: "",
      });
    }

    let payload: any = null;
    try {
      payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
    } catch (err) {
      return res.send({
        ok: false,
        accessToken: "dumb ass",
      });
    }

    const user = await User.findOne({
      where: {
        id: payload.userId,
      },
    });

    setRefreshTokenCookies(res, createRefreshToken(user!));
    console.log(req.cookies);

    return res.send({ ok: true, accessToken: createAccessToken(user!) });
  });

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver],
    }),
    context: ({ req, res }) => ({ req, res }),
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(4000, () => {
    console.log("express server started...");
  });
};

main().catch(console.error);

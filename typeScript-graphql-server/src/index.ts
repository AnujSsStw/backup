import { ApolloServer } from "apollo-server-express";
import express from "express";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { AppDataSource } from "./data-source";
import { HelloResolver } from "./resolvers/hello";
import { UserResolver } from "./resolvers/user";
import { Context } from "./utils/types";
import { confirmEmailRoute } from "./utils/Mail";
import { redis } from "./redis";
import session from "express-session";
import connectRedis from "connect-redis";
import { redisSessPrefix } from "./constant";
// import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";

const Main = async () => {
  await AppDataSource.initialize();
  console.log("Database is connected");

  const app = express();
  app.set("trust proxy", true);

  const Redis = redis;

  const RedisStore = connectRedis(session);
  const SESSION_SECRET = "lsdfjlkjlkewaqra";
  app.use(
    session({
      store: new RedisStore({ client: Redis, prefix: redisSessPrefix }),
      name: "ara-ara",
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        sameSite: "lax",
      },
    })
  );

  //confirmed email route
  app.get("/confirmEmail/:id", confirmEmailRoute);

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): Context => ({ Redis, req, res }),
    // plugins: [ApolloServerPluginLandingPageGraphQLPlayground({})],
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({
    app,
    cors: {
      credentials: true,
      origin: ["https://studio.apollographql.com"],
    },
  });

  app.listen(4000, () => console.log("Listening on port 4000"));
};

Main().catch((err) => console.log(err));

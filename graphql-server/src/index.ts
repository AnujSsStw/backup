import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./data-source";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/user";

const Main = async () => {
  await AppDataSource.initialize();
  console.log("Connected to database");

  const app = express();
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver],
      validate: false,
    }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({
    app,
  });

  app.listen(4000, () => console.log("Listening on port 4000..."));
};

Main().catch((err) => console.log(err));

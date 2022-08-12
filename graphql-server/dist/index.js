"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const data_source_1 = require("./data-source");
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const user_1 = require("./resolvers/user");
const Main = async () => {
    await data_source_1.AppDataSource.initialize();
    console.log("Connected to database");
    const app = (0, express_1.default)();
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: await (0, type_graphql_1.buildSchema)({
            resolvers: [user_1.UserResolver],
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
//# sourceMappingURL=index.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const express_1 = __importDefault(require("express"));
require("reflect-metadata");
const type_graphql_1 = require("type-graphql");
const data_source_1 = require("./data-source");
const hello_1 = require("./resolvers/hello");
const user_1 = require("./resolvers/user");
const Mail_1 = require("./utils/Mail");
const redis_1 = require("./redis");
const express_session_1 = __importDefault(require("express-session"));
const connect_redis_1 = __importDefault(require("connect-redis"));
const constant_1 = require("./constant");
const Main = async () => {
    await data_source_1.AppDataSource.initialize();
    console.log("Database is connected");
    const app = (0, express_1.default)();
    app.set("trust proxy", true);
    const Redis = redis_1.redis;
    const RedisStore = (0, connect_redis_1.default)(express_session_1.default);
    const SESSION_SECRET = "lsdfjlkjlkewaqra";
    app.use((0, express_session_1.default)({
        store: new RedisStore({ client: Redis, prefix: constant_1.redisSessPrefix }),
        name: "ara-ara",
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false,
            maxAge: 1000 * 60 * 60 * 24 * 7,
            sameSite: "lax",
        },
    }));
    app.get("/confirmEmail/:id", Mail_1.confirmEmailRoute);
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: await (0, type_graphql_1.buildSchema)({
            resolvers: [hello_1.HelloResolver, user_1.UserResolver],
            validate: false,
        }),
        context: ({ req, res }) => ({ Redis, req, res }),
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
//# sourceMappingURL=index.js.map
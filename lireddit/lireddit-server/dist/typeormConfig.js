"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = void 0;
const typeorm_1 = require("typeorm");
const Post_1 = require("./entities/Post");
const User_1 = require("./entities/User");
const path_1 = __importDefault(require("path"));
exports.connection = new typeorm_1.DataSource({
    type: "postgres",
    username: "postgres",
    password: "6969",
    port: 5432,
    host: "localhost",
    database: "lireddit",
    entities: [Post_1.Posts, User_1.User],
    synchronize: true,
    migrations: [path_1.default.join(__dirname, "./migrations/*")],
    logging: true,
});
//# sourceMappingURL=typeormConfig.js.map
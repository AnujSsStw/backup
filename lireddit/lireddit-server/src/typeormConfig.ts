import { DataSource } from "typeorm";
import { Posts } from "./entities/Post";
import { User } from "./entities/User";
import path from "path";

export const connection = new DataSource({
  type: "postgres",
  username: "postgres",
  password: "6969",
  port: 5432,
  host: "localhost",
  database: "lireddit",
  entities: [Posts, User],
  synchronize: true,
  migrations: [path.join(__dirname, "./migrations/*")],
  logging: true,
});

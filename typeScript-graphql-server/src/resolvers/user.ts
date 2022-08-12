import { hash, verify } from "argon2";
import { isAuth } from "../middleware/isAuth";
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { User } from "../entity/User";
import { Mail } from "../utils/Mail";
import { createConfirmEmailUrl } from "../utils/createUrl";
import { Context } from "../utils/types";
import { UserInput, UserResponse } from "../utils/UserResponse";
import { validate } from "../utils/validator";
import { redisSessPrefix, userSessPrefix } from "../constant";
import { v4 } from "uuid";

@Resolver()
export class UserResolver {
  @Query(() => [User])
  async listofUser() {
    return await User.find();
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: Context) {
    if (!req.session.userId) {
      return null;
    }
    return await User.findOne({ where: { id: req.session.userId } });
  }

  // middleware check example
  @UseMiddleware(isAuth)
  @Query(() => User, { nullable: true })
  async checking(@Ctx() { req }: Context) {
    if (!req.session.userId) {
      return null;
    }
    return await User.findOne({ where: { id: req.session.userId } });
  }

  @Mutation(() => UserResponse)
  async registerUser(
    @Arg("RegisterInput") RegisterInput: UserInput,
    @Ctx() { Redis, req }: Context
  ): Promise<UserResponse> {
    const error = validate(RegisterInput);
    if (error) {
      return { error };
    }

    /**
     * * Can do this way too
     */
    // const check = await User.findOne({
    //   where: {
    //     email: RegisterInput.email,
    //     userName: RegisterInput.userName,
    //   },
    // });

    // if (check) {
    //   return {
    //     error: [
    //       {
    //         field: "user",
    //         message: "user already exists",
    //       },
    //     ],
    //   };
    // }

    // everthing is valid
    const hashedPassword = await hash(RegisterInput.password);

    // flush into db
    const user = User.create({
      email: RegisterInput.email,
      password: hashedPassword,
      userName: RegisterInput.userName,
    });

    try {
      await user.save();

      // confirm email
      const baseUrl = req!.protocol + "://" + req!.get("host");
      const confireUrl = await createConfirmEmailUrl(baseUrl, user.id, Redis);

      await Mail(RegisterInput.email, `<a href=${confireUrl}>confirmEmail</a>`);
    } catch (err) {
      if (err.detail.includes(`Key ("userName")=(nulll) already exists`)) {
        return {
          error: [
            {
              field: "userName",
              message: "User name already exists",
            },
          ],
        };
      }

      if (err.code === "23505") {
        // same error code for username and email
        return {
          error: [
            {
              field: "email",
              message: "email already taken",
            },
          ],
        };
      }
    }

    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("EmailORuserName") EmailORuserName: string,
    @Arg("password") password: string,
    @Ctx() { req, Redis }: Context
  ): Promise<UserResponse> {
    const user = await User.findOne({
      where: EmailORuserName.includes("@")
        ? { email: EmailORuserName }
        : { userName: EmailORuserName },
    });

    if (!user) {
      return {
        error: [
          {
            field: "EmailORuserName",
            message: "email or userName dosen't exists",
          },
        ],
      };
    }

    const verifing = await verify(user.password, password);
    if (!verifing) {
      return {
        error: [
          {
            field: "password",
            message: "wrong password",
          },
        ],
      };
    }

    // login successfull
    req.session.userId = user.id;

    await Redis.lpush(`${userSessPrefix}${user.id}`, req.sessionID);

    return { user };
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Boolean)
  async logoutAll(@Ctx() { req, Redis }: Context) {
    const { userId } = req.session;
    if (userId) {
      const seeId = await Redis.lrange(`${userSessPrefix}${userId}`, 0, -1);

      const all = [];
      for (let i = 0; i < seeId.length; i++) {
        all.push(Redis.del(`${redisSessPrefix}${seeId[i]}`));
      }

      await Promise.all(all);

      return true;
    }
    return false;
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Boolean)
  async logoutOne(@Ctx() { req, res }: Context) {
    return new Promise((resolve) => {
      req.session.destroy((err) => {
        res?.clearCookie("ara-ara");
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }
        resolve(true);
      });
    });
  }

  @Mutation(() => Boolean)
  async forgetPassword(
    @Arg("EmailORuserName") EmailORuserName: string,
    @Ctx() { Redis }: Context
  ) {
    const user = await User.findOne({
      where: EmailORuserName.includes("@")
        ? { email: EmailORuserName }
        : { userName: EmailORuserName },
    });

    if (!user) {
      return false;
    }

    const token = v4();
    Redis.set("forgotPassword" + token, user.id, "EX", 60 * 20);

    const url = `http://localhost:3000/reset-password/${token}`;
    await Mail(user.email, `<a href=${url}>reset password</a>`);
    return true;
  }

  @Mutation(() => Boolean)
  async resetPassword(
    @Arg("newPassword") newPassword: string,
    @Ctx() { Redis, req }: Context,
    @Arg("token") token: string
  ): Promise<UserResponse> {
    const userId = await Redis.get("forgotPassword" + token);
    if (!userId) {
      return {
        error: [
          {
            field: "token",
            message: "token expires",
          },
        ],
      };
    }

    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return {
        error: [
          {
            field: "user",
            message: "user no long exists",
          },
        ],
      };
    }
    if (newPassword.length <= 2) {
      return {
        error: [
          {
            field: "password",
            message: "password must be at least 3 characters long",
          },
        ],
      };
    }

    const UpdatedPassword = await hash(newPassword);
    await User.update({ id: user.id }, { password: UpdatedPassword });

    req.session.userId = user.id;

    await Redis.del("forgotPassword" + token);

    return { user };
  }
}

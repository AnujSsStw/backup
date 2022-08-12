import { setRefreshTokenCookies } from "./../setRefreshTokenCookies";
import { User } from "../entity/User";
import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { hash, verify } from "argon2";
import { MyContext } from "../Context.interface";
import { createAccessToken, createRefreshToken } from "../auth";
import { isAuth } from "../isAuth";

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
}

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return "hello fuck you";
  }

  @Query(() => String)
  // checks if user is logged in
  @UseMiddleware(isAuth)
  me(@Ctx() { payload }: MyContext) {
    return `here is userId ${payload?.userId}`;
  }

  @Query(() => [User])
  allUsers() {
    return User.find();
  }

  @Mutation(() => LoginResponse)
  async Login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { res }: MyContext
  ): Promise<LoginResponse> {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error("not a valid email");
    }

    const validPassword = await verify(user.password, password);
    if (!validPassword) {
      throw new Error("Wrong Password");
    }

    // login successful

    // create a cookie of refresh token so that when the access token expires it validates for new access token request
    setRefreshTokenCookies(res, createRefreshToken(user));

    return {
      accessToken: createAccessToken(user),
    };
  }

  @Mutation(() => Boolean)
  async createAccount(
    @Arg("email") email: string,
    @Arg("password") password: string
  ) {
    const hashPassword = await hash(password);

    try {
      await User.insert({
        email,
        password: hashPassword,
      });
    } catch (err) {
      console.log(err);
      return false;
    }

    return true;
  }
}

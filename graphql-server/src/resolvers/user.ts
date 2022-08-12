import argon2 from "argon2";
import { User } from "../entity/User";
import { createAccountInput } from "../utils/inputs";
import { Validator } from "../utils/validator";
import {
  Arg,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";

@ObjectType()
class UserResponse {
  @Field(() => [RelatedFieldError], { nullable: true })
  error?: RelatedFieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@ObjectType()
class RelatedFieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  async createAccount(
    @Arg("createAccount") createAccountInput: createAccountInput
  ): Promise<UserResponse> {
    const email = createAccountInput.email;
    const password = createAccountInput.password;
    const validate = Validator({ email, password });

    if (!validate) {
    }
    console.log(validate);

    const hashedPassword = await argon2.hash(createAccountInput.password);

    const user = User.create({
      userName: createAccountInput.username,
      email: email,
      password: hashedPassword,
    });

    try {
      await user.save();
    } catch (err) {
      console.log(err);
    }

    return { user };
  }

  @Query(() => [User])
  listOfUser() {
    return User.find();
  }
}

import { User } from "../entity/User";
import { Field, InputType, ObjectType } from "type-graphql";

@ObjectType()
export class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  error?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@InputType()
export class UserInput {
  @Field()
  userName: string;
  @Field()
  email: string;
  @Field()
  password: string;
}

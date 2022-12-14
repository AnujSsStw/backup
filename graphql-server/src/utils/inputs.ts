import { Field, InputType } from "type-graphql";

@InputType()
export class createAccountInput {
  @Field()
  username?: string;

  @Field()
  email: string;

  @Field()
  password: string;
}

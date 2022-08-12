import { connection } from "../typeormConfig";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { Posts } from "../entities/Post";
import { isAuth } from "../middleware/isAuth";
import { Things } from "../types";

@InputType()
class postInput {
  @Field()
  title: string;

  @Field()
  discription: string;
}

@Resolver()
export class PostResolver {
  @Query(() => [Posts])
  async posts(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null
  ): Promise<Posts[]> {
    const realLimit = Math.min(50, limit);
    const Query = connection
      .getRepository(Posts)
      .createQueryBuilder("Pag")
      .orderBy('"createdAt"', "DESC")
      .take(realLimit);

    if (cursor) {
      Query.where('"createdAt" < :cursor', {
        cursor: new Date(parseInt(cursor)),
      });
    }
    return Query.getMany();
  }

  @Mutation(() => Posts)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg("input") input: postInput,
    @Ctx() { req }: Things
  ): Promise<Posts> {
    return await Posts.create({
      ...input,
      creatorId: req.session.userId,
    }).save();
  }

  @Mutation(() => Posts, { nullable: true })
  async updatePost(
    @Arg("id") id: number,
    @Arg("title") title: string
  ): Promise<Posts | null> {
    const post = await Posts.findOne({ where: { id } });
    if (!post) {
      return null;
    }
    if (typeof title !== "undefined") {
      await Posts.update({ id }, { title });
    }
    return Posts.findOne({ where: { id } });
  }

  @Mutation(() => Boolean)
  async deletePost(@Arg("id") id: number): Promise<Boolean> {
    await Posts.delete(id);
    return true;
  }
}

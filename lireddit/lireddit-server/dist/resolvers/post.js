"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostResolver = void 0;
const typeormConfig_1 = require("../typeormConfig");
const type_graphql_1 = require("type-graphql");
const Post_1 = require("../entities/Post");
const isAuth_1 = require("../middleware/isAuth");
let postInput = class postInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], postInput.prototype, "title", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], postInput.prototype, "discription", void 0);
postInput = __decorate([
    (0, type_graphql_1.InputType)()
], postInput);
let PostResolver = class PostResolver {
    async posts(limit, cursor) {
        const realLimit = Math.min(50, limit);
        const Query = typeormConfig_1.connection
            .getRepository(Post_1.Posts)
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
    async createPost(input, { req }) {
        return await Post_1.Posts.create(Object.assign(Object.assign({}, input), { creatorId: req.session.userId })).save();
    }
    async updatePost(id, title) {
        const post = await Post_1.Posts.findOne({ where: { id } });
        if (!post) {
            return null;
        }
        if (typeof title !== "undefined") {
            await Post_1.Posts.update({ id }, { title });
        }
        return Post_1.Posts.findOne({ where: { id } });
    }
    async deletePost(id) {
        await Post_1.Posts.delete(id);
        return true;
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [Post_1.Posts]),
    __param(0, (0, type_graphql_1.Arg)("limit", () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Arg)("cursor", () => String, { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "posts", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Post_1.Posts),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("input")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [postInput, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "createPost", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Post_1.Posts, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __param(1, (0, type_graphql_1.Arg)("title")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "updatePost", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "deletePost", null);
PostResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], PostResolver);
exports.PostResolver = PostResolver;
//# sourceMappingURL=post.js.map
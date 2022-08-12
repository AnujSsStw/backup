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
exports.UserResolver = void 0;
const argon2_1 = require("argon2");
const isAuth_1 = require("../middleware/isAuth");
const type_graphql_1 = require("type-graphql");
const User_1 = require("../entity/User");
const Mail_1 = require("../utils/Mail");
const createUrl_1 = require("../utils/createUrl");
const UserResponse_1 = require("../utils/UserResponse");
const validator_1 = require("../utils/validator");
const constant_1 = require("../constant");
const uuid_1 = require("uuid");
let UserResolver = class UserResolver {
    async listofUser() {
        return await User_1.User.find();
    }
    async me({ req }) {
        if (!req.session.userId) {
            return null;
        }
        return await User_1.User.findOne({ where: { id: req.session.userId } });
    }
    async checking({ req }) {
        if (!req.session.userId) {
            return null;
        }
        return await User_1.User.findOne({ where: { id: req.session.userId } });
    }
    async registerUser(RegisterInput, { Redis, req }) {
        const error = (0, validator_1.validate)(RegisterInput);
        if (error) {
            return { error };
        }
        const hashedPassword = await (0, argon2_1.hash)(RegisterInput.password);
        const user = User_1.User.create({
            email: RegisterInput.email,
            password: hashedPassword,
            userName: RegisterInput.userName,
        });
        try {
            await user.save();
            const baseUrl = req.protocol + "://" + req.get("host");
            const confireUrl = await (0, createUrl_1.createConfirmEmailUrl)(baseUrl, user.id, Redis);
            await (0, Mail_1.Mail)(RegisterInput.email, `<a href=${confireUrl}>confirmEmail</a>`);
        }
        catch (err) {
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
    async login(EmailORuserName, password, { req, Redis }) {
        const user = await User_1.User.findOne({
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
        const verifing = await (0, argon2_1.verify)(user.password, password);
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
        req.session.userId = user.id;
        await Redis.lpush(`${constant_1.userSessPrefix}${user.id}`, req.sessionID);
        return { user };
    }
    async logoutAll({ req, Redis }) {
        const { userId } = req.session;
        if (userId) {
            const seeId = await Redis.lrange(`${constant_1.userSessPrefix}${userId}`, 0, -1);
            const all = [];
            for (let i = 0; i < seeId.length; i++) {
                all.push(Redis.del(`${constant_1.redisSessPrefix}${seeId[i]}`));
            }
            await Promise.all(all);
            return true;
        }
        return false;
    }
    async logoutOne({ req, res }) {
        return new Promise((resolve) => {
            req.session.destroy((err) => {
                res === null || res === void 0 ? void 0 : res.clearCookie("ara-ara");
                if (err) {
                    console.log(err);
                    resolve(false);
                    return;
                }
                resolve(true);
            });
        });
    }
    async forgetPassword(EmailORuserName, { Redis }) {
        const user = await User_1.User.findOne({
            where: EmailORuserName.includes("@")
                ? { email: EmailORuserName }
                : { userName: EmailORuserName },
        });
        if (!user) {
            return false;
        }
        const token = (0, uuid_1.v4)();
        Redis.set("forgotPassword" + token, user.id, "EX", 60 * 20);
        const url = `http://localhost:3000/reset-password/${token}`;
        await (0, Mail_1.Mail)(user.email, `<a href=${url}>reset password</a>`);
        return true;
    }
    async resetPassword(newPassword, { Redis, req }, token) {
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
        const user = await User_1.User.findOne({ where: { id: userId } });
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
        const UpdatedPassword = await (0, argon2_1.hash)(newPassword);
        await User_1.User.update({ id: user.id }, { password: UpdatedPassword });
        req.session.userId = user.id;
        await Redis.del("forgotPassword" + token);
        return { user };
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [User_1.User]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "listofUser", null);
__decorate([
    (0, type_graphql_1.Query)(() => User_1.User, { nullable: true }),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "me", null);
__decorate([
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    (0, type_graphql_1.Query)(() => User_1.User, { nullable: true }),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "checking", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse_1.UserResponse),
    __param(0, (0, type_graphql_1.Arg)("RegisterInput")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserResponse_1.UserInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "registerUser", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse_1.UserResponse),
    __param(0, (0, type_graphql_1.Arg)("EmailORuserName")),
    __param(1, (0, type_graphql_1.Arg)("password")),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
__decorate([
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "logoutAll", null);
__decorate([
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "logoutOne", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("EmailORuserName")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "forgetPassword", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("newPassword")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __param(2, (0, type_graphql_1.Arg)("token")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "resetPassword", null);
UserResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=user.js.map
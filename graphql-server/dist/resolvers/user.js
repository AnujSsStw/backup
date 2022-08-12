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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = void 0;
const argon2_1 = __importDefault(require("argon2"));
const User_1 = require("../entity/User");
const inputs_1 = require("../utils/inputs");
const validator_1 = require("../utils/validator");
const type_graphql_1 = require("type-graphql");
let UserResponse = class UserResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [RelatedFieldError], { nullable: true }),
    __metadata("design:type", Array)
], UserResponse.prototype, "error", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => User_1.User, { nullable: true }),
    __metadata("design:type", User_1.User)
], UserResponse.prototype, "user", void 0);
UserResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], UserResponse);
let RelatedFieldError = class RelatedFieldError {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], RelatedFieldError.prototype, "field", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], RelatedFieldError.prototype, "message", void 0);
RelatedFieldError = __decorate([
    (0, type_graphql_1.ObjectType)()
], RelatedFieldError);
let UserResolver = class UserResolver {
    async createAccount(createAccountInput) {
        const email = createAccountInput.email;
        const password = createAccountInput.password;
        const validate = (0, validator_1.Validator)({ email, password });
        if (!validate) {
        }
        console.log(validate);
        const hashedPassword = await argon2_1.default.hash(createAccountInput.password);
        const user = User_1.User.create({
            userName: createAccountInput.username,
            email: email,
            password: hashedPassword,
        });
        try {
            await user.save();
        }
        catch (err) {
            console.log(err);
        }
        return { user };
    }
    listOfUser() {
        return User_1.User.find();
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse),
    __param(0, (0, type_graphql_1.Arg)("createAccount")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [inputs_1.createAccountInput]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "createAccount", null);
__decorate([
    (0, type_graphql_1.Query)(() => [User_1.User]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "listOfUser", null);
UserResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=user.js.map
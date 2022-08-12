"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validator = void 0;
const email_validator_1 = __importDefault(require("email-validator"));
const password_validator_1 = __importDefault(require("password-validator"));
const Validator = (inputs) => {
    const emailValidator = email_validator_1.default.validate(inputs.email);
    const schema = new password_validator_1.default();
    schema
        .is()
        .min(4)
        .is()
        .max(100)
        .is()
        .not()
        .oneOf(["Passw0rd", "Password123"]);
    const passwordValidator = schema.validate(inputs.password);
    const error = {
        emailValidator,
        passwordValidator,
    };
    return error;
};
exports.Validator = Validator;
//# sourceMappingURL=validator.js.map
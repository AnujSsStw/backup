"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const validate = (userInput) => {
    const email = userInput.email;
    const password = userInput.password;
    if (!email.includes("@")) {
        return [
            {
                field: "email",
                message: "invalid email",
            },
        ];
    }
    if (userInput.userName.length <= 2) {
        return [
            {
                field: "userName",
                message: "userName must be at least 3 characters long",
            },
        ];
    }
    if (userInput.userName.includes("@")) {
        return [
            {
                field: "userName",
                message: "cannot includes @",
            },
        ];
    }
    if (password.length <= 2) {
        return [
            {
                field: "password",
                message: "password must be at least 3 characters long",
            },
        ];
    }
    return null;
};
exports.validate = validate;
//# sourceMappingURL=validator.js.map
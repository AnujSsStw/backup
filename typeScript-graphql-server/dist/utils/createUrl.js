"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConfirmEmailUrl = void 0;
const uuid_1 = require("uuid");
const createConfirmEmailUrl = async (baseUrl, userId, redis) => {
    const token = (0, uuid_1.v4)();
    await redis.set("confirm-email" + token, userId, "EX", 1000 * 60 * 60 * 24);
    return `${baseUrl}/confirmEmail/${token}`;
};
exports.createConfirmEmailUrl = createConfirmEmailUrl;
//# sourceMappingURL=createUrl.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmEmailRoute = exports.Mail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const User_1 = require("../entity/User");
const redis_1 = require("../redis");
const Mail = async (to, link) => {
    let transporter = nodemailer_1.default.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: "mpjzpxmb57ridx6f@ethereal.email",
            pass: "nAwzFfuHhqvbWSVy5F",
        },
    });
    let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>',
        to: to,
        subject: "Hello ✔",
        text: "Hello world?",
        html: link,
    });
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer_1.default.getTestMessageUrl(info));
};
exports.Mail = Mail;
const confirmEmailRoute = async (req, res) => {
    const token = req.params.id;
    const userId = await redis_1.redis.get("confirm-email" + token);
    if (!userId) {
        res === null || res === void 0 ? void 0 : res.send("token expires");
        throw new Error("token expires");
    }
    const user = await User_1.User.findOne({
        where: {
            id: userId,
        },
    });
    if (!user) {
        res === null || res === void 0 ? void 0 : res.send("user no longer exists");
        throw new Error("user no longer exists");
    }
    await User_1.User.update({ id: userId }, { verified: true });
    await redis_1.redis.del("confirm-email" + token);
    res.redirect("/");
};
exports.confirmEmailRoute = confirmEmailRoute;
//# sourceMappingURL=Mail.js.map
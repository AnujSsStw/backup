"use strict";
import nodemailer from "nodemailer";
import { Request, Response } from "express";
import { User } from "../entity/User";
import { redis } from "../redis";

// async..await is not allowed in global scope, must use a wrapper
export const Mail = async (to: string, link: string) => {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  //   let testAccount = await nodemailer.createTestAccount();
  //   console.log(testAccount);

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "mpjzpxmb57ridx6f@ethereal.email", // generated ethereal user
      pass: "nAwzFfuHhqvbWSVy5F", // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: to, // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: link, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
};

export const confirmEmailRoute = async (req: Request, res: Response) => {
  const token = req.params.id;
  const userId = await redis.get("confirm-email" + token);

  if (!userId) {
    res?.send("token expires");
    throw new Error("token expires");
  }

  const user = await User.findOne({
    where: {
      id: userId,
    },
  });

  if (!user) {
    res?.send("user no longer exists");
    throw new Error("user no longer exists");
  }

  await User.update({ id: userId }, { verified: true });
  await redis.del("confirm-email" + token);

  //can Re - route back to site
  res.redirect("/");
};

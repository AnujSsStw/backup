import { Response } from "express";

export const setRefreshTokenCookies = (res: Response, token: any) => {
  res.cookie("jwt", token, {
    httpOnly: true, // client side js can't access cookie
    secure: false, // cookie only works over https
    sameSite: "lax", // cookie can be sent with cross-origin requests (like from a different domain)
  });
};

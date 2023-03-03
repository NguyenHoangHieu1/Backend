import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import requestTweak from "../interfaces/request";

const isAuth: RequestHandler = (req: requestTweak, res, next) => {
  const token = req.get("authorization");
  if (!token) {
    return next();
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "reallysecret");
  } catch (error: any) {
    error.message = "Something technically went wrong";
    error.status = 500;
    throw error;
  }
  req.userId = (<any>decodedToken).userId;
  next();
};

export default isAuth;

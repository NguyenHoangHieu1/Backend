import { Request } from "express";

export default interface RequestTweak extends Request {
  userId?: string;
}

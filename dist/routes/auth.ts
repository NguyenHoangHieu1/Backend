import { Router } from "express";
import {
  postActivate,
  postChangePassword,
  postCheckAccount,
  postForgotPassword,
  postLogin,
  postSignup,
} from "../controllers/auth";
import { body } from "express-validator";

const authRoute = Router();

authRoute.post("/check-account", postCheckAccount);
authRoute.post("/activate", postActivate);
authRoute.post("/login", postLogin);
authRoute.post("/forgot-password", postForgotPassword);
authRoute.post("/change-password", postChangePassword);
authRoute.post(
  "/signup",
  [
    body("email", "Please Enter the right format of the email").isEmail(),
    body("username", "Please enter your username").isLength({ min: 5 }),
    body(
      "password",
      "Please enter your password a little bit stronger"
    ).isStrongPassword(),
  ],
  postSignup
);

export default authRoute;

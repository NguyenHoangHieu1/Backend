"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../controllers/auth");
const express_validator_1 = require("express-validator");
const authRoute = (0, express_1.Router)();
authRoute.post("/check-account", auth_1.postCheckAccount);
authRoute.post("/activate", auth_1.postActivate);
authRoute.post("/login", auth_1.postLogin);
authRoute.post("/forgot-password", auth_1.postForgotPassword);
authRoute.post("/change-password", auth_1.postChangePassword);
authRoute.post("/signup", [
    (0, express_validator_1.body)("email", "Please Enter the right format of the email").isEmail(),
    (0, express_validator_1.body)("username", "Please enter your username").isLength({ min: 5 }),
    (0, express_validator_1.body)("password", "Please enter your password a little bit stronger").isStrongPassword(),
], auth_1.postSignup);
exports.default = authRoute;

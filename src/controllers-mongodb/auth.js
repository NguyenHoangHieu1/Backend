"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postChangePassword = exports.postForgotPassword = exports.postActivate = exports.postSignup = exports.postLogin = exports.postCheckAccount = void 0;
const bcryptjs_1 = require("bcryptjs");
const user_1 = __importDefault(require("../models-mongodb/user"));
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const userMail = "hoanghieufro@gmail.com";
const passMail = "sxucbgjzbburuiig";
const transport = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: userMail,
        pass: passMail,
    },
});
const postCheckAccount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.body.token;
    try {
        const user = yield user_1.default.findOne({ token: token });
        if (!user) {
            return res.status(301).json({ message: "No Account found" });
        }
        return res
            .status(202)
            .json({ message: "Account found", userId: user._id.toString() });
    }
    catch (error) {
        if (!error.status) {
            error.status = 500;
        }
        next(error);
    }
});
exports.postCheckAccount = postCheckAccount;
const postLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const user = yield user_1.default.findOne({ email: email });
        if (!user) {
            return res.status(406).json({ message: "Account doesn't exist" });
        }
        const doMatch = yield (0, bcryptjs_1.compare)(password, user.password);
        if (!doMatch) {
            return res.status(406).json({ message: "Wrong information" });
        }
        if (user.token) {
            return res
                .status(406)
                .json({ message: "You haven't activated the account!" });
        }
        const token = jsonwebtoken_1.default.sign({
            email: email,
            userId: user._id.toString(),
        }, "reallysecret", { expiresIn: "1h" });
        return res.status(200).json({
            message: "Login successfully",
            token: token,
            userId: user._id.toString(),
            validAcc: user.token ? false : true,
        });
    }
    catch (error) {
        if (!error.status) {
            error.status = 500;
        }
        next(error);
    }
});
exports.postLogin = postLogin;
const postSignup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const validationCheck = (0, express_validator_1.validationResult)(req);
    if (!validationCheck.isEmpty()) {
        return res.status(400).json({ message: validationCheck.array()[0].msg });
    }
    crypto_1.default.randomBytes(32, (err, buffer) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return res.status(500).json({ message: "Something gone wrong" });
        }
        const token = buffer.toString("hex");
        try {
            const user = yield user_1.default.findOne({ email: email });
            if (user) {
                return res.status(400).json({ message: "The Account already exist" });
            }
            const hashedPassword = yield (0, bcryptjs_1.hash)(password, 12);
            yield user_1.default.create({
                email: email,
                username: username,
                password: hashedPassword,
                cart: {
                    cartItems: [],
                    totalQuantity: 0,
                    totalPrice: 0,
                },
                token: token,
                tokenExp: new Date().getTime() + 36000,
            });
            transport.sendMail({
                from: userMail,
                to: email,
                subject: "Register successfully",
                html: `
      <h1>Thank you so much for registering our services</h1>
      <p>Here is your passcode: ${token}</p>
      <p>Click <a href="http://localhost:3000/activate-password/${token}">here</a> to be able to enter your passcode </p>
      `,
            });
            return res.status(201).json({ message: "Created Successfully" });
        }
        catch (err) {
            if (!err.status) {
                err.status = 500;
            }
            next(err);
        }
    }));
});
exports.postSignup = postSignup;
const postActivate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.body.passCode;
    try {
        const user = yield user_1.default.findOne({ token: token });
        if (!user) {
            return res.status(406).json({ message: "Wrong Pass code" });
        }
        user.token = undefined;
        user.tokenExp = undefined;
        yield user.save();
        return res
            .status(201)
            .json({ message: "Activate the Account Successfully" });
    }
    catch (error) {
        if (!error.status) {
            error.status = 500;
        }
        next(error);
    }
});
exports.postActivate = postActivate;
const postForgotPassword = (req, res, next) => {
    const email = req.body.email;
    crypto_1.default.randomBytes(32, (err, buffer) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return res
                .status(500)
                .json({ message: "Something is wrong with the server" });
        }
        const token = buffer.toString("hex");
        const user = yield user_1.default.findOne({ email: email });
        if (!user) {
            return res.status(406).json({ message: "Account not found" });
        }
        else if (user.token) {
            return res.status(406).json({
                message: "This account already has the token to do something else!",
            });
        }
        user.token = token;
        user.tokenExp = new Date();
        yield user.save();
        transport.sendMail({
            from: userMail,
            to: email,
            subject: "Forgetting your password",
            html: `
    <h1>We've heard that you have forgotten your password, Want to change your password ?</h1> 
    <p>Click on this <a href="http://localhost:3000/change-password/${token}">link</a> here to be able to change the password</p>
    `,
        });
        res.status(202).json({ message: "Sent an email to your gmail!" });
    }));
};
exports.postForgotPassword = postForgotPassword;
const postChangePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const newPassword = req.body.password;
    const token = req.body.token;
    const user = yield user_1.default.findOne({ token: token });
    if (!user) {
        return res.status(406).json({ message: "Account not found" });
    }
    const hashedPassword = yield (0, bcryptjs_1.hash)(newPassword, 12);
    user.password = hashedPassword;
    user.token = undefined;
    user.tokenExp = undefined;
    yield user.save();
    return res.status(200).json({ message: "Changed Password successfully" });
});
exports.postChangePassword = postChangePassword;

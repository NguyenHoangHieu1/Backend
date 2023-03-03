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
exports.postSignup = exports.postLogin = exports.postForgotPassword = exports.postCheckAccount = exports.postChangePassword = exports.postActivate = void 0;
const user_1 = __importDefault(require("../models/user"));
const bcryptjs_1 = require("bcryptjs");
const express_validator_1 = require("express-validator");
const nodemailer_1 = __importDefault(require("nodemailer"));
const crypto_1 = __importDefault(require("crypto"));
const tokenDb_1 = __importDefault(require("../services/tokenDb"));
const userDb_1 = __importDefault(require("../services/userDb"));
const tokenDb_2 = __importDefault(require("../services/tokenDb"));
const cartDb_1 = __importDefault(require("../services/cartDb"));
const worker_threads_1 = require("worker_threads");
const userMail = "hoanghieufro@gmail.com";
const passMail = "faslrrtkbtxnjdtd";
const transport = nodemailer_1.default.createTransport({
    service: "Gmail",
    auth: {
        user: userMail,
        pass: passMail,
    },
});
const postActivate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const passCode = req.body.passCode;
    const token = req.body.token;
    try {
        const tokenList = (yield tokenDb_2.default.findByToken(token));
        if (tokenList.length <= 0) {
            return res.status(404).json({ message: "No Token found" });
        }
        const aToken = tokenList[0];
        if (aToken.activateNumber.toString() === passCode.toString()) {
            yield cartDb_1.default.create(aToken.userId);
            tokenDb_2.default.removeByToken(aToken.token);
            return res.status(200).json({ message: "Accept account successfully" });
        }
        else {
            return res.status(402).json({ message: "Wrong passcode" });
        }
    }
    catch (error) {
        if (!error.status) {
            error.status = 500;
        }
        next(error);
    }
});
exports.postActivate = postActivate;
const postChangePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const password = req.body.password;
    const token = req.body.token;
    try {
        const tokenList = (yield tokenDb_1.default.findByToken(token));
        if (tokenList.length <= 0) {
            return res.status(404).json({ message: "Token not found" });
        }
        const tokenResult = tokenList[0];
        const userList = (yield userDb_1.default.findById(tokenResult.userId));
        if (userList.length <= 0) {
            return res.status(404).json({ message: "Account not found" });
        }
        const userItem = userList[0];
        const aUser = new user_1.default(userItem.email, userItem.password, userItem.username, userItem.user_id);
        yield tokenDb_1.default.removeByToken(token);
        const newHashedPassword = yield (0, bcryptjs_1.hash)(password, 12);
        userDb_1.default.saveOne(aUser.getUser_id, "password", newHashedPassword);
        return res.status(200).json({ message: "Change password successfully" });
    }
    catch (error) {
        if (error.status)
            error.status = 500;
        next(error);
    }
});
exports.postChangePassword = postChangePassword;
const postCheckAccount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.body.token;
    try {
        const tokenList = (yield tokenDb_1.default.findByToken(token));
        if (tokenList.length <= 0) {
            return res.status(404).json({ message: "Token not found" });
        }
        const tokenObj = tokenList[0];
        return res
            .status(200)
            .json({ message: "Account found", userId: tokenObj.userId });
    }
    catch (error) {
        if (!error.status)
            error.status = 500;
        next(error);
    }
});
exports.postCheckAccount = postCheckAccount;
const postForgotPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    try {
        const userList = (yield userDb_1.default.findByEmail(email));
        if (userList.length <= 0) {
            return res.status(404).json({ message: "Account not found" });
        }
        const userItem = userList[0];
        const aUser = new user_1.default(userItem.email, userItem.password, userItem.username, userItem.user_id);
        crypto_1.default.randomBytes(32, (err, Buffer) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                next(err);
            }
            const token = Buffer.toString("hex");
            yield tokenDb_1.default.create(token, aUser.getUser_id);
            transport.sendMail({
                from: userMail,
                to: aUser.getEmail,
                subject: "Forgot your password already ? ",
                html: `
        <h1>Click this <a href="http://localhost:3000/change-password/${token}">link</a> to reset the password </h1> 
        `,
            });
            return res.status(200).json({ message: "I Have Sent you an email" });
        }));
    }
    catch (error) {
        if (error.status)
            error.status = 500;
        next(error);
    }
});
exports.postForgotPassword = postForgotPassword;
const postLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const userList = (yield userDb_1.default.findByEmail(email));
        if (userList.length <= 0) {
            return res.status(404).json({ message: "Account not found" });
        }
        const userItem = userList[0];
        const aUser = new user_1.default(userItem.email, userItem.password, userItem.username, userItem.user_id);
        const tokenList = (yield tokenDb_1.default.findByUserId(aUser.getUser_id));
        if (tokenList.length > 0) {
            return res
                .status(404)
                .json({ message: "You haven't activated the account" });
        }
        const doMatch = yield (0, bcryptjs_1.compare)(password, aUser.getPassword);
        if (!doMatch) {
            return res.status(404).json({ message: "Wrong password" });
        }
        const worker = new worker_threads_1.Worker("../Backend/src/workers/token.js", {
            workerData: {
                email: email,
                userId: aUser.getUser_id,
            },
        });
        worker.on("message", (data) => {
            return res.status(200).json({
                message: "Login succesfully",
                token: data,
                userId: aUser.getUser_id,
                userIsAdmin: userItem.isAdmin,
            });
        });
        worker.on("error", (error) => {
            throw new Error(error);
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
        return res.status(404).json({ message: validationCheck.array()[0].msg });
    }
    const hashedPassword = yield (0, bcryptjs_1.hash)(password, 12);
    try {
        const UserList = (yield userDb_1.default.findByEmail(email));
        if (UserList.length > 0) {
            return res.status(404).json({ message: "Account has already exist" });
        }
        crypto_1.default.randomBytes(32, (err, buffer) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                next(err);
            }
            const token = buffer.toString("hex");
            yield userDb_1.default.create(email, username, hashedPassword);
            const userList = (yield userDb_1.default.findByEmail(email));
            if (userList.length <= 0) {
                return res.status(404).json({ message: "The Server went down" });
            }
            const userItem = userList[0];
            const aUser = new user_1.default(userItem.email, userItem.password, userItem.username, userItem.user_id);
            let code = Math.round(Math.random() * 10000);
            if (code < 1000) {
                code += 1000;
            }
            yield tokenDb_1.default.create(token, aUser.getUser_id, code);
            transport.sendMail({
                from: userMail,
                to: aUser.getEmail,
                subject: "Register successfully",
                html: `
        <h1>Thank you for using our services</h1> 
        <p>Your registration code is : ${code}</p>
        <a href='http://localhost:3000/activate-password/${token}'>Click this link to be able to accept</a>
      `,
            });
            return res
                .status(202)
                .json({ message: "Created an account successfully" });
        }));
    }
    catch (error) {
        if (error.status) {
            error.status = 500;
        }
        next(error);
    }
});
exports.postSignup = postSignup;

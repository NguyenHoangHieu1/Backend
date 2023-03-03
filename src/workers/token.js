"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const worker_threads_1 = require("worker_threads");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const token = jsonwebtoken_1.default.sign({
    email: worker_threads_1.workerData.email,
    userId: worker_threads_1.workerData.userId,
}, "reallysecret", { expiresIn: "1h" });
worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.postMessage(token);

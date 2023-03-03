"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql2_1 = __importDefault(require("mysql2"));
const db = mysql2_1.default.createPool({
    host: "localhost",
    database: "shopify",
    user: "root",
    password: "root",
});
exports.default = db;

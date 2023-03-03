"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const query_1 = __importDefault(require("../util/query"));
class TokenDb {
    static create(token, userId, code) {
        let sql;
        if (code) {
            sql = `INSERT INTO TOKEN(token,userId,activateNumber) VALUES(?,?,?)`;
            return (0, query_1.default)(sql, [token, userId, code]);
        }
        else {
            sql = `INSERT INTO TOKEN(token,userId) VALUES(?,?)`;
            return (0, query_1.default)(sql, [token, userId]);
        }
    }
    static findByToken(token) {
        const sql = `SELECT * FROM token where token = ?`;
        return (0, query_1.default)(sql, [token]);
    }
    static findByUserId(userId) {
        const sql = `SELECT * FROM token where userId= ?`;
        return (0, query_1.default)(sql, [userId]);
    }
    static removeByToken(token) {
        const sql = `DELETE FROM TOKEN WHERE token = ?`;
        return (0, query_1.default)(sql, [token]);
    }
}
exports.default = TokenDb;

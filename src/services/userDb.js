"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const query_1 = __importDefault(require("../util/query"));
class UserDb {
    static findById(userId) {
        const sql = `SELECT * FROM USER WHERE user_id = ?`;
        return (0, query_1.default)(sql, [userId]);
    }
    static findByEmail(email) {
        const sql = `SELECT * FROM USER WHERE email = ?`;
        return (0, query_1.default)(sql, [email]);
    }
    static login(email, password) {
        const sql = `SELECT * FROM USER WHERE email = ? AND password = ?`;
        return (0, query_1.default)(sql, [email, password]);
    }
    static create(email, username, password) {
        const Usersql = `INSERT INTO USER (email,username,password) VALUES (?,?,?)`;
        return (0, query_1.default)(Usersql, [email, username, password]);
    }
    static saveOne(user_id, setting, value) {
        let sql;
        switch (setting) {
            case "email":
                sql = `UPDATE USER SET email = ? where user_id = ?`;
                break;
            case "username":
                sql = `UPDATE USER SET username = ? where user_id = ?`;
                break;
            case "password":
                sql = `UPDATE USER SET password = ? where user_id = ?`;
        }
        return (0, query_1.default)(sql, [user_id, value]);
    }
    static saveEverything(user_id, email, username, password) {
        const sql = `UPDATE USER SET email = ?, username = ?, password = ? WHERE user_id = ?;`;
        return (0, query_1.default)(sql, [email, username, password, user_id]);
    }
}
exports.default = UserDb;

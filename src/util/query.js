"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../database/database"));
function executeSqlDb(sql, property) {
    return new Promise((resolve, reject) => {
        database_1.default.execute(sql, property, (err, result) => {
            if (err)
                reject(err);
            resolve(result);
        });
    });
}
exports.default = executeSqlDb;

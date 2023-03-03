"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const query_1 = __importDefault(require("../util/query"));
class ProductDb {
    static getSomeProduct() {
        const sql = `SELECT * FROM PRODUCT ORDER BY RAND() LIMIT 5;`;
        return (0, query_1.default)(sql, []);
    }
    static getProduct(productId) {
        const sql = `SELECT * FROM PRODUCT WHERE product_id = ?`;
        return (0, query_1.default)(sql, [productId]);
    }
    static getRecommendProducts(productId) {
        const sql = `SELECT * FROM PRODUCT WHERE product_id != ? ORDER BY RAND() LIMIT 3`;
        return (0, query_1.default)(sql, [productId]);
    }
    static getAllProduct() {
        const sql = `SELECT * FROM PRODUCT`;
        return (0, query_1.default)(sql, []);
    }
    static getYourProducts(userId) {
        const sql = `SELECT * FROM PRODUCT WHERE userId = ?`;
        return (0, query_1.default)(sql, [userId]);
    }
    static deleteProduct(productId, userId) {
        const sql = `DELETE FROM PRODUCT WHERE product_id = ? and userId = ?`;
        return (0, query_1.default)(sql, [productId, userId]);
    }
    static save(product) {
        if (!product.getProductId) {
            throw new Error("No Product found");
        }
        const sql = `UPDATE PRODUCT SET title = ? , price = ? , imageUrl = ? , description = ? WHERE product_id = ? AND userId = ?`;
        return (0, query_1.default)(sql, [
            product.getTitle,
            product.getPrice,
            product.getImageUrl,
            product.getDescription,
            product.getProductId,
            product.getUserId,
        ]);
    }
    static create(product) {
        const sql = `INSERT INTO PRODUCT(title,price,description,imageUrl,userId) VALUES(?,?,?,?,?)`;
        return (0, query_1.default)(sql, [
            product.getTitle,
            product.getPrice,
            product.getDescription,
            product.getImageUrl,
            product.getUserId,
        ]);
    }
}
exports.default = ProductDb;

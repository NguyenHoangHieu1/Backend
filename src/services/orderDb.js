"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const query_1 = __importDefault(require("../util/query"));
class orderDb {
    static getOrder(userId) {
        const sql = `
    SELECT * FROM \`order\`
		WHERE userId = ?
      ORDER BY order_id DESC LIMIT 1;
    `;
        return (0, query_1.default)(sql, [userId]);
    }
    static getOrders(userId) {
        const sql = "SELECT DISTINCT order_id, userId FROM `order` WHERE userId =?";
        return (0, query_1.default)(sql, [userId]);
    }
    static getOrderItems(orderId) {
        const sql = `SELECT * FROM orderItem  WHERE orderId = ?`;
        return (0, query_1.default)(sql, [orderId]);
    }
    static createOrder(userId) {
        const sql = "INSERT INTO `order`(userId) VALUES(?)";
        return (0, query_1.default)(sql, [userId]);
    }
    static createOrderItem(productId, title, description, price, imageUrl, quantity, orderId) {
        const sql = "INSERT INTO orderItem(productId,title,description,price,imageUrl,quantity,orderId) VALUES (?,?,?,?,?,?,?)";
        return (0, query_1.default)(sql, [
            productId,
            title,
            description,
            price,
            imageUrl,
            quantity,
            orderId,
        ]);
    }
}
exports.default = orderDb;

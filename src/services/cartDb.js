"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const query_1 = __importDefault(require("../util/query"));
class cartDb {
    static create(userId) {
        const sql = `INSERT INTO CART(userId) VALUES (?)`;
        return (0, query_1.default)(sql, [userId]);
    }
    static getCart(userId) {
        const sql = `SELECT * FROM CART WHERE userId = ?`;
        return (0, query_1.default)(sql, [userId]);
    }
    static getCartItems(cartId) {
        const sql = `SELECT * FROM CARTITEM WHERE cartId = ?`;
        return (0, query_1.default)(sql, [cartId]);
    }
    static getCartItem(cartId, productId) {
        const sql = `SELECT * FROM CARTITEM WHERE CARTID = ? AND productId = ?`;
        return (0, query_1.default)(sql, [cartId, productId]);
    }
    static addToCart(cardId, productId, quantity) {
        const sql = `INSERT INTO CARTITEM(cartId,productId,quantity) VALUES(?,?,?)`;
        return (0, query_1.default)(sql, [cardId, productId, quantity]);
    }
    static changeCartItem(cartItem, quantity) {
        const sql = `UPDATE cartItem SET quantity = ? WHERE cartItem_id = ?`;
        const newQuantity = +cartItem.quantity + +quantity;
        return (0, query_1.default)(sql, [newQuantity, cartItem.cartItem_id]);
    }
    static deleteCartItem(cartId, productId) {
        const sql = `DELETE FROM CARTITEM WHERE cartId = ? AND productId = ?`;
        // console.log(userId, productId);
        return (0, query_1.default)(sql, [cartId, productId]);
    }
    static deleteCartItems(cartId) {
        const sql = `DELETE FROM CARTITEM WHERE cartId = ?`;
        return (0, query_1.default)(sql, [cartId]);
    }
}
exports.default = cartDb;

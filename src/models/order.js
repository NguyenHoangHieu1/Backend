"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Order {
    constructor(userId, orderId) {
        this.userId = userId;
        this.orderId = orderId;
    }
    get getUserId() {
        return this.userId;
    }
    get getOrderId() {
        return this.orderId;
    }
}
exports.default = Order;

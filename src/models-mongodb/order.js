"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const orderSchema = new mongoose_1.default.Schema({
    products: [
        {
            product: {
                type: mongoose_1.default.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        },
    ],
    user: {
        userId: {
            type: mongoose_1.default.Types.ObjectId,
            ref: "User",
            required: true,
        },
        username: {
            type: String,
            required: true,
        },
    },
});
exports.default = mongoose_1.default.model("Order", orderSchema);

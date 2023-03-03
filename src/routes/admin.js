"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_1 = require("../controllers/admin");
const express_validator_1 = require("express-validator");
const is_Auth_1 = __importDefault(require("../middleware/is-Auth"));
const adminRoute = express_1.default.Router();
adminRoute.get("/your-products/:userId", is_Auth_1.default, admin_1.getYourProducts);
adminRoute.get("/edit-product/:productId", is_Auth_1.default, admin_1.GetEditProduct);
adminRoute.put("/edit-product", is_Auth_1.default, admin_1.putEditProduct);
adminRoute.delete("/delete-product", is_Auth_1.default, admin_1.DeleteProduct);
adminRoute.post("/add-product", is_Auth_1.default, [
    (0, express_validator_1.body)("title", "The title has to be 5 characters long")
        .trim()
        .isLength({ min: 5 }),
    (0, express_validator_1.body)("price", "It should be higher than 0").isNumeric().isFloat({ min: 1 }),
    (0, express_validator_1.body)("imageUrl", "It should be an url of an image").isURL(),
    (0, express_validator_1.body)("description", "The description should be 10 characters long")
        .trim()
        .isLength({ min: 10 }),
], admin_1.postAddProduct);
exports.default = adminRoute;

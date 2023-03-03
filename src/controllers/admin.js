"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getYourProducts = exports.GetEditProduct = exports.putEditProduct = exports.DeleteProduct = exports.postAddProduct = void 0;
const product_1 = __importDefault(require("../models/product"));
const productDb_1 = __importDefault(require("../services/productDb"));
const postAddProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.userId;
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    const imageUrl = req.body.imageUrl;
    console.log(userId, title, price, description, imageUrl);
    let aProduct = new product_1.default(title, price, description, imageUrl, userId);
    try {
        yield productDb_1.default.create(aProduct);
        return res.status(201).json({ message: "Created Successfully" });
    }
    catch (error) {
        if (!error.status) {
            error.status = 500;
        }
        next(error);
    }
});
exports.postAddProduct = postAddProduct;
const DeleteProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.body.productId;
    const userId = req.body.userId;
    try {
        yield productDb_1.default.deleteProduct(productId, userId);
        return res.status(201).json({ message: "Deleted successfully" });
    }
    catch (error) {
        if (!error.status) {
            error.status = 500;
        }
        next(error);
    }
});
exports.DeleteProduct = DeleteProduct;
const putEditProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.body.productId;
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    const imageUrl = req.body.imageUrl;
    const userId = req.body.userId;
    const product = new product_1.default(title, price, description, imageUrl, userId, productId);
    try {
        yield productDb_1.default.save(product);
        return res.status(200).json({ message: "Edit successfully" });
    }
    catch (error) {
        if (!error.status) {
            error.status = 500;
        }
        next(error);
    }
});
exports.putEditProduct = putEditProduct;
const GetEditProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.params.productId;
    try {
        const product = (yield productDb_1.default.getProduct(productId));
        return res
            .status(200)
            .json({ message: "Here is your product to edit", product: product[0] });
    }
    catch (error) {
        if (!error.status) {
            error.status = 500;
        }
        next(error);
    }
});
exports.GetEditProduct = GetEditProduct;
const getYourProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = +req.params.userId;
    try {
        const yourProducts = (yield productDb_1.default.getYourProducts(userId));
        return res
            .status(200)
            .json({ message: "Fetch succesfully", products: yourProducts });
    }
    catch (error) {
        if (!error.status) {
            error.status = 500;
        }
        next(error);
    }
});
exports.getYourProducts = getYourProducts;

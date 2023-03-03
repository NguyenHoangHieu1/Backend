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
exports.putEditProduct = exports.GetEditProduct = exports.DeleteProduct = exports.postAddProduct = exports.getYourProducts = void 0;
const product_1 = __importDefault(require("../models-mongodb/product"));
const express_validator_1 = require("express-validator");
const getYourProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    try {
        const products = yield product_1.default.find({ userId: userId });
        return res.status(200).json({ message: "Products", products: products });
    }
    catch (error) {
        if (!error.status) {
            error.status = 500;
        }
        next(error);
    }
});
exports.getYourProducts = getYourProducts;
const postAddProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const title = req.body.title;
    const price = req.body.price;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const userId = req.body.userId;
    const validationCheck = (0, express_validator_1.validationResult)(req);
    if (!validationCheck.isEmpty()) {
        return res.status(406).json({ message: validationCheck.array()[0].msg });
    }
    try {
        const product = yield product_1.default.create({
            title: title,
            price: price,
            imageUrl: imageUrl,
            description: description,
            userId: userId,
        });
        return res
            .status(201)
            .json({ message: "Created Successfully", product: product });
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
    try {
        yield product_1.default.findByIdAndDelete(productId);
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
const GetEditProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.params.productId;
    try {
        const product = yield product_1.default.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found!" });
        }
        return res
            .status(200)
            .json({ message: "Fetch product successfully", product: product });
    }
    catch (error) {
        if (!error.status) {
            error.status = 500;
        }
        next(error);
    }
});
exports.GetEditProduct = GetEditProduct;
const putEditProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.body.productId;
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    const imageUrl = req.body.imageUrl;
    try {
        const product = yield product_1.default.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found!" });
        }
        product.title = title;
        product.price = price;
        product.description = description;
        product.imageUrl = imageUrl;
        yield product.save();
        return res.status(200).json({ message: "Created successfully" });
    }
    catch (error) {
        if (!error.status) {
            error.status = 500;
        }
        next(error);
    }
});
exports.putEditProduct = putEditProduct;

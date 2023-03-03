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
exports.postOrder = exports.getOrders = exports.deleteCartItem = exports.putAddToCart = exports.getCart = exports.getProductDetail = exports.getProductRecommend = exports.getProducts = exports.getIndex = void 0;
const product_1 = __importDefault(require("../models-mongodb/product"));
const user_1 = __importDefault(require("../models-mongodb/user"));
const order_1 = __importDefault(require("../models-mongodb/order"));
const getIndex = (req, res, next) => {
    product_1.default.find()
        .then((products) => {
        if (products.length == 0) {
            res.status(200).json({ products: [], message: "No Product Found" });
        }
        else {
            res
                .status(200)
                .json({ products: products, message: "Fetch successfully" });
        }
    })
        .catch((err) => next(err));
};
exports.getIndex = getIndex;
const getProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const setoff = +req.params.setoff;
    const limit = +req.params.limit;
    const page = +req.params.page;
    let skippedProducts = limit * setoff;
    try {
        const products = yield product_1.default.find().skip(skippedProducts).limit(limit);
        if (!products) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res
            .status(200)
            .json({ message: "Fetched Successfully", products: products });
    }
    catch (error) {
        if (!error.status) {
            error.status = 500;
        }
        next(error);
    }
});
exports.getProducts = getProducts;
const getProductRecommend = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.params.productId;
    try {
        let products = yield product_1.default.find();
        if (!products) {
            return res.status(404).json({ message: "Product not found" });
        }
        let productIndex = products.findIndex((product) => product._id.toString() === productId.toString());
        products = products.filter((product, index) => {
            if (index - 1 === productIndex) {
                return product;
            }
            else if (index + 1 === productIndex) {
                return product;
            }
            else if (index - 2 === productIndex) {
                return product;
            }
            else if (index + 2 === productIndex) {
                return product;
            }
        });
        return res
            .status(200)
            .json({ message: "Products fetched", products: products });
    }
    catch (error) {
        if (!error.status) {
            error.status = 500;
        }
        next(error);
    }
});
exports.getProductRecommend = getProductRecommend;
const getProductDetail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.params.productId;
    try {
        const product = yield product_1.default.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res.status(200).json({ message: "Product Found", product: product });
    }
    catch (error) {
        if (!error.status) {
            error.status = 500;
        }
        next(error);
    }
});
exports.getProductDetail = getProductDetail;
const getCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    try {
        const user = yield user_1.default.findById(userId).populate("cart.cartItems.productId");
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }
        return res
            .status(200)
            .json({ message: "Append cart successfully", cart: user.cart });
    }
    catch (error) {
        if (!error.status) {
            error.status = 500;
        }
        next(error);
    }
});
exports.getCart = getCart;
const putAddToCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.body.productId;
    const quantity = req.body.quantity;
    const userId = req.body.userId;
    try {
        const product = yield product_1.default.findById(productId);
        const user = yield user_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Account not found" });
        }
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        const cartItems = user.cart.cartItems.slice();
        let totalQuantity = user.cart.totalQuantity;
        let totalPrice = user.cart.totalPrice;
        const cartItemIndex = user.cart.cartItems.findIndex((item) => {
            return item.productId.toString() === productId.toString();
        });
        const cartItem = user.cart.cartItems.find((item) => {
            return item.productId.toString() === productId.toString();
        });
        if (cartItemIndex !== -1 && cartItem) {
            cartItem.quantity += quantity;
        }
        else {
            cartItems.push({
                productId: productId,
                quantity: quantity,
            });
        }
        totalPrice = quantity * product.price;
        totalQuantity += quantity;
        user.cart.totalPrice = totalPrice;
        user.cart.totalQuantity = totalQuantity;
        user.cart.cartItems = cartItems;
        yield user.save();
        return res.status(201).json({ message: "Add successfully" });
    }
    catch (error) {
        if (!error.status) {
            error.status = 500;
        }
        next(error);
    }
});
exports.putAddToCart = putAddToCart;
const deleteCartItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const cartItemId = req.body.cartItemId;
    const userId = req.body.userId;
    const quantityToDelete = req.body.quantityToDelete;
    let cartItems;
    const user = yield user_1.default.findById(userId);
    if (!user) {
        return res.status(404).json({ message: "Account not found" });
    }
    const cartItemIndex = user.cart.cartItems.findIndex((item) => {
        return item.productId.toString() === cartItemId.toString();
    });
    const cartItem = user.cart.cartItems.find((item) => {
        return item.productId.toString() === cartItemId.toString();
    });
    if (!cartItem) {
        return res.status(404).json({ message: "Cart Item not found" });
    }
    const productDetail = yield product_1.default.findById(cartItem.productId);
    if (!productDetail) {
        return res.status(404).json({ message: "Cart Item not found" });
    }
    if (cartItem.quantity <= quantityToDelete) {
        cartItems = user.cart.cartItems.filter((item) => {
            return item.productId.toString() !== cartItemId.toString();
        });
    }
    else {
        console.log(cartItem.quantity, quantityToDelete);
        cartItem.quantity -= quantityToDelete;
        cartItems = [...user.cart.cartItems];
        cartItems[cartItemIndex] = cartItem;
    }
    let totalQuantity = user.cart.totalQuantity - quantityToDelete;
    if (totalQuantity < 0) {
        totalQuantity = 0;
    }
    let totalPrice = user.cart.totalPrice - quantityToDelete * productDetail.price;
    if (totalPrice < 0) {
        totalPrice = 0;
    }
    user.cart = {
        cartItems: cartItems,
        totalQuantity: totalQuantity,
        totalPrice: totalPrice,
    };
    yield user.save();
    return res
        .status(200)
        .json({ message: "Delete Successfully", cart: user.cart });
});
exports.deleteCartItem = deleteCartItem;
const getOrders = (req, res, next) => {
    const userId = req.body.userId;
};
exports.getOrders = getOrders;
const postOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.userId;
    const user = yield user_1.default.findById(userId).populate("cart.cartItems.productId");
    if (!user) {
        return res.status(404).json({ message: "Account not found" });
    }
    const orderProducts = user.cart.cartItems.map((item) => {
        return {
            products: Object.assign({}, item),
        };
    });
    yield order_1.default.create({
        products: orderProducts,
        user: {
            userId: userId,
            username: user.username,
        },
    });
    return res.status(202).json({ message: "Order successfully" });
});
exports.postOrder = postOrder;

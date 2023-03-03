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
exports.postContact = exports.postAddOrder = exports.getOrders = exports.deleteCartItem = exports.putAddToCart = exports.getCart = exports.getProducts = exports.getProductRecommend = exports.getProductDetail = exports.getIndex = void 0;
const cartDb_1 = __importDefault(require("../services/cartDb"));
const orderDb_1 = __importDefault(require("../services/orderDb"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const productDb_1 = __importDefault(require("../services/productDb"));
const userMail = "hoanghieufro@gmail.com";
const passMail = "faslrrtkbtxnjdtd";
const transport = nodemailer_1.default.createTransport({
    service: "Gmail",
    auth: {
        user: userMail,
        pass: passMail,
    },
});
const getIndex = (_, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productList = (yield productDb_1.default.getSomeProduct());
        return res
            .status(200)
            .json({ message: "Fetched Succesfully", products: productList });
    }
    catch (error) {
        if (!error.status) {
            error.status = 500;
        }
        next(error);
    }
});
exports.getIndex = getIndex;
const getProductDetail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.params.productId;
    try {
        const product = (yield productDb_1.default.getProduct(productId));
        return res
            .status(200)
            .json({ message: "Fetched Succesfully", product: product[0] });
    }
    catch (error) {
        if (!error.status) {
            error.status = 500;
        }
        next(error);
    }
});
exports.getProductDetail = getProductDetail;
const getProductRecommend = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.params.productId;
    try {
        const products = yield productDb_1.default.getRecommendProducts(productId);
        return res
            .status(200)
            .json({ message: "Fetch successfully", products: products });
    }
    catch (error) {
        if (!error.status) {
            error.status = 500;
        }
        next(error);
    }
});
exports.getProductRecommend = getProductRecommend;
const getProducts = (_, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productList = yield productDb_1.default.getAllProduct();
        return res
            .status(200)
            .json({ message: "Fetched Succesfully", products: productList });
    }
    catch (error) {
        if (!error.status) {
            error.status = 500;
        }
        next(error);
    }
});
exports.getProducts = getProducts;
const getCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    try {
        const cartList = (yield cartDb_1.default.getCart(userId));
        if (cartList.length <= 0) {
            return res.status(404).json({ message: "No Cart Found" });
        }
        const cart = cartList[0];
        const cartItems = (yield cartDb_1.default.getCartItems(cart.cart_id));
        let userCartItems = [];
        for (let cartItem of cartItems) {
            const productList = (yield productDb_1.default.getProduct(cartItem.productId));
            if (productList.length === 1) {
                const product = productList[0];
                product.quantity = cartItem.quantity;
                userCartItems.push(product);
            }
        }
        return res.status(200).json({
            message: "Fetched cart successfully",
            cartItems: userCartItems,
        });
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
    const userId = req.body.userId;
    const quantity = req.body.quantity;
    try {
        const cart = (yield cartDb_1.default.getCart(userId));
        if (cart.length <= 0) {
            return res.status(404).json({ message: "No cart found" });
        }
        const userCart = cart[0];
        const cartItems = (yield cartDb_1.default.getCartItem(userCart.cart_id, productId));
        if (cartItems.length <= 0) {
            yield cartDb_1.default.addToCart(userCart.cart_id, productId, quantity);
        }
        else {
            const cartItem = cartItems[0];
            if (cartItem.productId.toString() === productId.toString()) {
                yield cartDb_1.default.changeCartItem(cartItem, quantity);
            }
        }
        return res.status(201).json({ message: "Added successfully" });
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
    const quantity = req.body.quantityToDelete;
    const productId = req.body.productId;
    const userId = req.body.userId;
    try {
        const cartList = (yield cartDb_1.default.getCart(userId));
        if (cartList.length <= 0) {
            return res.status(404).json({ message: "Account not found" });
        }
        const cart = cartList[0];
        const cartItemList = (yield cartDb_1.default.getCartItem(cart.cart_id, productId));
        if (cartItemList.length <= 0) {
            return res
                .status(404)
                .json({ message: "No Product in the cart to delete" });
        }
        const cartItem = cartItemList[0];
        if (cartItem.quantity <= quantity) {
            yield cartDb_1.default.deleteCartItem(cart.cart_id, productId);
        }
        else {
            yield cartDb_1.default.changeCartItem(cartItem, -quantity);
        }
        const cartItems = (yield cartDb_1.default.getCartItems(cart.cart_id));
        const userCartItems = [];
        for (const cartItem of cartItems) {
            const productList = (yield productDb_1.default.getProduct(cartItem.productId));
            if (productList.length === 1) {
                const product = productList[0];
                product.quantity = cartItem.quantity;
                userCartItems.push(product);
            }
        }
        return res
            .status(201)
            .json({ message: "Removed Successfully", cartItems: userCartItems });
    }
    catch (error) {
        if (!error.status) {
            error.status = 500;
        }
        next(error);
    }
});
exports.deleteCartItem = deleteCartItem;
const getOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    console.log(userId);
    try {
        const orderUser = (yield orderDb_1.default.getOrders(userId));
        const orderFetched = yield Promise.all(orderUser.map((order) => __awaiter(void 0, void 0, void 0, function* () {
            const orderItems = (yield orderDb_1.default.getOrderItems(order.order_id));
            order.orderItems = orderItems;
            return order;
        })));
        console.log(orderFetched[0].orderItems);
        return res
            .status(200)
            .json({ message: "Fetched Orders", orders: orderFetched });
    }
    catch (error) {
        if (!error.status) {
            error.status = 500;
        }
        next(error);
    }
});
exports.getOrders = getOrders;
const postAddOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.userId;
    try {
        const cartList = (yield cartDb_1.default.getCart(userId));
        if (cartList.length <= 0) {
            return res.status(404).json({ message: "You haven't activated the code" });
        }
        const userCart = cartList[0];
        yield orderDb_1.default.createOrder(userId);
        const userOrderList = (yield orderDb_1.default.getOrder(userId));
        const userOrder = userOrderList[0];
        const cartItems = (yield cartDb_1.default.getCartItems(userCart.cart_id));
        const productOrderItems = [];
        for (const cartItem of cartItems) {
            const productList = (yield productDb_1.default.getProduct(cartItem.productId));
            if (productList.length == 1) {
                const product = productList[0];
                product.quantity = cartItem.quantity;
                productOrderItems.push(product);
            }
        }
        for (const product of productOrderItems) {
            if (product.quantity)
                yield orderDb_1.default.createOrderItem(product.product_id, product.title, product.description, product.price, product.imageUrl, product.quantity, userOrder.order_id);
        }
        yield cartDb_1.default.deleteCartItems(userCart.cart_id);
        return res.status(200).json({ message: "Order successfully" });
    }
    catch (error) {
        if (!error.status) {
            error.status = 500;
        }
        next(error);
    }
});
exports.postAddOrder = postAddOrder;
const postContact = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const name = req.body.name;
    const message = req.body.message;
    console.log(name, email, message);
    try {
        transport.sendMail({
            from: email,
            to: userMail,
            subject: "Contact Us",
            html: `<h1>Name: ${name}</h1><h2>Sender: ${email}</h2><p>Message: ${message}</p>`,
        });
        return res.status(200).json({ message: "Message sent successfully" });
    }
    catch (error) {
        if (!error.status) {
            error.status = 500;
        }
        next(error);
    }
});
exports.postContact = postContact;

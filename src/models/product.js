"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Product {
    constructor(title, price, description, imageUrl, userId, product_id) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this.userId = userId;
        this.product_id = product_id;
    }
    get getProductId() {
        return this.product_id;
    }
    get getTitle() {
        return this.title;
    }
    get getPrice() {
        return this.price;
    }
    get getDescription() {
        return this.description;
    }
    get getImageUrl() {
        return this.imageUrl;
    }
    get getUserId() {
        return this.userId;
    }
}
exports.default = Product;

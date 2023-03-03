import express from "express"
import {
  getIndex,
  getProductDetail,
  getProductRecommend,
  getProducts,
  getCart,
  putAddToCart,
  deleteCartItem,
  postAddOrder,
  getOrders,
  postContact,
} from "../controllers/main"

import isAuth from "../middleware/is-Auth"

const mainRoute = express.Router()

mainRoute.get("/", getIndex)

mainRoute.get("/products", getProducts)

mainRoute.get("/product-recommend/:productId", getProductRecommend)

mainRoute.get("/product-detail/:productId", getProductDetail)
mainRoute.get("/cart/:userId", isAuth, getCart)

mainRoute.put("/add-to-cart", isAuth, putAddToCart)

mainRoute.delete("/delete-cart-item", isAuth, deleteCartItem)

mainRoute.get("/orders/:userId", isAuth, getOrders)

mainRoute.post("/add-order", isAuth, postAddOrder)

mainRoute.post("/contact", postContact)
export default mainRoute

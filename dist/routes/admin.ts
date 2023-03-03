import express from "express";
import {
  postAddProduct,
  DeleteProduct,
  putEditProduct,
  GetEditProduct,
  getYourProducts,
} from "../controllers/admin";
import { body } from "express-validator";
import isAuth from "../middleware/is-Auth";

const adminRoute = express.Router();

adminRoute.get("/your-products/:userId", isAuth, getYourProducts);

adminRoute.get("/edit-product/:productId", isAuth, GetEditProduct);

adminRoute.put("/edit-product", isAuth, putEditProduct);

adminRoute.delete("/delete-product", isAuth, DeleteProduct);

adminRoute.post(
  "/add-product",
  isAuth,
  [
    body("title", "The title has to be 5 characters long")
      .trim()
      .isLength({ min: 5 }),
    body("price", "It should be higher than 0").isNumeric().isFloat({ min: 1 }),
    body("imageUrl", "It should be an url of an image").isURL(),
    body("description", "The description should be 10 characters long")
      .trim()
      .isLength({ min: 10 }),
  ],
  postAddProduct
);

export default adminRoute;

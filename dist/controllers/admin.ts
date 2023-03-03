import { RequestHandler } from "express"
import ProductInterface from "../interfaces/Product"
import Product from "../models/product"
import ProductDb from "../services/productDb"

export const postAddProduct: RequestHandler = async (req, res, next) => {
  const userId = req.body.userId
  const title = req.body.title
  const price = req.body.price
  const description = req.body.description
  const imageUrl = req.body.imageUrl
  console.log(userId, title, price, description, imageUrl)
  let aProduct = new Product(title, price, description, imageUrl, userId)
  try {
    await ProductDb.create(aProduct)
    return res.status(201).json({ message: "Created Successfully" })
  } catch (error: any) {
    if (!error.status) {
      error.status = 500
    }
    next(error)
  }
}
export const DeleteProduct: RequestHandler = async (req, res, next) => {
  const productId = req.body.productId
  const userId = req.body.userId

  try {
    await ProductDb.deleteProduct(productId, userId)
    return res.status(201).json({ message: "Deleted successfully" })
  } catch (error: any) {
    if (!error.status) {
      error.status = 500
    }
    next(error)
  }
}
export const putEditProduct: RequestHandler = async (req, res, next) => {
  const productId = req.body.productId
  const title = req.body.title
  const price = req.body.price
  const description = req.body.description
  const imageUrl = req.body.imageUrl
  const userId = req.body.userId
  const product = new Product(
    title,
    price,
    description,
    imageUrl,
    userId,
    productId
  )
  try {
    await ProductDb.save(product)
    return res.status(200).json({ message: "Edit successfully" })
  } catch (error: any) {
    if (!error.status) {
      error.status = 500
    }
    next(error)
  }
}
export const GetEditProduct: RequestHandler = async (req, res, next) => {
  const productId = req.params.productId
  try {
    const product = (await ProductDb.getProduct(
      productId
    )) as ProductInterface[]
    return res
      .status(200)
      .json({ message: "Here is your product to edit", product: product[0] })
  } catch (error: any) {
    if (!error.status) {
      error.status = 500
    }
    next(error)
  }
}
export const getYourProducts: RequestHandler = async (req, res, next) => {
  const userId = +req.params.userId
  try {
    const yourProducts = (await ProductDb.getYourProducts(
      userId
    )) as ProductInterface[]
    return res
      .status(200)
      .json({ message: "Fetch succesfully", products: yourProducts })
  } catch (error: any) {
    if (!error.status) {
      error.status = 500
    }
    next(error)
  }
}

import { RequestHandler } from "express"
import cartInterface from "../interfaces/cart"
import cartItemInterface from "../interfaces/cartItem"
import OrderInterface from "../interfaces/order"
import orderItemInterface from "../interfaces/orderItem"
import ProductInterface from "../interfaces/Product"
import cartDb from "../services/cartDb"
import orderDb from "../services/orderDb"
import nodemailer from "nodemailer"
import ProductDb from "../services/productDb"

const userMail = "hoanghieufro@gmail.com"
const passMail = "faslrrtkbtxnjdtd"

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: userMail,
    pass: passMail,
  },
})

export const getIndex: RequestHandler = async (_, res, next) => {
  try {
    const productList = (await ProductDb.getSomeProduct()) as ProductInterface[]
    return res
      .status(200)
      .json({ message: "Fetched Succesfully", products: productList })
  } catch (error: any) {
    if (!error.status) {
      error.status = 500
    }
    next(error)
  }
}
export const getProductDetail: RequestHandler = async (req, res, next) => {
  const productId = req.params.productId
  try {
    const product = (await ProductDb.getProduct(
      productId
    )) as ProductInterface[]

    return res
      .status(200)
      .json({ message: "Fetched Succesfully", product: product[0] })
  } catch (error: any) {
    if (!error.status) {
      error.status = 500
    }
    next(error)
  }
}
export const getProductRecommend: RequestHandler = async (req, res, next) => {
  const productId = req.params.productId

  try {
    const products = await ProductDb.getRecommendProducts(productId)
    return res
      .status(200)
      .json({ message: "Fetch successfully", products: products })
  } catch (error: any) {
    if (!error.status) {
      error.status = 500
    }
    next(error)
  }
}
export const getProducts: RequestHandler = async (_, res, next) => {
  try {
    const productList = await ProductDb.getAllProduct()
    return res
      .status(200)
      .json({ message: "Fetched Succesfully", products: productList })
  } catch (error: any) {
    if (!error.status) {
      error.status = 500
    }
    next(error)
  }
}
export const getCart: RequestHandler = async (req, res, next) => {
  const userId = req.params.userId
  try {
    const cartList = (await cartDb.getCart(userId)) as cartInterface[]
    if (cartList.length <= 0) {
      return res.status(404).json({ message: "No Cart Found" })
    }
    const cart = cartList[0]
    const cartItems = (await cartDb.getCartItems(
      cart.cart_id
    )) as cartItemInterface[]
    let userCartItems: ProductInterface[] = []
    for (let cartItem of cartItems) {
      const productList = (await ProductDb.getProduct(
        cartItem.productId
      )) as ProductInterface[]
      if (productList.length === 1) {
        const product = productList[0]
        product.quantity = cartItem.quantity
        userCartItems.push(product)
      }
    }

    return res.status(200).json({
      message: "Fetched cart successfully",
      cartItems: userCartItems,
    })
  } catch (error: any) {
    if (!error.status) {
      error.status = 500
    }
    next(error)
  }
}
export const putAddToCart: RequestHandler = async (req, res, next) => {
  const productId = req.body.productId
  const userId = req.body.userId
  const quantity = req.body.quantity
  try {
    const cart = (await cartDb.getCart(userId)) as cartInterface[]
    if (cart.length <= 0) {
      return res.status(404).json({ message: "No cart found" })
    }
    const userCart = cart[0]
    const cartItems = (await cartDb.getCartItem(
      userCart.cart_id,
      productId
    )) as cartItemInterface[]
    if (cartItems.length <= 0) {
      await cartDb.addToCart(userCart.cart_id, productId, quantity)
    } else {
      const cartItem = cartItems[0]
      if (cartItem.productId.toString() === productId.toString()) {
        await cartDb.changeCartItem(cartItem, quantity)
      }
    }
    return res.status(201).json({ message: "Added successfully" })
  } catch (error: any) {
    if (!error.status) {
      error.status = 500
    }
    next(error)
  }
}
export const deleteCartItem: RequestHandler = async (req, res, next) => {
  const quantity = req.body.quantityToDelete
  const productId = req.body.productId
  const userId = req.body.userId
  try {
    const cartList = (await cartDb.getCart(userId)) as cartInterface[]
    if (cartList.length <= 0) {
      return res.status(404).json({ message: "Account not found" })
    }
    const cart = cartList[0]
    const cartItemList = (await cartDb.getCartItem(
      cart.cart_id,
      productId
    )) as cartItemInterface[]
    if (cartItemList.length <= 0) {
      return res
        .status(404)
        .json({ message: "No Product in the cart to delete" })
    }

    const cartItem = cartItemList[0]

    if (cartItem.quantity <= quantity) {
      await cartDb.deleteCartItem(cart.cart_id, productId)
    } else {
      await cartDb.changeCartItem(cartItem, -quantity)
    }
    const cartItems = (await cartDb.getCartItems(
      cart.cart_id
    )) as cartItemInterface[]

    const userCartItems: ProductInterface[] = []
    for (const cartItem of cartItems) {
      const productList = (await ProductDb.getProduct(
        cartItem.productId
      )) as ProductInterface[]
      if (productList.length === 1) {
        const product = productList[0]
        product.quantity = cartItem.quantity
        userCartItems.push(product)
      }
    }
    return res
      .status(201)
      .json({ message: "Removed Successfully", cartItems: userCartItems })
  } catch (error: any) {
    if (!error.status) {
      error.status = 500
    }
    next(error)
  }
}

export const getOrders: RequestHandler = async (req, res, next) => {
  const userId = req.params.userId
  console.log(userId)
  try {
    const orderUser = (await orderDb.getOrders(userId)) as OrderInterface[]

    const orderFetched = await Promise.all(
      orderUser.map(async (order) => {
        const orderItems = (await orderDb.getOrderItems(
          order.order_id
        )) as orderItemInterface[]
        order.orderItems = orderItems
        return order
      })
    )
    console.log(orderFetched[0].orderItems)

    return res
      .status(200)
      .json({ message: "Fetched Orders", orders: orderFetched })
  } catch (error: any) {
    if (!error.status) {
      error.status = 500
    }
    next(error)
  }
}

export const postAddOrder: RequestHandler = async (req, res, next) => {
  const userId = req.body.userId
  try {
    const cartList = (await cartDb.getCart(userId)) as cartInterface[]
    if (cartList.length <= 0) {
      return res.status(404).json({ message: "You haven't activated the code" })
    }
    const userCart = cartList[0]
    await orderDb.createOrder(userId)
    const userOrderList = (await orderDb.getOrder(userId)) as OrderInterface[]
    const userOrder = userOrderList[0]

    const cartItems = (await cartDb.getCartItems(
      userCart.cart_id
    )) as cartItemInterface[]
    const productOrderItems: ProductInterface[] = []
    for (const cartItem of cartItems) {
      const productList = (await ProductDb.getProduct(
        cartItem.productId
      )) as ProductInterface[]
      if (productList.length == 1) {
        const product = productList[0]
        product.quantity = cartItem.quantity
        productOrderItems.push(product)
      }
    }

    for (const product of productOrderItems) {
      if (product.quantity)
        await orderDb.createOrderItem(
          product.product_id,
          product.title,
          product.description,
          product.price,
          product.imageUrl,
          product.quantity,
          userOrder.order_id
        )
    }
    await cartDb.deleteCartItems(userCart.cart_id)
    return res.status(200).json({ message: "Order successfully" })
  } catch (error: any) {
    if (!error.status) {
      error.status = 500
    }
    next(error)
  }
}

export const postContact: RequestHandler = async (req, res, next) => {
  const email = req.body.email
  const name = req.body.name
  const message = req.body.message
  console.log(name, email, message)

  try {
    transport.sendMail({
      from: email,
      to: userMail,
      subject: "Contact Us",
      html: `<h1>Name: ${name}</h1><h2>Sender: ${email}</h2><p>Message: ${message}</p>`,
    })
    return res.status(200).json({ message: "Message sent successfully" })
  } catch (error: any) {
    if (!error.status) {
      error.status = 500
    }
    next(error)
  }
}

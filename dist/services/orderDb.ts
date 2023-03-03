import executeSqlDb from "../util/query"

export default class orderDb {
  static getOrder(userId: string) {
    const sql = `
    SELECT * FROM \`order\`
		WHERE userId = ?
      ORDER BY order_id DESC LIMIT 1;
    `
    return executeSqlDb(sql, [userId])
  }

  static getOrders(userId: string) {
    const sql = "SELECT DISTINCT order_id, userId FROM `order` WHERE userId =?"
    return executeSqlDb(sql, [userId])
  }

  static getOrderItems(orderId: string) {
    const sql = `SELECT * FROM orderItem  WHERE orderId = ?`
    return executeSqlDb(sql, [orderId])
  }
  static createOrder(userId: string) {
    const sql = "INSERT INTO `order`(userId) VALUES(?)"
    return executeSqlDb(sql, [userId])
  }
  static createOrderItem(
    productId: string,
    title: string,
    description: string,
    price: number,
    imageUrl: string,
    quantity: number,
    orderId: string
  ) {
    const sql =
      "INSERT INTO orderItem(productId,title,description,price,imageUrl,quantity,orderId) VALUES (?,?,?,?,?,?,?)"
    return executeSqlDb(sql, [
      productId,
      title,
      description,
      price,
      imageUrl,
      quantity,
      orderId,
    ])
  }
}

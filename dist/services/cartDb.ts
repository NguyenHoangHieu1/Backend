import cartItemInterface from "../interfaces/cartItem";
import executeSqlDb from "../util/query";
export default class cartDb {
  static create(userId: string) {
    const sql = `INSERT INTO CART(userId) VALUES (?)`;
    return executeSqlDb(sql, [userId]);
  }
  static getCart(userId: string) {
    const sql = `SELECT * FROM CART WHERE userId = ?`;
    return executeSqlDb(sql, [userId]);
  }
  static getCartItems(cartId: string) {
    const sql = `SELECT * FROM CARTITEM WHERE cartId = ?`;
    return executeSqlDb(sql, [cartId]);
  }
  static getCartItem(cartId: string, productId: string) {
    const sql = `SELECT * FROM CARTITEM WHERE CARTID = ? AND productId = ?`;
    return executeSqlDb(sql, [cartId, productId]);
  }
  static addToCart(cardId: string, productId: string, quantity: string) {
    const sql = `INSERT INTO CARTITEM(cartId,productId,quantity) VALUES(?,?,?)`;
    return executeSqlDb(sql, [cardId, productId, quantity]);
  }
  static changeCartItem(cartItem: cartItemInterface, quantity: number) {
    const sql = `UPDATE cartItem SET quantity = ? WHERE cartItem_id = ?`;
    const newQuantity = +cartItem.quantity + +quantity;
    return executeSqlDb(sql, [newQuantity, cartItem.cartItem_id]);
  }
  static deleteCartItem(cartId: string, productId: string) {
    const sql = `DELETE FROM CARTITEM WHERE cartId = ? AND productId = ?`;
    // console.log(userId, productId);
    return executeSqlDb(sql, [cartId, productId]);
  }
  static deleteCartItems(cartId: string) {
    const sql = `DELETE FROM CARTITEM WHERE cartId = ?`;
    return executeSqlDb(sql, [cartId]);
  }
}

import Product from "../models/product";
import executeSqlDb from "../util/query";

export default class ProductDb {
  static getSomeProduct() {
    const sql = `SELECT * FROM PRODUCT ORDER BY RAND() LIMIT 5;`;
    return executeSqlDb(sql, []);
  }
  static getProduct(productId: string) {
    const sql = `SELECT * FROM PRODUCT WHERE product_id = ?`;
    return executeSqlDb(sql, [productId]);
  }
  static getRecommendProducts(productId: string) {
    const sql = `SELECT * FROM PRODUCT WHERE product_id != ? ORDER BY RAND() LIMIT 3`;
    return executeSqlDb(sql, [productId]);
  }
  static getAllProduct() {
    const sql = `SELECT * FROM PRODUCT`;
    return executeSqlDb(sql, []);
  }
  static getYourProducts(userId: number) {
    const sql = `SELECT * FROM PRODUCT WHERE userId = ?`;
    return executeSqlDb(sql, [userId]);
  }
  static deleteProduct(productId: number, userId: number) {
    const sql = `DELETE FROM PRODUCT WHERE product_id = ? and userId = ?`;
    return executeSqlDb(sql, [productId, userId]);
  }
  static save(product: Product) {
    if (!product.getProductId) {
      throw new Error("No Product found");
    }
    const sql = `UPDATE PRODUCT SET title = ? , price = ? , imageUrl = ? , description = ? WHERE product_id = ? AND userId = ?`;
    return executeSqlDb(sql, [
      product.getTitle,
      product.getPrice,
      product.getImageUrl,
      product.getDescription,
      product.getProductId,
      product.getUserId,
    ]);
  }
  static create(product: Product) {
    const sql = `INSERT INTO PRODUCT(title,price,description,imageUrl,userId) VALUES(?,?,?,?,?)`;
    return executeSqlDb(sql, [
      product.getTitle,
      product.getPrice,
      product.getDescription,
      product.getImageUrl,
      product.getUserId,
    ]);
  }
}

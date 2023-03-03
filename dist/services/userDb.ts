import { saveSetting } from "../type/DB";
import executeSqlDb from "../util/query";

export default class UserDb {
  static findById(userId: string) {
    const sql = `SELECT * FROM USER WHERE user_id = ?`;
    return executeSqlDb(sql, [userId]);
  }
  static findByEmail(email: string) {
    const sql = `SELECT * FROM USER WHERE email = ?`;
    return executeSqlDb(sql, [email]);
  }
  static login(email: string, password: string) {
    const sql = `SELECT * FROM USER WHERE email = ? AND password = ?`;
    return executeSqlDb(sql, [email, password]);
  }
  static create(email: string, username: string, password: string) {
    const Usersql = `INSERT INTO USER (email,username,password) VALUES (?,?,?)`;
    return executeSqlDb(Usersql, [email, username, password]);
  }
  static saveOne(user_id: number, setting: saveSetting, value: string) {
    let sql;
    switch (setting) {
      case "email":
        sql = `UPDATE USER SET email = ? where user_id = ?`;
        break;
      case "username":
        sql = `UPDATE USER SET username = ? where user_id = ?`;
        break;
      case "password":
        sql = `UPDATE USER SET password = ? where user_id = ?`;
    }
    return executeSqlDb(sql, [user_id, value]);
  }
  static saveEverything(
    user_id: string,
    email: string,
    username: string,
    password: string
  ) {
    const sql = `UPDATE USER SET email = ?, username = ?, password = ? WHERE user_id = ?;`;
    return executeSqlDb(sql, [email, username, password, user_id]);
  }
}

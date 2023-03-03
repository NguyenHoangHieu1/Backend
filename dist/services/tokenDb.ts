import executeSqlDb from "../util/query";
export default class TokenDb {
  static create(token: string, userId: number, code?: number) {
    let sql;
    if (code) {
      sql = `INSERT INTO TOKEN(token,userId,activateNumber) VALUES(?,?,?)`;
      return executeSqlDb(sql, [token, userId, code]);
    } else {
      sql = `INSERT INTO TOKEN(token,userId) VALUES(?,?)`;
      return executeSqlDb(sql, [token, userId]);
    }
  }
  static findByToken(token: string) {
    const sql = `SELECT * FROM token where token = ?`;
    return executeSqlDb(sql, [token]);
  }
  static findByUserId(userId: number) {
    const sql = `SELECT * FROM token where userId= ?`;
    return executeSqlDb(sql, [userId]);
  }
  static removeByToken(token: string) {
    const sql = `DELETE FROM TOKEN WHERE token = ?`;
    return executeSqlDb(sql, [token]);
  }
}

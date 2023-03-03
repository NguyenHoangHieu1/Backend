import db from "../database/database";
export default function executeSqlDb(
  sql: string,
  property: (string | number)[] | []
) {
  return new Promise((resolve, reject) => {
    db.execute(sql, property, (err, result: any) => {
      if (err) reject(err);
      resolve(result);
    });
  });
}

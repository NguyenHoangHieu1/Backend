import mysql2 from "mysql2";

const db = mysql2.createPool({
  host: "localhost",
  database: "shopify",
  user: "root",
  password: "root",
});

export default db;

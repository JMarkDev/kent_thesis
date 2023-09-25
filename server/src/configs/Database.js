const mysql = require("mysql");
require("dotenv/config");
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
class Database {
  constructor() {
    this.connection = mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
    });
  }

  TestConnection() {
    this.connection.connect((err) => {
      if (err) return err;
      console.log("Database connected");
    });
  }
}

module.exports = Database;
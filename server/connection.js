const mysql2 = require("mysql2");
require("dotenv").config();

const db = mysql2.createConnection(
    {
        host: "localhost",
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: "employees_db",
    },
    console.log("Connected to employees_db database")
);

module.exports = db;
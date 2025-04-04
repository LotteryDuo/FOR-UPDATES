import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const masterDb = mysql.createPool({
  host: process.env.DB_MASTER_HOST || "mysql_master", // Ensure this matches your Docker service name
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root_password",
  database: process.env.DB_NAME || "mydb",
  waitForConnections: true,
  connectionLimit: 10, // Limit number of connections in the pool
  queueLimit: 0, // Unlimited queue length
});

const slaveDb = mysql.createPool({
  host: process.env.DB_SLAVE_HOST || "mysql_slave", // Ensure this matches your Docker service name
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root_password",
  database: process.env.DB_NAME || "mydb",
  waitForConnections: true,
  connectionLimit: 10, // Limit number of connections in the pool
  queueLimit: 0, // Unlimited queue length
});

export { masterDb, slaveDb };

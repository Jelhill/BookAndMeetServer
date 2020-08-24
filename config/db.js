const { Client } = require("pg");
require("dotenv").config();
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {rejectUnauthorized: false}
    // user: process.env.USER,
    // host: process.env.HOST,
    // database: process.env.DATABASE_NAME,
    // password: process.env.PASSWORD,
    // port: process.env.PORT,
    
})
client.connect()

module.exports = client;
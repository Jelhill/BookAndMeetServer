const { Client } = require("pg");
// require("dotenv").config();
console.log(process.env.DATABASE_URL)
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    // user: process.env.USER, 
    // host: process.env.HOST,
    // database: process.env.DATABASE_NAME,
    // password: process.env.PASSWORD,
    // port: process.env.PORT
})
client.connect()

module.exports = client;;
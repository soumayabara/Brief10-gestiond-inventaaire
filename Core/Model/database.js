const mysql = require('mysql');
require('dotenv').config()

const connection = mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "",
    database: "ginventaire2"
})
connection.connect((err) => {
    if (err) throw err
    console.log('Connection was established successfully :)')
});

module.exports = connection;
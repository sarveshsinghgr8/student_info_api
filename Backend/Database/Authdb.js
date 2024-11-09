const mysql = require('mysql');

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "sarvesh@2004S",
    database: "authdb"
});

con.connect((err)=>{
    if(err) throw err;
    console.log("authDB connected");
})

module.exports = con;
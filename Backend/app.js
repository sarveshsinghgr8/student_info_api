const express = require("express");
const app = express();
const mysql = require("mysql");
const dotenv = require('dotenv');
const adminRouter = require('./Router/admin');
const con = require("./Database/database");
const cookieParser = require("cookie-parser");

dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use('/admin',adminRouter);

app.listen(8000,()=>{
    console.log("App listening at PORT 8000");
});

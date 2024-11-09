const mysql = require('mysql');
const jwt = require("jsonwebtoken");
const config = require("config");

const allAuth = (req,res,next) => {
    const token = req.cookies.jwt;
    if(!token){
        return res.status(404).status("LOGIN FIRST");
    }
    try{
        const decoded = jwt.verify(token, config.get("jwtsecret"));
        req.user = decoded;
        next();
    }catch(err){
        return res.status(404).send("Unauthorised User");
    }

}

module.exports = allAuth;




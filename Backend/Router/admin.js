const express = require('express');
const router = express.Router();
const con = require('../Database/database');
const jwt = require("jsonwebtoken");
const con1 = require('../Database/Authdb');
const config = require("config");
const allAuth = require("../Middlewares/allAuth");
const adminController = require("../Controllers/adminController");

router.post("/signup",adminController.signup);
router.post("/login", adminController.login);
router.get("/allStudent",allAuth,adminController.allStudent);
router.post("/addStudent",allAuth, adminController.addStudent);
router.get("/student/:rollno",allAuth,adminController.student_rollno);
router.delete('/removeUser/:rollno',allAuth,adminController.remove_user);
router.put('/updateUser/:rollno', allAuth,adminController.updateUser);

module.exports = router;
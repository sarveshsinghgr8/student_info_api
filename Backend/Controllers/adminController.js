const con = require("../Database/database");
const con1 = require("../Database/Authdb");
const jwt = require("jsonwebtoken");
const config = require("config");

module.exports.signup = (req,res)=>{
    const data = req.body;
    const sql = "SELECT * FROM authData WHERE username = ? AND passwd = ?";
    con1.query(sql,[data.username,data.passwd],(err,result)=>{
        if(err){

        }
        if(result.length>0){
            res.status(404).send("USER ALREADY EXSIST");
        }
        const sql1 = "INSERT INTO authData (username,passwd) VALUES (?,?)"
        con1.query(sql1,[data.username,data.passwd],(err,result)=>{
            res.status(200).send("ADMIN UPDATED SUCCESSFULLY")
        });
    });

};
module.exports.login = (req, res) => {
    const data = req.body;
    const sql = "SELECT * FROM authData WHERE username = ? AND passwd = ?";
    
    con1.query(sql, [data.username, data.passwd], (err, result) => {
        if (err) {
            console.error("Database query error:", err);
            return res.status(500).send("An error occurred while processing your request.");
        }
        
        if (result.length > 0) {
            const user = result[0];
            const token = jwt.sign({ id: user.id }, config.get("jwtsecret"), { expiresIn: "1h" });
            
            res.cookie("jwt", token, { httpOnly: true, maxAge: 3600000 });
            res.redirect("/admin/allStudent");
        } else {
            res.status(404).send("USER NOT AUTHORISED");
        }
    });
};

module.exports.allStudent = (req,res)=>{
    con.query("select * from student;", (err,result) => {
        if(err){
            console.log(err);
            return;
        }
        res.status(200).send(result);
    });
  };

  module.exports.addStudent = (req, res) => {
    const data = req.body;
    const sql1 = `SELECT * From student where roll_no = ?`;
    con.query(sql1, [data.rollno], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Database error");
        }
        if (result.length > 0) {
            return res.status(409).send("USER WITH SAME ROLL NO ALREADY EXISTS");
        }
        const sql = `INSERT INTO student (fname, lname, roll_no, joining_year, end_year) VALUES (?, ?, ?, ?, ?)`;
    
        con.query(sql, [data.fname, data.lname, data.rollno, data.joining_year, data.end_year], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Database insertion error" });
            }
    
            const table = `SELECT * FROM student`;
            con.query(table, (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: "Error fetching data" });
                }
    
                res.status(200).json(result);
            });
        });
    });
};

module.exports.student_rollno = (req,res)=>{
    const roll_no = req.params.rollno;
    const sql = `select * from student where roll_no = ?`
    con.query(sql,[roll_no],(err,result)=>{
        if(err){
            return;
        }
        else{
            res.status(200).send(result);
        }
    });
};

module.exports.remove_user =  (req, res) => {
    const rollno = req.params.rollno;
    const sql1 = `SELECT * FROM student WHERE roll_no = ?`;
    con.query(sql1, [rollno], (err, result) => {
        if (err) {
            console.error("Error executing query:", err);
            res.status(500).send("An error occurred while retrieving data.");
            return;
        }
        if (result.length > 0) {
            const sql2 = `DELETE FROM student WHERE roll_no = ?`;
            con.query(sql2, [rollno], (err, result) => {
                if (err) {
                    console.error("Error executing delete query:", err);
                    res.status(500).send("An error occurred while deleting the user.");
                    return;
                }
                res.status(200).send("User has been deleted successfully.");
            });
        } else {
            res.status(404).send("User not found.");
        }
    });
};

module.exports.updateUser = (req, res) => {
    const rollno = req.params.rollno;
    const sql = "SELECT * FROM student WHERE roll_no = ?";
    
    con.query(sql, [rollno], (err, result) => {
        if (err) {
            return res.status(500).send("Error fetching student data");
        }
        
        if (result.length > 0) {
            const sqlUpdate = "UPDATE student SET fname = ?, lname = ?, roll_no = ?, joining_year = ?, end_year = ? WHERE roll_no = ?";
            const { fname, lname, rollno, joining_year, end_year } = req.body;
            
            con.query(sqlUpdate, [fname, lname, rollno, joining_year, end_year, rollno], (err, result) => {
                if (err) {
                    return res.status(500).send("Error updating student data");
                } else {
                    res.status(200).send("UPDATE SUCCESSFUL");
                }
            });
        } else {
            res.status(404).send("Student not found");
        }
    });
};
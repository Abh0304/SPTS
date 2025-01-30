const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "NewPassword",
    database: "transitx"
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed: " + err.stack);
        return;
    }
    console.log("Connected to MySQL Database");
});

// API Route to Handle Registration
app.post("/register", (req, res) => {
    const { username, mobile, email, password } = req.body;
    
    const sql = "INSERT INTO users (username, mobile, email, password) VALUES (?, ?, ?, ?)";
    
    db.query(sql, [username, mobile, email, password], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Database Error: " + err.message });
        }
        res.json({ message: "Registration Successful!" });
    });
});

// Start the Server
app.listen(5501, () => {
    console.log("Server running on http://localhost:5501");
});

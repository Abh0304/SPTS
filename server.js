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

// API Route to Handle User Registration
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

// API Route to Handle User Login
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    const sql = "SELECT * FROM users WHERE username = ?";
    
    db.query(sql, [username], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }

        if (results.length === 0 || results[0].password !== password) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        res.json({
            message: "Login successful",
            user: {
                id: results[0].id,
                username: results[0].username
            }
        });
    });
});

// API to Fetch Trains Between Selected Stations
app.get("/trains", (req, res) => {
    const { from, to } = req.query;

    if (!from || !to) {
        return res.status(400).json({ message: "Missing FROM or TO parameter" });
    }

    const sql = "SELECT * FROM trains WHERE source = ? AND destination = ?";
    
    db.query(sql, [from, to], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
        res.json(results);
    });
});

// API to Fetch Buses Between Selected Stations
app.get("/buses", (req, res) => {
    const { from, to } = req.query;

    if (!from || !to) {
        return res.status(400).json({ message: "Missing FROM or TO parameter" });
    }

    const sql = "SELECT * FROM buses WHERE source = ? AND destination = ?";
    
    db.query(sql, [from, to], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
        res.json(results);
    });
});

// Start the Server
app.listen(5510, () => {
    console.log("Server running on http://localhost:5510");
});

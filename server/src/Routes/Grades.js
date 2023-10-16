const express = require("express");
const Database = require("../configs/Database");
const router = express.Router();

router.get("/fetch", async (req, res) => {
    const db = new Database();
    const conn = db.connection;
    
    const query = "SELECT * FROM grades";
    await conn.connect((err) => {
        if (err) throw err;
        conn.query(query, (err, result) => {
            if(err) throw err;
            res.json(result)
        })
    })
})

router.post('/add', async (req, res) => {
    const db = new Database();
    const conn = db.connection;

    const {   
        math,
        science,
        english,
        mapeh,
        tle,
        arpan,
        filipino,
        ict,
        esp } = req.body;
    const query = "INSERT INTO grades (math, science, english, mapeh, tle, arpan, filipino, ict, esp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [
        math,
        science,
        english,
        mapeh,
        tle,
        arpan,
        filipino,
        ict,
        esp
    ];
    await conn.connect((err) => {
        if (err) throw err;
        conn.query(query, values, (err, result) => {
            if(err) throw err;
            res.json({ data: "Grade added successfully" });
        })
    })
})

module.exports = router;
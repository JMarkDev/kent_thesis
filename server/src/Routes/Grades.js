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

router.get('/:id', async (req, res) => {
    const db = new Database();
    const conn = db.connection;

    const query = "SELECT * FROM grades WHERE studentId = ?";
    const values = [req.params.id];
    await conn.connect((err) => {
        if (err) throw err;
        conn.query(query, values, (err, result) => {
            if(err) throw err;
            res.json(result)
        })
    })
})

router.post('/add', async (req, res) => {
    const db = new Database();
    const conn = db.connection;

    const {
        studentId,   
        math,
        science,
        english,
        mapeh,
        arpan,
        filipino,
        esp,
        average,
        course,
    } = req.body;
    console.log('Received data:', req.body);
    const query = "INSERT INTO grades (studentId, math, science, english, mapeh, arpan, filipino, esp, average, course) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [
        studentId,
        math,
        science,
        english,
        mapeh,
        arpan,
        filipino,
        esp,
        average,
        course
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
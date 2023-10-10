const express = require("express");
const Database = require("../configs/Database");
const router = express.Router();

router.get("/strand", async (req, res) => {
    const db = new Database();
    const conn = db.connection;
    
    const query = `
        SELECT strand
        FROM course
        WHERE title = ?;
    `;
    await conn.connect((err) => {
        if (err) throw err;
        conn.query(query, [req.query.title], (err, result) => {
            if(err) throw err;
            res.json(result);
        });
    });
});

module.exports = router;

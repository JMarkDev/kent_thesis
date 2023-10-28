const express = require("express");
const Database = require("../configs/Database");
const router = express.Router();

router.get('/fetch/all', async (req, res) => {
    const db = new Database();
    const conn = db.connection;
  
    const query = "SELECT * FROM register WHERE recommended IS NOT NULL"; // Adjust the condition as needed
  
    try {
      await conn.connect();
  
      conn.query(query, (error, rows) => {
        if (error) throw error;
        res.json(rows);
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    } finally {
      conn.end();
    }
  });
  

router.get("/fetch/:recommended", async (req, res) => {
    const db = new Database();
    const conn = db.connection;
    
    const recommended = req.params.recommended; // Extract the recommended parameter from the URL

    // Construct your SQL query based on the recommended parameter
    let query = "SELECT * FROM register";
    
    if (recommended) {
        query += ` WHERE recommended = ?`;
    }

    conn.connect((err) => {
        if (err) throw err;
        
        conn.query(query, [recommended], (err, result) => {
            if (err) throw err;
            res.json(result);
        });
    });
});

module.exports = router;
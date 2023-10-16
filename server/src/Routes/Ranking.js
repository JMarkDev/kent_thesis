const express = require("express");
const Database = require("../configs/Database");
const router = express.Router();

router.get("/fetch", async (req, res) => {
    const db = new Database();
    const conn = db.connection;
    
    const query = "SELECT * FROM ranking";
    await conn.connect((err) => {
        if (err) throw err;
        conn.query(query, (err, result) => {
            if(err) throw err;
            res.json(result)
        })
    })
});

router.get('/:id', async (req, res) => {
    const db = new Database();
    const conn = db.connection;
    
    const query = "SELECT * FROM ranking WHERE studentId = ?";
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

    const { studentId, strandRanking } = req.body;
  
  // Check if a record exists for the student ID
  const queryCheck = "SELECT * FROM ranking WHERE studentId = ? LIMIT 1";
  const checkValues = [studentId];
  
  conn.query(queryCheck, checkValues, (err, result) => {
    if (err) {
      throw err;
    }
    
    if (result.length > 0) {
      // Update the existing record
      const queryUpdate = "UPDATE ranking SET strandRanking = ? WHERE studentId = ?";
      const updateValues = [strandRanking, studentId];
      
      conn.query(queryUpdate, updateValues, (err, updateResult) => {
        if (err) {
          throw err;
        }
        res.json({ data: "Rank updated successfully" });
      });
    } else {
      // Create a new record
      const queryInsert = "INSERT INTO ranking (studentId, strandRanking) VALUES (?, ?)";
      const insertValues = [studentId, strandRanking];
      
      conn.query(queryInsert, insertValues, (err, insertResult) => {
        if (err) {
          throw err;
        }
        res.json({ data: "Rank added successfully" });
      });
    }
  });
});



module.exports = router;
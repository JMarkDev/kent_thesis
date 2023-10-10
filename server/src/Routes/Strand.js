const express = require("express");
const Database = require("../configs/Database");
const router = express.Router();

router.get("/fetch", async (req, res) => {
    const db = new Database();
    const conn = db.connection;
    
    const query = "SELECT * FROM strand";
    await conn.connect((err) => {
        if (err) throw err;
        conn.query(query, (err, result) => {
            if(err) throw err;
            res.json(result)
        })
    })
});

// router.post("/add", async (req, res) => {
//     const db = new Database();
//     const conn = db.connection;
//     const { name, description } = req.body; // Remove 'value' from here
  
//     const query = "INSERT INTO strand (name, description) VALUES (?, ?)"; // Remove 'value' from the query
//     const values = [name, description];
    
//     await conn.connect((err) => {
//       if (err) throw err;
//       conn.query(query, values, (err, result) => {
//         if (err) throw err;
//         res.json({ data: "Strand added successfully" });
//       });
//     });
//   });
  

router.get("/fetch/:id", async (req, res) => {
    const db = new Database();
    const conn = db.connection;
    const { id } = req.params;
    
    const query = "SELECT * FROM strand WHERE id = ?";
    const values = [id];
    await conn.connect((err) => {
        if (err) throw err;
        conn.query(query, values, (err, result) => {
            if(err) throw err;
            res.json(result[0])
        })
    })
});

router.put("/edit/:id", async (req, res) => {
  const db = new Database();
  const conn = db.connection;
  
  const { id } = req.params;
  const { name, description, value } = req.body;

  const titleCheckQuery = `SELECT * FROM strand WHERE name = ? AND id != ?`;
  const titleCheckValues = [name, id];

  conn.query(titleCheckQuery, titleCheckValues, (titleCheckErr, titleCheckResult) => {
    if (titleCheckErr) {
      // Handle the error
      console.error(titleCheckErr);
      res.status(500).json({ Error: 'Database error' });
      return;
    }

    if (titleCheckResult.length > 0) {
      res.status(400).json({ Error: 'Title already exists' });
      return;
    }

    const updateQuery = "UPDATE strand SET name = ?, description = ?, value = ? WHERE id = ?";
    const updateValues = [name, description, value, id];

    conn.query(updateQuery, updateValues, (updateErr, updateResult) => {
      if (updateErr) {
        // Handle the error
        console.error(updateErr);
        res.status(500).json({ Error: 'Database error' });
        return;
      }

      res.json({ data: "Strand updated successfully" });
    });
  });
});


router.delete('/delete/:id', async (req, res) => {
    const db = new Database();
    const conn = db.connection;
  
    const { id } = req.params;
    const query = "DELETE FROM strand WHERE id = ?";
  
    try {
      await conn.connect();
  
      conn.query(query, id, (error, result) => {
        if (error) throw error;
        console.log(result);
        res.json(result);
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    } finally {
      conn.end();
    }
  });

module.exports = router;
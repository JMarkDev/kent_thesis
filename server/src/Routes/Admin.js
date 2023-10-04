const express = require("express");
const Database = require("../configs/Database");
const router = express.Router();
const bcrypt = require("bcrypt");
const salt = 5;

router.get("/fetch", async (req, res) => {
    const db = new Database();
    const conn = db.connection;
  
    // Modify the SQL query to filter based on the user's role
    let query = "SELECT * FROM admin";
  
    try {
      await conn.connect();
  
      conn.query(query, (err, result) => {
        if (err) throw err;
        res.json(result);
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    } finally {
      conn.end();
    }
  });
  
  router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const db = new Database();
    const conn = db.connection;
    const query = "SELECT * FROM admin WHERE id = ?";
  
    try {
      await conn.connect();
  
      conn.query(query, [id], (error, rows) => {
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

  router.put('/update/:id', async (req, res) => {
    const db = new Database();
    const conn = db.connection;
  
    try {
      const { id } = req.params;
      const { name, username, password, gender, role } = req.body;
  
      if (!name || !username || !password || !role || !gender) {
        return res.status(400).json({ Error: "Missing required fields" });
      }
  
      // Check if the username already exists
      const usernameExists = await new Promise((resolve, reject) => {
        const checkQuery = 'SELECT COUNT(*) as count FROM admin WHERE username = ?';
        conn.query(checkQuery, [username], (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result && result[0] && result[0].count > 0);
          }
        });
      }).catch(error => {
        console.error('Promise rejected:', error);
        throw error;
      });
  
      if (usernameExists) {
        return res.status(400).json({ Error: "Username already exists" });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const query = "UPDATE admin SET name = ?, username = ?, password = ?, gender = ?  WHERE id = ?";
      const values = [
        name,
        username,
        hashedPassword,
        gender,
        id
      ];
  
      conn.query(query, values, (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).json({ message: 'Internal server error' });
        } else {
          console.log(result);
          res.json({ message: "Admin updated successfully" });
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    } finally {
      // Close the database connection here, after the query is executed
      conn.end();
    }
  });

  router.delete('/delete/:id', async (req, res) => {
    const db = new Database();
    const conn = db.connection;
  
    const { id } = req.params;
    const query = "DELETE FROM admin WHERE id = ?";
  
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
  

  // Search route
router.get("/search/:name", async (req, res) => {
    const { name } = req.params;
    const db = new Database();
    const conn = db.connection;
    const query = "SELECT * FROM admin WHERE Name LIKE ?";
  
    try {
      await conn.connect();
  
      conn.query(query, [`%${name}%`], (error, rows) => {
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


  
module.exports = router;
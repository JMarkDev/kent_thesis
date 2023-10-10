const express = require("express");
const app = express();
const Database = require("../configs/Database");
const router = express.Router();
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser'); // Import body-parser
const fs = require('fs'); // Import the filesystem module
const storage = multer.memoryStorage(); // Store the image data in memory

const upload = multer({ storage: storage });

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json()); // Enable JSON parsing
router.use('/server/uploads', express.static(__dirname + '/../../uploads'));

router.get("/fetch", async(req, res) => {
    const db = new Database();
    const conn = db.connection

    const query = "SELECT * FROM course";

    await conn.connect((err) => {
        if (err) throw err;
        conn.query(query, (err, result) => {
            if(err) throw err;
            res.json(result)
        })
    }

    )
});

// Define a route to fetch courses by strand
router.get('/fetch/:strand', async (req, res) => {
    const db = new Database();
    const conn = db.connection;

    const { strand } = req.params;
    
    const query = "SELECT * FROM course WHERE strand = ?";

    try {
        await conn.connect();
        conn.query(query, [strand], (err, result) => {
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


router.get('/:id', async (req, res) => {
    const db = new Database();
    const conn = db.connection;

    const query = "SELECT * FROM course WHERE id = ?";

    try {
        await conn.connect();
        conn.query(query, [req.params.id], (err, result) => {
            if (err) throw err;
            res.json(result);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        conn.end();
    }
})
router.delete('/delete/:id', async (req, res) => {
    const db = new Database(); // Replace with your database setup
    const conn = db.connection; // Replace with your database connection setup
  
    const { id } = req.params;
    const query = "DELETE FROM course WHERE id = ?";
  
    try {
      await conn.connect();
  
      conn.query(query, [id], (error, result) => {
        if (error) {
          console.error(error);
          res.status(500).json({ message: 'Internal server error' });
        } else {
            res.json({ success: true, message: 'Course deleted successfully' });
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    } finally {
      conn.end(); // Don't forget to close the connection
    }
  });




module.exports = router;

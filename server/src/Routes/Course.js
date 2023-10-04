const express = require("express");
const Database = require("../configs/Database");
const router = express.Router();
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser'); // Import body-parser
const fs = require('fs'); // Import the filesystem module
const storage = multer.memoryStorage(); // Store the image data in memory

const upload = multer({ storage: storage });

// Use body-parser to parse form fields
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json()); // Enable JSON parsing

router.get('/fetch', async (req, res) => {
    const db = new Database();
    const conn = db.connection;

    const query = "SELECT * FROM course";

    try {
        await conn.connect();
        conn.query(query, (err, result) => {
            if (err) throw err;

            // Convert the image filename to a full URL
            const dataWithImageURL = result.map((row) => {
                if (row.image) {
                    row.image = `/server/uploads/${row.image}`;
                }
                return row;
            });

            res.json(dataWithImageURL);
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

router.get('/upload', (req, res) => {
  res.render("upload");
});

router.post('/upload', upload.single('image'), async (req, res) => {
    const db = new Database();
    const conn = db.connection;
  
    // Check if the `req.file` object is undefined
if (!req.file) {
    // Handle the error
    return res.status(400).json({ error: "No file was uploaded" });
  }
  
  // Destructure the `req.file` object
  const { originalname, buffer } = req.file;
  
    const { title, description, strand } = req.body; // Get other form data
  
    // Save the image file to a folder on your server
    const imagePath = path.join(__dirname, '../../uploads', originalname);
    fs.writeFile(imagePath, buffer, (err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "An error occurred while saving the image" });
            return;
        }
  
        // Insert the file path (or filename) into the database
        const query = "INSERT INTO course (image, title, description, strand) VALUES (?, ?, ?, ?)";
        const values = [originalname, title, description, strand]; // Store the file path or filename
      
        conn.query(query, values, (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: "An error occurred while adding the course" });
            } else {
                res.json({ data: "Course added successfully" });
            }
        });
    });
});

router.put('/update/:id', upload.single('image'), async (req, res) => {
    const db = new Database();
    const conn = db.connection;

    const { id } = req.params;
    const { title, description, strand } = req.body;
    let newImageFilename = null;

    if (req.file && req.file.originalname) {
        const { originalname, buffer } = req.file;
        const imagePath = path.join(__dirname, '../../uploads', originalname);
        fs.writeFile(imagePath, buffer, (err) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: "An error occurred while saving the image" });
                return;
            }
            newImageFilename = originalname;
        });
    }

    let query;
    let values;

    if (newImageFilename) {
        query = "UPDATE course SET image = ?, title = ?, description = ?, strand = ? WHERE id = ?";
        values = [newImageFilename, title, description, strand, id];
    } else {
        query = "UPDATE course SET title = ?, description = ?, strand = ? WHERE id = ?";
        values = [title, description, strand, id];
    }

    try {
        await conn.connect();

        conn.query(query, values, (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: "An error occurred while updating the course" });
            } else {
                console.log("Course updated successfully");
                res.json({ data: "Course updated successfully" });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        conn.end();
    }
});

router.delete('/delete/:id', async (req, res) => {
    const db = new Database();
    const conn = db.connection;

    const { id } = req.params;
    const query = "DELETE FROM course WHERE id = ?";

    try {
        await conn.connect();

        conn.query(query, [id], (error, result) => { // Wrap id in an array
            if (error) {
                console.error(error);
                res.status(500).json({ message: 'Internal server error' });
            } else {
                console.log(result);
                res.json(result);
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
})




module.exports = router;

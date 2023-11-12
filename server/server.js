const express = require("express");
const Database = require("./src/configs/Database");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const salt = 5;
const app = express();
const bodyParser = require('body-parser');
const date = require('date-and-time');
const studentsRoute = require("./src/Routes/Students.js")
const courseRoute = require("./src/Routes/Course.js")
const strandRoute = require("./src/Routes/Strand.js")
const recommendedRoute = require("./src/Routes/Recommended.js")
const rankingRoute = require("./src/Routes/Ranking.js")
const gradesRoute = require("./src/Routes/Grades.js")
const filteredRecommendedRoute = require("./src/Routes/FilterRecommeded.js")

app.use(cors({
  origin: "http://localhost:3000",
  methods: ["POST", "GET", "DELETE", "PUT"],
  credentials: true
}));

app.use(express.json())
app.use('/students', studentsRoute);
app.use('/course', courseRoute);
app.use('/strand', strandRoute);
app.use('/recommended', recommendedRoute);
app.use('/rank', rankingRoute);
app.use('/grades', gradesRoute);
app.use('/filter', filteredRecommendedRoute);

app.use(cookieParser());

require('dotenv/config');
const multer = require('multer');
const fs = require('fs');
const upload = multer({ dest: './uploads' });

app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

app.get('/uploads/:filename', (req, res) => {
  const filename = req.params.filename;
  res.sendFile(`${__dirname}/uploads/${filename}`);
});

app.post("/strand/add", upload.array('image', 5), async (req, res) => {
  const imageFileNames = [];

  for (const file of req.files) {
    let fileType = file.mimetype.split('/')[1];
    let newFileName = file.filename + '.' + fileType;

    fs.rename(`./uploads/${file.filename}`, `./uploads/${newFileName}`, function (err) {
      if (err) {
        console.error('Error renaming file:', err);
        res.status(500).json({ Error: 'File upload error' });
        return;
      }
      console.log('Uploaded Success');
    });

    imageFileNames.push(newFileName);
  }

  const db = new Database();
  const conn = db.connection;
  const { name, description, recommendationConditions } = req.body;

  const checkNameExist = "SELECT COUNT(*) AS count FROM strand WHERE name = ?";
  const checkNameValues = [name];

  conn.query(checkNameExist, checkNameValues, (err, result) => {
    if (err) {
      console.error('Error checking name existence:', err);
      res.status(500).json({ Error: 'Database error' });
      return;
    }

    if (result[0].count > 0) {
      res.status(400).json({ Error: 'Strand name already exists' });
    } else {
      const query = "INSERT INTO strand (image, name, description, recommendationConditions, createdAt) VALUES (?, ?, ?, ?, ?)";
      const createdAt = new Date()
      const formattedDate = date.format(createdAt, 'YY/MM/DD HH:mm:ss');
      
      const values = [
        imageFileNames.join(','),
        name,
        description,
        recommendationConditions,
        formattedDate
      ];

      conn.query(query, values, (err, result) => {
        if (err) {
          console.error('Error inserting data:', err);
          res.status(500).json({ Error: 'Database error' });
          return;
        }
        res.json({ data: "Strand added successfully" });
      });
    }
  });
});

app.put("/strand/edit/:id", upload.array('image', 5), async (req, res) => {
  const db = new Database();
  const conn = db.connection;

  let imageFilenames = [];
  if (req.body.image) {
    try {
      imageFilenames = JSON.parse(req.body.image);
    } catch (error) {
      console.error('Error parsing JSON:', error);
    }
  }

  // Move file renaming into a function to avoid duplication
  async function renameFile(file) {
    return new Promise((resolve, reject) => {
      const fileType = file.mimetype.split('/')[1];
      const newFileName = file.filename + '.' + fileType;

      fs.rename(`./uploads/${file.filename}`, `./uploads/${newFileName}`, (err) => {
        if (err) {
          console.error('Error renaming file:', err);
          reject(err);
        } else {
          console.log('Uploaded Success');
          resolve(newFileName);
        }
      });
    });
  }

  try {
    // Rename files asynchronously and collect their names
    for (const imageName of imageFilenames) {
      const file = req.files.find((f) => f.originalname === imageName);

      if (file) {
        const newFileName = await renameFile(file);
        imageFilenames.push(newFileName);
      }
    }

    const { id } = req.params; 
    const { name, description, recommendationConditions } = req.body;

    const query = "UPDATE strand SET name = ?, description = ?, image = ?, recommendationConditions = ?, updatedAt = ? WHERE id = ?";
    const updatedAt = new Date();
    const formattedDate = date.format(updatedAt, 'YY/MM/DD HH:mm:ss');

    const values = [
      name,
      description,
      imageFilenames.join(','),
      recommendationConditions,
      formattedDate, 
      id
    ];

    conn.query(query, values, (err, result) => {
      if (err) {
        console.error('Error updating data:', err);
        res.status(500).json({ Error: 'Database error' });
        return;
      }
      res.json({ data: "Strand updated successfully" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ Error: 'Internal Server Error' });
  }
});



app.post('/course/upload', upload.single('image'), async (req, res) => {
  let fileType = req.file.mimetype.split('/')[1];
  let newFileName = req.file.filename + '.' + fileType;
  fs.rename(`./uploads/${req.file.filename}`, `./uploads/${newFileName}`, function (err) {
    if (err) throw err;
    console.log('Uploaded Success');
  });
  const db = new Database();
  const conn = db.connection;

  const { title, description, image, strand } = req.body;
  const query ='INSERT INTO course (title, description, image, strand, createdAt) VALUES (?,?,?,?,?)';

  const createdAt = new Date();
  const formattedDate = date.format(createdAt, 'YY/MM/DD HH:mm:ss');

  const values = [
    title,
    description,
    `uploads/${newFileName}`,
    strand,
    formattedDate
  ];

  await conn.connect((err) => {
    if (err) throw err;
    conn.query(query, values, (err, result) => {
      if (err) throw err;
      console.log(result);
      res.json({ data: 'Course added successfully' });
    });
  });
});

app.put('/course/edit/:id', upload.single('image'), async (req, res) => {
  let fileType = req.file.mimetype.split('/')[1];
  let newFileName = req.file.filename + '.' + fileType;
  fs.rename(`./uploads/${req.file.filename}`, `./uploads/${newFileName}`, function (err) {
    if (err) throw err;
    console.log('Uploaded Success');
  });
  const db = new Database();
  const conn = db.connection;

  const { id } = req.params;
  const { title, image, description, strand } = req.body;

  const titleCheckQuery = `SELECT * FROM course WHERE title = ? AND id != ?`;
  const titleCheckValues = [title, id];

  conn.query(titleCheckQuery, titleCheckValues, (titleCheckErr, titleCheckResult) => {
    if (titleCheckErr) {
      throw titleCheckErr;
    }

    if (titleCheckResult.length > 0) {
      res.status(400).json({ Error: 'Title already exists' });
    } else {
      const query = `UPDATE course SET image = 'uploads/${newFileName}', title = ?, description = ?, strand = ?, updatedAt = ? WHERE id = ?`;
      const updatedAt = new Date();
      const formattedDate = date.format(updatedAt, 'YY/MM/DD HH:mm:ss');

      const values = [title, description, strand, formattedDate, id];

      conn.query(query, values, (err, result) => {
        if (err) {
          throw err;
        }
        console.log(result);
        res.json({ data: 'Course updated successfully' });
      });
    }
  });
});


const db = new Database();
const conn = db.connection;

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ Error: "You are not authenticated" });
  } else {
    jwt.verify(token, "jwt-secret-key", (err, decoded) => {
      if (err) {
        return res.json({ Error: "Token is not valid" });
      } else {
        req.name = decoded.name;
        next();
      }
    });
  }
};

app.get('/', verifyUser,(req, res) => {
  return res.json({ Status: "Success", name: req.name });
});

app.post('/register', async (req, res) => {
  const { name, username, password, role, gender } = req.body;

  try {
    if (!name || !username || !password || !role || !gender) {
      return res.status(400).json({ status: "error", message: "Missing required fields" });
    }  

    const usernameExists = await new Promise((resolve, reject) => {
      const checkQuery = `
        SELECT COUNT(*) as count FROM register WHERE username = ?
        UNION
        SELECT COUNT(*) as count FROM admin WHERE username = ?
      `;
      conn.query(checkQuery, [username, username], (err, results) => {
        if (err) reject(err);
    
        const exists = results.some((result) => result.count > 0);
        resolve(exists);
      });
    }).catch((error) => {
      console.error('Promise rejected:', error);
      throw error;
    });
    
    if (usernameExists) {
      return res.status(400).json({ status: "error", message: "Username already exists. Please choose a different username." });
    }
    
    const hashedPassword = await bcrypt.hash(password, salt);

    const insertQuery = 'INSERT INTO register (name, username, password, role, gender, createdAt) VALUES (?, ?, ?, ?, ?, ?)';
    const createdAt = new Date();
    const formattedDate = date.format(createdAt, 'YY/MM/DD HH:mm:ss');

    const values = [name, username, hashedPassword, role, gender, formattedDate];
    
    conn.query(insertQuery, values, (err, result) => {
      if (err) {
        console.error("Error inserting user:", err);
        return res.status(500).json({ status: "error", message: "Failed to insert user" });
      }
      const token = jwt.sign({ username }, 'your-secret-key', { expiresIn: '1d' });

      return res.json({ status: "success", message: "Registration successful"});      
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ status: "error", message: "Registration process failed" });
  }
});

app.post('/login', (req, res) => {
  const sql = 'SELECT * FROM register WHERE username = ?';
  conn.query(sql, [req.body.username], (err, data) => {
    if (err) {
      return res.status(500).json({ Error: "Login error in server" });
    }
    if (data.length > 0) {
      bcrypt.compare(req.body.password.toString(), data[0].password, (err, response) => {
        if (err) {
          return res.status(500).json({ Error: "Password compare error" });
        }
        if (response) {
          const name = data[0].name;
          const role = data[0].role;
          const userId = data[0].id;
          const token = jwt.sign({ name, role, userId }, "jwt-secret-key", { expiresIn: '1d' });
          res.cookie('token', token, { httpOnly: true }); // Set the token as an HTTP-only cookie for added security
          return res.json({ Status: "Login Successful", role, userId });
        } else {
          return res.json({ Error: "Password error!" });
        }
      });
    } else {
      return res.json({ Error: "Invalid username or password!" });
    }
  });
});


app.get('/logout', (req, res) => {
 res.clearCookie('token');
 return res.json({Status: "Success"});
})


app.listen(3001, function () {
  const db = new Database();
  db.TestConnection();
  console.log("Server is up and running at http://localhost:3001");
});
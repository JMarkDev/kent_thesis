const express = require("express");
const Database = require("./src/configs/Database");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const salt = 5;
const app = express();
const bodyParser = require('body-parser');
const studentsRoute = require("./src/Routes/Students.js")
const courseRoute = require("./src/Routes/Course.js")

app.use(express.json())

app.use(cors({
  origin: "http://localhost:3000",
  methods: ["POST", "GET", "DELETE", "PUT"],
  credentials: true
}));

app.use('/students', studentsRoute);
app.use('/course', courseRoute);

app.use(cookieParser());

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
    // Validate incoming data
    if (!name || !username || !password || !role || !gender) {
      return res.status(400).json({ status: "error", message: "Missing required fields" });
    }  

    // Check if the username already exists
    const usernameExists = await new Promise((resolve, reject) => {
      const checkQuery = `
        SELECT COUNT(*) as count FROM register WHERE username = ?
        UNION
        SELECT COUNT(*) as count FROM admin WHERE username = ?
      `;
      conn.query(checkQuery, [username, username], (err, results) => {
        if (err) reject(err);
    
        // Check if the count is greater than 0 in any of the results
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
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user into the database
    const insertQuery = 'INSERT INTO register (name, username, password, role, gender) VALUES (?, ?, ?, ?, ?)';
    const values = [name, username, hashedPassword, role, gender];
    
    conn.query(insertQuery, values, (err, result) => {
      if (err) {
        console.error("Error inserting user:", err);
        return res.status(500).json({ status: "error", message: "Failed to insert user" });
      }
      return res.json({ status: "success", message: "Registration successful" });
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ status: "error", message: "Registration process failed" });
  }
});

app.post('/login', (req, res) => {
  const sql = 'SELECT * FROM register WHERE username = ?';
  conn.query(sql, [req.body.username], (err, data) => {
    if(err) return res.json({Error: "Login error in server"})
    if(data.length > 0) {
        bcrypt.compare(req.body.password.toString(), data[0].password, (err, response) => {
          if(err) return res.json({Error:"Password compare error"})
            if(response) {
              const name = data[0].name;
              const role = data[0].role;
              const token = jwt.sign({ name, role }, "jwt-secret-key", { expiresIn: '1d' });
              res.cookie('token', token);
              return res.json({Status: "Login Successful", role})
            } else {
              return res.json({Error: "Password error!"});
            }
        })
    } else {
      return res.json({Error: "Invalid username or password!"})
    }
  })
})

app.get('/logout', (req, res) => {
 res.clearCookie('token');
 return res.json({Status: "Success"});
})


app.listen(3001, function () {
  const db = new Database();
  db.TestConnection();
  console.log("Server is up and running at http://localhost:3001");
});
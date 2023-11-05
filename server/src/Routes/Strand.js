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

router.get('/recommendation-conditions/all', async (req, res) => {
  const db = new Database();
  const conn = db.connection;

  const query = "SELECT name, recommendationConditions FROM strand";
  const values = [];

  try {
    await conn.connect((err) => {
      if (err) throw err;
      conn.query(query, values, (err, result) => {
        if (err) throw err;
        const strandConditions = {};
        result.forEach(row => {
          const { name, recommendationConditions } = row;
          const conditions = JSON.parse(recommendationConditions);
          strandConditions[name] = conditions;
        });
        res.json(strandConditions);
      });
    })
  }
  catch (error) {
    console.error('Error connecting to database:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
    return;
  }

}); 

router.get('/recommendation-conditions/:strand', async (req, res) => {
  const db = new Database();
  const conn = db.connection;

  const { strand } = req.params;
  const query = "SELECT recommendationConditions FROM strand WHERE name = ?";
  const values = [strand];

  try {
    await conn.connect((err) => {
      if (err) throw err;
      conn.query(query, values, (err, result) => {
        if (err) throw err;
        const { recommendationConditions } = result[0];
        const conditions = JSON.parse(recommendationConditions);
        res.json(conditions);
      });
    });
  }
  catch (error) {
    console.error('Error connecting to database:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
    return;
  }
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

  router.get('/total', async (req, res) => {
    const db = new Database();
    const conn = db.connection;
  
    const query = `
      SELECT s.name AS strand, COUNT(r.recommended) AS strand_count
      FROM strand AS s
      LEFT JOIN register AS r ON s.name = r.recommended
      GROUP BY s.name
    `;
  
    try {
      await conn.connect(); // Connect to the database
  
      conn.query(query, (err, results) => {
        if (err) {
          console.error('Error executing query:', err);
          res.status(500).json({ error: 'Internal server error', details: err.message });
          return;
        }
  
        // Process the results to create a strand count object
        const strandCounts = {};
        let totalRecommendations = 0;
  
        results.forEach((row) => {
          const strand = row.strand;
          const count = row.strand_count;
          strandCounts[strand] = count;
          totalRecommendations += count;
        });
  
        // Add a total count for all strands
        strandCounts['TOTAL'] = totalRecommendations;
  
        // Convert the object into an array of objects with the "TOTAL" count first
        const strandCountsArray = Object.entries(strandCounts).map(([strand, count]) => ({ strand, count }));
        strandCountsArray.sort((a, b) => (a.strand === 'TOTAL' ? -1 : b.strand === 'TOTAL' ? 1 : 0));
  
        res.json(strandCountsArray);
      });
    } catch (error) {
      console.error('Error connecting to the database:', error);
      res.status(500).json({ error: 'Internal server error', details: error.message });
    } finally {
      conn.end(); // Close the database connection
    }
  });
  
  
  // Backend route to handle year selection
// Backend route to handle year selection
router.get('/monthly/:year', async (req, res) => {
  const db = new Database();
  const conn = db.connection;
  const selectedYear = req.params.year; // Get the selected year from the URL parameter

  // Step 1: Query available strand names
  const strandQuery = `SELECT name FROM strand`;

  try {
    await conn.connect();

    conn.query(strandQuery, (err, strandResults) => {
      if (err) {
        console.error('Error executing strand query:', err);
        res.status(500).json({ error: 'Internal server error', details: err.message });
        return;
      }

      // Step 2: Dynamically generate CASE statements based on strand names
      const caseStatements = strandResults.map((row) => {
        const strandName = row.name;
        return `SUM(CASE WHEN s.name = '${strandName}' THEN 1 ELSE 0 END) AS ${strandName}`;
      });

      // Construct the dynamic SQL query to generate data for the selected year, including all months
      {/*const dynamicQuery = `
      SELECT
          monthName AS month,
          ${caseStatements.join(', ')},
          COALESCE(COUNT(r.recommended), 0) AS amt
    */}    
      const dynamicQuery = `
        SELECT
            monthName AS month,
            ${caseStatements.join(', ')}
        FROM (
          SELECT 1 AS monthIndex, 
          'Jan ${selectedYear}' AS monthName
          UNION SELECT 2, 'Feb ${selectedYear}'
          UNION SELECT 3, 'Mar ${selectedYear}'
          UNION SELECT 4, 'Apr ${selectedYear}'
          UNION SELECT 5, 'May ${selectedYear}'
          UNION SELECT 6, 'Jun ${selectedYear}'
          UNION SELECT 7, 'Jul ${selectedYear}'
          UNION SELECT 8, 'Aug ${selectedYear}'
          UNION SELECT 9, 'Sep ${selectedYear}'
          UNION SELECT 10, 'Oct ${selectedYear}'
          UNION SELECT 11, 'Nov ${selectedYear}'
          UNION SELECT 12, 'Dec ${selectedYear}'
        ) AS months
        LEFT JOIN register AS r ON months.monthName = DATE_FORMAT(r.createdAt, '%b %Y')
        LEFT JOIN strand AS s ON r.recommended = s.name
        GROUP BY month
        ORDER BY months.monthIndex;
      `;

      // Execute the dynamic query with the selected year
      conn.query(dynamicQuery, (err, results) => {
        if (err) {
          console.error('Error executing dynamic query:', err);
          res.status(500).json({ error: 'Internal server error', details: err.message });
          return;
        }

        const cleanedResults = results.map((result) => {
          return {
            ...result,
            month: result.month.split(' ')[0], // Get only the first part of the month string
          };
        });
      
        res.json(cleanedResults);      

        // Close the connection after sending the response
        conn.end();
      });
    });
  } catch (error) {
    console.error('Error connecting to the database:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
    conn.end(); // Close the database connection in case of an error
  }
});


module.exports = router;
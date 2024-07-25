const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const port = 3000;

// Set up SQLite database
const db = new sqlite3.Database('./db.db'); // Use ':memory:' for an in-memory database or a file path for a persistent one

// Create a table
db.serialize(() => {
  db.run('CREATE TABLE user (id INTEGER PRIMARY KEY, name TEXT)');
});

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API to get users
app.get('/users', (req, res) => {
  db.all('SELECT * FROM user', [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.json(rows);
  });
});

// API to add a user
app.post('/add-user', express.json(), (req, res) => {
  const { name } = req.body;
  db.run('INSERT INTO user (name) VALUES (?)', [name], function(err) {
    if (err) {
      return res.status(400).send(err.message);
    }
    res.json({ id: this.lastID, name });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port  = 3000;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'myapp'
});

db.connect((err)=>{
    if(err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});

//Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


//Get all users
app.get('/users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.json(results);
    });
});

//Post a new user

app.post('/users', (req, res) => {      
    const { name } = req.body;
    if (!name) {
        return res.status(400).send('Name are required');
    }
    db.query('INSERT INTO users (name) VALUES (?)', [name,], (err, results) => {
        if (err) {
            console.error('Error inserting user:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.status(201).json({ id: results.insertId, name });
    });
    
});

//Update and existing user --UPDATE

app.put('/users/:id', (req, res) => { 
    const { id } = req.params;  // id will be found in the url
    const { name } = req.body;  //textbox中的内容
    if (!name) {
        return res.status(400).send('Name is required');
    }
    db.query('UPDATE users SET name = ? WHERE id = ?', [name, id], (err, results) => {
        if (err) {
            console.error('Error updating user:', err);
            return res.status(500).send('Database update failed');
        }
        if (results.affectedRows === 0) {
            return res.status(404).send('User not found');
        }
        res.json({ id, name });
    }); 
});

//Delete a user --DELETE
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM users WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Error deleting user:', err);
            return res.status(500).send('Internal Server Error');
        }
        if (results.affectedRows === 0) {
            return res.status(404).send('User not found');
        }
        res.status(204).json({message:'User deleted'}); // No content
    });
}); 

//Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
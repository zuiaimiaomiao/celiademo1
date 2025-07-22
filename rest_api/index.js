const express = require('express');
const app = express();
const PORT = 3000;
const path = require('path');

//data
let users = [
    {id:1,name:'John Doe'},
    {id:2,name:'Jame Smith'},
    {id:3,name:'Alice Johnson'},
];

//middleware to parse JSON bodies
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {    
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
//GET all users
app.get('/users', (req, res) => {
    res.json(users);
});

app.post('/users', (req, res) => {  
    const newUser = req.body;
    newUser.id = users.length + 1; // simple id generation
    users.push(newUser);
    res.status(201).json(newUser);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
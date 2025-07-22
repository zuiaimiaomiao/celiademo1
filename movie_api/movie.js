
const express = require('express');
const app = express();
const PORT = 3000;
const path = require('path');
// Sample movie data
let movies = [
    {
        id:1,
        title: "Inception",
        year: 2010,
    },
    {
        id:2,
        title: "The Godfather",
        year: 1972,
    },
    {
        id:3,
        title: "Pulp Fiction",
        year: 1994,
    }
];

//middleware to parse JSON bodies
app.use(express.json());
// app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {    
    res.sendFile(path.join(__dirname, 'public', 'movie.html'));
});
//GET all users
app.get('/movies', (req, res) => {
    res.json(movies);
});

app.post('/movies', (req, res) => {  
    const newMovie = req.body;
    newMovie.id = movies.length + 1; // simple id generation
    movies.push(newMovie);
    res.status(201).json(newMovie);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/`);
});
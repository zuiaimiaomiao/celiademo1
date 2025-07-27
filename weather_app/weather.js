import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';

// Setting up directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
// Database connection
const db = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'weather'
});

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));
// API endpoint to get weather data
app.get('/weather', async (req, res) => {
    try {
        const city = req.query.city || 'Tokyo';
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=4df4c74c9856144652f1427846273f90`);

        const weatherData = await response.json();
        // Save weather data to MySQL database
        const  wea  = weatherData.weather[0].main;
        //输出一下wea
        console.log(wea);
        const weatherDescription = weatherData.weather[0].description;

        await db.execute('INSERT INTO weather (city,wea) VALUES (?, ?)', [city, wea]);

        // Send weather data to the client
        res.json(weatherData);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
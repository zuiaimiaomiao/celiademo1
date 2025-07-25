import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

// file name and path declarition
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//initialize express app
const app = express();
const PORT = 3000;

//MySQL connection
//await 等到 app.get async 执行完毕
//aasync means the function call that will return a promise
const dbConfig = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'weather_db'
}); 

//Create the table to store weather data
//使用query不对，execute可以用于一切情况  await 等到 app.get async 执行完毕 await要一直等待这句语句的执行完毕
//timestamp很重要 数据库中会自动添加当前时间
await dbConfig.execute(`  
    CREATE TABLE IF NOT EXISTS weather_date (
        id INT AUTO_INCREMENT PRIMARY KEY,
        city VARCHAR(100) NOT NULL,
        country VARCHAR(100) NOT NULL,
        temperature FLOAT NOT NULL,
        description VARCHAR(255) NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`);
const apiKey = '4df4c74c9856144652f1427846273f90';

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
//API endpoint
//请求路径后面还有?city=xxx
app.get('/weather', async (req, res) => {

    //Read the data from weather API
    const city_name = req.query.city;
    const api_url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city_name)}&units=metric&appid=${apiKey}`;
    try{
        const response = await fetch(api_url);
        const data = await response.json();
        //返回的data json数据中有cod这一项表示的是执行结果返回的状态码
        if(data.cod != 200) {
            //固定统一写法
            return res.status(404).json({ error: 'City not found' });
        }
        const result = {
            city: data.name,
            country: data.sys.country,
            temperature: data.main.temp,
            description: data.weather[0].description
        };

        await dbConfig.execute(
            'INSERT INTO weather_date (city, country, temperature, description) VALUES (?, ?, ?, ?)',
            [result.city, result.country, result.temperature, result.description]
        );

        return res.json(result);
    }catch(error) {
        console.error('Error fetching weather data:', error);
        return res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});




//Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

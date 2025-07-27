//app.js
//1. import the http module
const http = require('http');
//5. connect html page with nodejs
const path = require('path');

//6. connect path
const filePath = path.join(__dirname, 'index.html');

//7. read file stream
const fs = require('fs');


//2. create a http server
const server = http.createServer((req, res) => {  //{} sever definition
    // This function is called every time a request is made to the server
    //req is the request object, res is the response object
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello everyone from node.js\n');

    //8.read file
    fs.readFile(filePath,'utf-8', (err, content) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(content);
});
    //     //3. set the response header
    // res.writeHead(200, { 'Content-Type': 'text/plain' });
    // //4. send the response body
    // res.end('Hello World\n');
});

//3. start the server  listen on port 3000
const PORT = 3000;
server.listen(PORT, () => {  //server.listen 监听用户请求
    console.log(`Server running at http://localhost:${PORT}/`);
});

//4. create html page


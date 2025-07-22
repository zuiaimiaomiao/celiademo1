// 1. 导入所需模块
const http = require('http');
const path = require('path');
const fs = require('fs');

// 2. 定义HTML文件路径（提前拼接，避免重复计算）
const filePath = path.join(__dirname, 'index.html');

// 3. 创建HTTP服务器并处理请求
const server = http.createServer((req, res) => {
    // 每次收到请求时执行
    // 读取HTML文件并返回给客户端
    fs.readFile(filePath, (err, content) => {
        if (err) {
            // 处理文件读取错误（如文件不存在）
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Error: 页面未找到');
        } else {
            // 读取成功，返回HTML内容
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        }
    });
});

// 4. 启动服务器监听端口
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}/`);
});
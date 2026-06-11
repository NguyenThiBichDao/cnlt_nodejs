require("dotenv").config(); 
const http = require("http"); 
const app = require("./app"); 
const connectDB = require("./config/database"); 
const setupSocket = require("./config/socket"); 

// Kết nối cơ sở dữ liệu
connectDB(); 

const PORT = process.env.PORT || 5000; 
const server = http.createServer(app); 

// Cấu hình Socket.IO cho tính năng Chat
setupSocket(server); 

server.listen(PORT, () => { 
    console.log(`🚀 Server running on port ${PORT}`); 
    console.log(`💬 Socket.IO enabled`); 
});

const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        // Kết nối thẳng tới database local EBikesNewDB của bạn
        const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/EBikesNewDB";
        
        const conn = await mongoose.connect(MONGO_URI);
        console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Lỗi kết nối Database: ${error.message}`);
        process.exit(1); // Dừng hệ thống nếu lỗi kết nối DB
    }
};

module.exports = connectDB;
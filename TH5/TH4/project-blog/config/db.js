const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/my_database') 
.then(() => {
    console.log('Đã kết nối MongoDB thành công thông qua Mongoose!');
})
.catch((err) => {
    console.error('Lỗi kết nối MongoDB: ', err.message);
});

module.exports = mongoose.connection;

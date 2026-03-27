// models/BlogPost.js - Bản giả lập Mongoose để chạy bài thực hành
let posts = []; // Mảng này đóng vai trò như một Database tạm thời

module.exports = {
    // Giả lập hàm BlogPost.find() - Bước 8 & 9
    find: async function() {
        return posts;
    },
    // Giả lập hàm BlogPost.create() - Bước 6
    create: async function(data) {
        const newPost = { 
            _id: Math.random().toString(36).substr(2, 9), 
            ...data 
        };
        posts.push(newPost);
        return newPost;
    },
    // Giả lập hàm BlogPost.findById() - Bước 10
    findById: async function(id) {
        return posts.find(p => p._id === id);
    }
};

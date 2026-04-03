const BlogPost = require('../models/BlogPost');

// Xem danh sách
exports.getAllPosts = async (req, res) => {
    try {
        const allPosts = await BlogPost.find({}); // Lấy dữ liệu từ MongoDB
        
        res.render('index', { posts: allPosts }); 
        
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Xem chi tiết
exports.getPost = async (req, res) => {
    const post = await BlogPost.findById(req.params.id);
    res.render('detail', { post });
};

// Trang thêm mới
exports.createPost = (req, res) => {
    res.render('create');
};

// Lưu bài viết
exports.storePost = async (req, res) => {
    await BlogPost.create(req.body);
    res.redirect('/');
};


// --- HÀM HIỂN THỊ FORM SỬA (GET) ---
exports.editPost = async (req, res) => {
    try {
        const post = await BlogPost.findById(req.params.id);
        if (post) {
            res.render('edit', { post }); 
        } else {
            res.status(404).send("Không tìm thấy bài viết để chỉnh sửa");
        }
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
};

// Sửa bài viết (Nếu bạn có dùng lệnh PUT ở Route)
exports.updatePost = async (req, res) => {
    try {
        await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
        console.log("Cập nhật bài viết thành công!");
        res.redirect('/'); // Sửa xong quay về trang chủ
    } catch (error) {
        console.error(error);
        res.status(400).send("Lỗi khi cập nhật bài viết");
    }
};

// Xóa bài viết
exports.deletePost = async (req, res) => {
    await BlogPost.findByIdAndDelete(req.params.id);
    res.redirect('/');
};

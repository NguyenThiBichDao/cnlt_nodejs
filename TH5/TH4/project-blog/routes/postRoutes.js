const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// --- 1. TRANG CHỦ ---
router.get('/', postController.getAllPosts);

// --- 2. CÁC ROUTE TĨNH (Phải để trước các route có :id) ---
router.get('/blogposts/new', postController.createPost); 
router.get('/post/new', postController.createPost); 

// --- 3. CÁC ROUTE HIỂN THỊ FORM SỬA (BẠN ĐANG THIẾU DÒNG NÀY) ---
router.get('/post/edit/:id', postController.editPost); 

// --- 4. CÁC ROUTE XỬ LÝ DỮ LIỆU (POST) ---
router.post('/blogposts/store', postController.storePost);
router.post('/posts/store', postController.storePost);
router.post('/post/update/:id', postController.updatePost);

// --- 5. CÁC ROUTE CÓ THAM SỐ :id (Để sau cùng) ---
router.get('/post/:id', postController.getPost);
router.get('/blogposts/:id', postController.getPost); 
router.get('/post/delete/:id', postController.deletePost);

module.exports = router;

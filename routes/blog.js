const express = require("express");
const router = express.Router();
const BlogController = require("../controllers/BlogController");
const multer = require("multer");
const uploadMiddleware = multer({ dest: "uploads/" });

router.post("/", uploadMiddleware.single('file'), BlogController.createBlog);
router.get("/", BlogController.getAllBlog);
router.delete("/:id", BlogController.deleteBlog);

module.exports = router;

const express = require("express");
const router = express.Router();
const BlogController = require("../controllers/BlogController");
const multer = require("multer");
const uploadMiddleware = multer({ dest: "uploads/" });

router.post("/", uploadMiddleware.single("file"), BlogController.createBlog);
router.put("/", uploadMiddleware.single("file"), BlogController.updateBlog);
router.get("/", BlogController.getAllBlog);
router.get("/:id", BlogController.getById);
router.delete("/:id", BlogController.deleteBlog);

module.exports = router;

const express = require("express");
const router = express.Router();
const BlogController = require("../controllers/BlogController");

router.post("/", BlogController.createBlog);
router.get("/", BlogController.getAllBlog);
router.delete("/:id", BlogController.deleteBlog);

module.exports = router;

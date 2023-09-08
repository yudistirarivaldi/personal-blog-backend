const { Blog } = require("../models");

module.exports = {
  createBlog: async (req, res) => {
    try {
      const newBlog = await Blog.create({
        ...req.body,
      });

      res.status(201).json({
        status: "success",
        message: "Successfully create data",
        data: newBlog,
      });
    } catch (error) {
      res.status(500).json({ error: "Error retrieving with server" });
    }
  },

  getAllBlog: async (req, res) => {
    try {
      const blogs = await Blog.findAll({
        attributes: ["id", "title", "content", "publication", "createdAt"],
      });

      res.status(200).json({
        status: "success",
        message: "Successfully get data",
        data: blogs,
      });
    } catch (error) {
      res.status(500).json({ error: "Error retrieving with server" });
    }
  },

  deleteBlog: async (req, res) => {
    try {
      const { id } = req.params;

      const deleteBlog = await Blog.destroy({
        where: {
          id: id,
        },
      });
      res.status(200).json({
        status: "success",
        message: "Successfully delete data",
      });
    } catch (error) {
      res.status(500).json({ error: "Error retrieving with server" });
    }
  },
};

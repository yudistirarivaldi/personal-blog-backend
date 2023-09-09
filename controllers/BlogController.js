const { Blog } = require("../models");
const fs = require("fs");
const jwt = require("jsonwebtoken");

module.exports = {
  createBlog: async (req, res) => {
    try {
      const { originalname, path } = req.file;
      const parts = originalname.split(".");
      const ext = parts[1];
      const newPath = path + "." + ext;
      fs.renameSync(path, newPath);

      const { token } = req.cookies;
      const { SECRET_KEY } = process.env;
      jwt.verify(token, SECRET_KEY, {}, async (err, info) => {
        if (err) {
          throw err;
        }
        const { title, summary, content } = req.body;

        const newBlog = await Blog.create({
          title,
          summary,
          content,
          cover: newPath,
          author: info.id,
        });

        // res.json(info.id);
        res.status(201).json({
          status: "success",
          message: "Successfully create data",
          data: newBlog,
        });
      });
    } catch (error) {
      // res.status(500).json({ error: "Error retrieving with server" });
      console.log(error);
    }
  },

  getAllBlog: async (req, res) => {
    try {
      const blogs = await Blog.findAll({
        attributes: [
          "id",
          "title",
          "summary",
          "content",
          "cover",
          "author",
          "createdAt",
        ],
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

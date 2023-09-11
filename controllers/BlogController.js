const { Blog, User } = require("../models");
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
      res.status(500).json({ error: "Error retrieving with server" });
    }
  },

  updateBlog: async (req, res) => {
    try {
      let newPath = null;
      if (req.file) {
        const { originalname, path } = req.file;
        const parts = originalname.split(".");
        const ext = parts[1];
        newPath = path + "." + ext;
        fs.renameSync(path, newPath);
      }

      const { token } = req.cookies;
      const { SECRET_KEY } = process.env;
      jwt.verify(token, SECRET_KEY, {}, async (err, info) => {
        if (err) {
          throw err;
        }
        const { id, title, summary, content } = req.body;

        const findBlog = await Blog.findOne({ where: { id: id } });
        const isAuthor = findBlog.author === info.id;

        if (!isAuthor) {
          res.status(401).json("you are not the author");
          throw "you are not the author";
        }

        const newBlog = await Blog.update(
          {
            title,
            summary,
            content,
            cover: newPath ? newPath : findBlog.cover,
            author: info.id,
          },
          {
            where: {
              id: id,
            },
          }
        );

        res.status(201).json({
          status: "success",
          message: "Successfully update data",
          data: newBlog,
        });
      });
    } catch (error) {}
  },

  getAllBlog: async (req, res) => {
    try {
      const blogs = await Blog.findAll({
        include: {
          model: User,
          attributes: ["username"],
        },
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

      const proocessBloogs = blogs.map((blog) => {
        return {
          id: blog.id,
          title: blog.title,
          summary: blog.summary,
          content: blog.content,
          cover: blog.cover,
          author: blog.User.username,
          publication: blog.createdAt,
        };
      });

      res.status(200).json({
        status: "success",
        message: "Successfully get data",
        data: proocessBloogs,
      });
    } catch (error) {
      // res.status(500).json({ error: "Error retrieving with server" });
      console.log(error);
    }
  },

  getById: async (req, res) => {
    try {
      const { id } = req.params;

      const blog = await Blog.findOne({
        where: { id: id },
        include: {
          model: User,
          attributes: ["username", "id"],
        },
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

      if (!blog) {
        res.status(404).json("Not found");
      }

      res.status(200).json({
        status: "success",
        message: "Successfully get data",
        data: {
          id: blog.id,
          title: blog.title,
          summary: blog.summary,
          content: blog.content,
          cover: blog.cover,
          publication: blog.createdAt,
          author: blog.User.username,
          author_id: blog.User.id,
        },
      });
    } catch (error) {
      console.log(error);
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

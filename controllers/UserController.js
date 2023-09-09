const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = {
  register: async (req, res) => {
    try {
      const { username, password } = req.body;

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);

      const register = await User.create({
        username,
        password: hash,
      });

      res.status(201).json({
        status: "success",
        message: "Successfully create data",
        data: register,
      });
    } catch (error) {
      res.status(500).json({ error: "Error retrieving with server" });
    }
  },

  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      const findUser = await User.findOne({ where: { username: username } });

      const checkPassword = bcrypt.compareSync(password, findUser.password);

      const { SECRET_KEY } = process.env;

      if (checkPassword) {
        jwt.sign(
          { username, id: findUser.id },
          SECRET_KEY,
          {},
          (err, token) => {
            if (err) throw err;
            res.cookie("token", token).json({
              id: findUser.id,
              username,
            });
          }
        );
      } else {
        return res.status(400).json("wrong credentials");
      }

      res.status(201).json({
        status: "success",
        message: "Successfully login",
        data: token,
      });
    } catch (error) {
      // res.status(500).json({ error: "Error retrieving with server" });
      console.log(error);
    }
  },

  getUser: async (req, res) => {
    const { token } = req.cookies;
    const { SECRET_KEY } = process.env;
    jwt.verify(token, SECRET_KEY, {}, (err, info) => {
      if (err) throw err;
      res.json(info);
    });

    res.json(req.cookies);
  },

  logout: async (req, res) => {
    res.cookie("token", "").json("ok");
  },
};

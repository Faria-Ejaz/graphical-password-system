const express = require("express");
const router = express.Router();

const User = require("../model/User.js");

require("dotenv").config();

module.exports = () => {
  router.post("/", (req, res) => {
    const email = req.body.email;
    User.findOne({ email: email }).then((user) => {
      if (user) {
        const counter = req.body.counter;
        if (counter === 0) {
          return res
            .status(200)
            .json({ images: user.ImageURLs, passwordHint: user.passwordHints[0] });
        } else {
          const passwordHash = req.body.passwordHash;
          if (user.passwordHash.match(passwordHash)) {
            return res.status(200).json({ msg: "Login Successful" });
          } else {
            return res.status(401).json({ msg: "Login Unsuccessful" });
          }
        }
      } else {
        return res.status(404).json({ msg: "No User Found" });
      }
    });
  });
  return router;
};

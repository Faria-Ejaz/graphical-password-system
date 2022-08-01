const express = require("express");
const router = express.Router();

const User = require("../model/User.js");

require("dotenv").config();

const NUM_OF_IMAGES_IN_SET = process.env.NUM_OF_IMAGES_IN_SET;

const shuffleArray = (array) => {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

module.exports = (unsplash) => {
  router.post("/", (req, res) => {
    const userData = req.body;

    User.findOne({ email: userData.email })
      .then((user) => {
        if (user) {
          return res.status(200).json({ msg: "User Already Exists" });
        }
        let ImageURLs = [];
        unsplash.photos
          .getRandom({
            count: NUM_OF_IMAGES_IN_SET - 1,
          })
          .then((result) => {
            if (result.type === "success") {
              const images = result.response;
              for (let i = 0; i < NUM_OF_IMAGES_IN_SET - 1; i++) {
                let newLink = images[i].urls.raw;
                newLink += "&crop=faces&fit=crop&h=250&w=250";
                ImageURLs.push(newLink);
              }
              
              ImageURLs.push(userData.images[0]);
              shuffleArray(ImageURLs);
              const newUser = new User({
                name: userData.name,
                email: userData.email,
                ImageURLs: ImageURLs,
                images: userData.images,
                passwordHints: userData.passwordHints,
                passwordHash: userData.passwordHash,
              });
              newUser
                .save()
                .then(() => {
                  return res
                    .status(200)
                    .json({ msg: "Registration Successful" });
                })
                .catch((err) => {
                  return res
                    .status(500)
                    .json({ msg: "Couldn't Save New User" });
                });
            } else {
              return res
                .status(500)
                .json({ msg: "Couldn't Get Images from Unsplash" });
            }
          });
      })
      .catch((error) => {
        res.status(500).json({ msg: "Failed at searching for Duplicate User" });
      });
  });
  return router;
};

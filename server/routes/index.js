const express = require("express");
const router = express.Router();

module.exports = (unsplash) => {
  router.use("/api/login", require("./login")(unsplash));
  router.use("/api/register", require("./register")(unsplash));
  return router;
};

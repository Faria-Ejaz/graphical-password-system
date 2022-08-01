const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  ImageURLs: {
    type: [String],
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
  passwordHints: {
    type: [String]
  },
  passwordHash: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;

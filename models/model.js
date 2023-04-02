const mongoose = require("mongoose");
const userSchema = mongoose.Schema(
  {
    first_name: { type: String },
    last_name: { type: String },
    email: { type: String },
    gender: { type: String },
    age: { type: Number },
    password: { type: String },
  },
  {
    strict: false,
  }
);
const userModel = mongoose.model("users", userSchema);

const postSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    device: { type: String, required: true },
    no_of_comments: { type: Number, required: true },
  },
  {
    strict: false,
  }
);
const postModel = mongoose.model("posts", postSchema);

module.exports = { userModel, postModel };

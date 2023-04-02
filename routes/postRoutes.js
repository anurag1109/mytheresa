const express = require("express");
const postrouter = express.Router();
postrouter.use(express.json());
const jwt = require("jsonwebtoken");

const { authenticate } = require("../middleware/authentication");
const { postModel } = require("../models/model");

postrouter.get("/", authenticate, async (req, res) => {
  let query = req.query;
  const token = req.headers.authorization;
  jwt.verify(token, "linkedin", async (err, decoded) => {
    if (decoded) {
      if (Object.keys(query).length == 0) {
        posts = await postModel.find({ user: decoded.userId });
      } else {
        posts = await postModel.find({
          user: decoded.userId,
          $or: [
            { device: query.device },
            { device: query.device1 },
            { device: query.device2 },
          ],
        });
      }
      res.status(200).send(posts);
    } else {
      res.status(200).send({ msg: "You can see only your posts." });
    }
  });
});

postrouter.post("/add", authenticate, async (req, res) => {
  try {
    let data = req.body;
    const newpost = new postModel(data);
    newpost.save();
    res.status(200).send({ msg: "post has been added successfully" });
  } catch (err) {
    console.log(err);
  }
});

postrouter.get("/top", authenticate, async (req, res) => {
  const token = req.headers.authorization;
  jwt.verify(token, "linkedin", async (err, decoded) => {
    if (decoded) {
      console.log(decoded);
      let maxCommentPost = await postModel
        .find({ user: decoded.userId })
        .sort({ no_of_comments: -1 })
        .limit(1);
      res.status(200).send(maxCommentPost);
    } else {
      res.status(200).send({ msg: "You can see only your posts." });
    }
  });
});

postrouter.patch("/update/:id", authenticate, async (req, res) => {
  const noteId = req.params.id;
  const token = req.headers.authorization;
  jwt.verify(token, "linkedin", async (err, decoded) => {
    let post = await postModel.find({ user: decoded.userId, _id: noteId });
    console.log(post);
    if (post.length > 0) {
      await postModel.findByIdAndUpdate({ _id: noteId }, req.body);
      res.status(200).send({ msg: "post has been updated" });
    } else {
      res.status(200).send({ msg: "No post exist with given post ID" });
    }
  });
});

postrouter.delete("/delete/:id", authenticate, async (req, res) => {
  const noteId = req.params.id;
  const token = req.headers.authorization;
  jwt.verify(token, "linkedin", async (err, decoded) => {
    let post = await postModel.find({ user: decoded.userId, _id: noteId });
    if (post.length > 0) {
      await postModel.findByIdAndDelete({ _id: noteId });
      res.status(200).send({ msg: "post has been deleted" });
    } else {
      res.status(200).send({ msg: "No post exist with given post ID" });
    }
  });
});

module.exports = { postrouter };

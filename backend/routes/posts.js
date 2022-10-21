/**
 * For routes in /api/posts
 * define new router to handle endpoints of incoming requests
 * Multer is used to extract and save incoming files
 */

const express = require("express");
const multer = require("multer");

const Post = require("../models/post");

const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

//saves files with multer
//multer takes in 3 args: request, file and callback
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    //declare custom error
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    //use error if invalid, else save to backend/images
    cb(error, "backend/images");
  },
  filename: (req,file,cb) => {
    //extract name
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    //return the full file name (with date and extension)
    cb(null, name + "-" + Date.now() + "." + ext);
  }
});

//middleware to receive request to add post, and add post in db
//pass multer as argument to read for file
//.single to specify only process one file
router.post(
  "",
multer({ storage: storage }).single("image"),
  (req, res, next) => {
  //get url of incoming request
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename
    });

    //save to database
    post.save().then(createdPost => {
      res.status(201).json({
        message: "Post added successfully",
        post: {
        //beware of the spread operator! it converts a mongoose object to a
        //complex mongoose object wrapped in _doc property (only this is displayed in real world).
        //https://www.udemy.com/course/angular-2-and-nodejs-the-practical-guide/learn/lecture/10523234#questions/4851476
        ...createdPost, //spread operator: used to copy attributes of createdPost to post
        id: createdPost._id
      }
    });
  });
});

//update / edit a post
//get imagepath from request, and if a file is a sent construct imagepath to save
//create a new post, then update to database.
router.put(
  "/:id",
  multer({ storage: storage }).single("image"),
  (req,res,next) => {
    let imagePath = req.body.imagePath;

    if(req.file){
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }

    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath
    });

    //patch in database
    Post.updateOne({_id: req.params.id}, post)
    .then(result => {
      res.status(200).json('Update successful!');
    });

});

//receive request to get post, send posts to front-end, find() gets all posts
router.get("", (req, res, next) => {
  Post.find().then(documents => {
    res.status(200).json({
      message: "Posts fetched successfully!",
      posts: documents
    });
  });
});

//receive request to get post with id
router.get("/:id", (req,res,next) => {
  Post.findById(req.params.id).then(post => {
    if(post){
      res.status(200).json(post);
    } else {
      res.status(404).json({message: 'Post not found!'});
    }
  });
});

//request to delete item in collection.
router.delete("/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({ message: "Post deleted!" });
  });
});

module.exports = router;

/**
 * For routes in /api/posts
 * define new router to handle endpoints of incoming requests
 * Multer is used to extract and save incoming files
 */

const express = require("express");
const multer = require("multer");

const Post = require("../models/post");

//Only posts need to check for authentication.
//Any user should be able to go to login / signup page
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

/**
 * Saves files with multer
 * multer takes in 3 args: request, file and callback
 * isValid declare the custom error
 * Callback error if invalid, else save to backend/images
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req,file,cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    //return the full file name (with date and extension)
    cb(null, name + "-" + Date.now() + "." + ext);
  }
});

/**
 * Middleware to receive request to add post, and add post in db
 * Pass multer as argument to read for file
 * .single to specify only process one file
 * Simply pass checkAuth reference and Express will execute the authentication middleware.
 */
router.post(
  "",
  checkAuth,
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

/**
 * Update / edit a post
 * Get imagepath from request, and if a file is a sent construct imagepath to save
 * Create a new post, then update to database.
 * Simply pass checkAuth reference and Express will execute the authentication middleware.
 */
router.put(
  "/:id",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req,res,next) => {
    let imagePath = req.body.imagePath;

    if(req.file){ //if a new file is received, update imagePath
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

/**
 * Receive request to get post, then send posts to front-end. find() gets all posts
 * Get query parameters for pagination
 * query.any-name-you-specify-as-parameter
 * '+' to convert string to int due to receiving string from req
 * No need for auth, any user can see the post but to edit it you need authentication.
 */
router.get("", (req, res, next) => {
  const pageSize = +req.query.pagesize; //number of pages to display at a time
  const currentPage = +req.query.page; //current page index
  const postQuery = Post.find();
  let fetchedPosts;

  //this method checks for all entries so okay to use for small database, inefficient in large databases.
  //if you're on page 2, you skip 1 page.
  //limit amount of pages we return.
  if(pageSize && currentPage){
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }

  //return number of posts, then send a response.
  //chaining then(), share variable fetchedPosts between them
  //in response return the maxPosts (current number of posts)
  postQuery
    .then(documents => {
      fetchedPosts = documents;
    return Post.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Posts fetched successfully!",
        posts: fetchedPosts,
        maxPosts: count
      });
    });
});

//Receive request to get post with id,
//No need for auth, any user can see the post but to edit it you need authentication.
router.get("/:id", (req,res,next) => {
  Post.findById(req.params.id).then(post => {
    if(post){
      res.status(200).json(post);
    } else {
      res.status(404).json({message: 'Post not found!'});
    }
  });
});

/**
 * Request to delete item in collection.
 * Simply pass checkAuth reference and Express will execute the authentication middleware.
 *  */
router.delete("/:id", checkAuth, (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({ message: "Post deleted!" });
  });
});

module.exports = router;

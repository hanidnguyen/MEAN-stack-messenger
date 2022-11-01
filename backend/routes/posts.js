/**
 * For routes in /api/posts
 * define new router to handle endpoints of incoming requests
 * Multer is used to extract and save incoming files
 * Only posts need to check for authentication.
 * Any user should be able to go to login / signup page
 */

const express = require("express");
const multer = require("multer");
const PostController = require("../controllers/posts")
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
 * Create post and add to db (calling from controllers)
 * Pass multer as argument to read for file
 * .single to specify only process one file
 * Simply pass checkAuth reference and Express will execute the authentication middleware.
 */
router.post(
  "", //path after /api/posts
  checkAuth,
  multer({ storage: storage }).single("image"),
  PostController.createPost
  );

/**
 * Update / edit a post
 * Simply pass checkAuth reference and Express will execute the authentication middleware.
 */
router.put(
  "/:id", //path after /api/posts
  checkAuth,
  multer({ storage: storage }).single("image"),
  PostController.updatePost
);

/**
 * Receive request to get all posts, then send posts to front-end.
 * No need for auth, any user can see the post but to edit it you need authentication.
 */
router.get("", PostController.getPosts);

/**
 * Receive request to get a post with an id,
 * No need for auth, any user can see the post but to edit it you need authentication.
 */
router.get("/:id", PostController.getPost);

/**
 * Request to delete item in collection.
 * Simply pass checkAuth reference and Express will execute the authentication middleware.
 *  */
router.delete("/:id", checkAuth, PostController.deletePost);

module.exports = router;

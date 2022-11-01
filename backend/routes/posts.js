/**
 * For routes in /api/posts
 * Import router to handle endpoints of incoming requests
 * Extracting files is defined in /middleware/file
 * Only posts need to check for authentication.
 * Any user should be able to go to login / signup page
 */

const express = require("express");
const PostController = require("../controllers/posts")
const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");
const router = express.Router();

/**
 * Create post and add to db (calling from controllers)
 * Call extractFile (multer) to extract image
 * Simply pass checkAuth reference and Express will execute the authentication middleware.
 */
router.post(
  "", //path after /api/posts
  checkAuth,
  extractFile,
  PostController.createPost
  );

/**
 * Update / edit a post using given id
 * Call extractFile (multer) to extract image
 * Simply pass checkAuth reference and Express will execute the authentication middleware.
 */
router.put(
  "/:id", //path after /api/posts
  checkAuth,
  extractFile,
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

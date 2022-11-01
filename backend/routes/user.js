const express = require("express");

const UserController = require("../controllers/user");

const router = express.Router();
const user = require("../models/user");

/**
 * Calling signup and login functions from controllers/user.js
 * For requested paths /signup and /login.
 */

router.post("/signup", UserController.createUser);

router.post("/login", UserController.userLogin);

module.exports = router;

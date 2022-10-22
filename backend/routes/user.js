const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const router = express.Router();
const jwt = require("jsonwebtoken");
const user = require("../models/user");

/**
 * Middleware for signup.
 * Import and use bcrypt to encrypt and store password.
 * .hash returns the hash, we set password to the returned hash.
 */

router.post("/signup", (req,res,next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user
        .save()
        .then(result => {
          res.status(201).json({
            message: 'User created!',
            result: result
          });
        });
    })
    .catch(err => { //catch error if user give existing email
      res.status(500).json({
        error: err
      })
    });

});

/**
 * Middleware for login
 * Find user in database, if not found simply return auth error code
 * Else, use bcrypt to compare tokens for validation
 * Return authentication first before creating token to ensure we don't run it
 */
router.post("/login", (req,res,next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      if(!user){
        return res.status(401).json({
          message: 'Auth failed'
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => { //result of bcrypt compare
      if(!result) {
        return res.status(401).json({
          message: 'Auth failed'
        });
      }
      //create a new token with given input and our super long password (should be more complicated than this)
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        'secret_this_should_be_longer',
        { expiresIn: '1h'} //security mechanism to ensure it doesn't last forever.
        );
        res.status(200).json({
          token: token
        });
    })
    .catch(err => {
      return res.status(401).json({
        message: 'Auth failed'
      })
    });
})

module.exports = router;

const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const router = express.Router();

/**
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
      user.save()
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

module.exports = router;

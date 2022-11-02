/**
 * Holds all user routing logic
 */

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

/**
 * Middleware for signup.
 * Import and use bcrypt to encrypt and store password.
 * .hash returns the hash, we set password to the returned hash.
 */

exports.createUser = (req,res,next) => {
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
        })
        .catch(err => { //catch error if user give existing email
          res.status(500).json({
            message: "Invalid authentication credentials!"
          })
        });
    });
}

/**
 * Middleware for login
 * Find user in database, if not found simply return auth error code
 * Else, use bcrypt to compare tokens for validation
 * Return authentication first before creating token to ensure we don't run it
 */

exports.userLogin = (req,res,next) => {
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
      //create a new token with given input and saved password from nodemon json declared env variables
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        process.env.JWT_KEY,
        { expiresIn: '1h'} //security mechanism to ensure it doesn't last forever.
        );
        res.status(200).json({
          token: token,
          expiresIn: 3600,
          userId: fetchedUser._id
        });
    })
    .catch(err => {
      return res.status(401).json({
        message: "Invalid authentication credentials!"
      });
    });
}

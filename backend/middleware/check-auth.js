/**
 * This middleware is for authenticating requests,
 * check and decide whether request is allowed to
 * continue or rejected.
 */

const jwt = require('jsonwebtoken');

/**
 * Function which gets executed on incoming requests
 * The convention in many APIs is:
 * - to get a token is through headers.authorization
 * - token is composed like so: "Bearer some-token" so [1] for getting the token
 * */
module.exports = (req,res,next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, 'secret_this_should_be_longer');
    next();
  } catch (error) {
    res.status(401).json({
      message: 'Auth failed!'
    });
  }


}

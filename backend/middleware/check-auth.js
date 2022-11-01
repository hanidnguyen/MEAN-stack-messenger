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
 *
 * Since we need the userid in middlewares that will save a post to a unique user,
 * we add a new property to the req as req.userData.
 * This userData property will be passed to any middleware calling and running after the checkauth middleware.
 * */
module.exports = (req,res,next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, 'secret_this_should_be_longer');
    req.userData = {email: decodedToken.email, userId: decodedToken.userId };
    next();
  } catch (error) {
    res.status(401).json({
      message: 'You are not authenticated!'
    });
  }


}

const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Middleware function to authenticate a user using JWT
const authMiddleware = async (req, res, next) => {
  try {
    // Retrieve the Authorization header from the request
    const authHeader = req.headers.authorization;

    // Check if the Authorization header is present
    if (authHeader) {
      // Extract the token from the Authorization header
      const token = authHeader.split(" ")[1];

      // Verify the token using the secret key
      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        // If token verification fails, respond with an unauthorized status
        if (err) {
          return res.status(401).json({
            status: "failed",
            message: "unauthorised user",
            error: err.message
          });
        }

        // If token is valid, attach the user object to the request
        req.user = user;
        // Proceed to the next middleware or route handler
        next();
      });
    } else {
      // If no Authorization header is present, respond with a forbidden status
      res.status(403).json({
        status: "failed",
        message: "not an authorised user",
      });
    }
  } catch (error) {
    // Catch any unexpected errors and respond with an internal server error status
    res.status(500).json({
      status: "failed",
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = authMiddleware;

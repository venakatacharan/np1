const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// function that create a reusable token
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn : "1d"});
};

// Register a new user
exports.registerUser = async (req, res) => {
  // Destructure email and password from request body
  const { email, password } = req.body;

  // Validate the presence of email and password
  if (!email || !password) {
    return res.status(400).json({ message: "All fields must be filled" });
  }

  // Validate email format
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Email is not valid" });
  }

  // Validate password strength
  if (!validator.isStrongPassword(password)) {
    return res.status(400).json({ message: "Password is not strong enough" });
  }

  try {
    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash the password using the generated salt
    const hashPassword = await bcrypt.hash(password, 10);
    // Create a new user with the hashed password
    const user = await User.create({ email, password: hashPassword });

    // create a token
    const token = createToken(user._id)

    // Respond with a success message and user data
    res
      .status(201)
      .json({ message: "User registered successfully", tokenid:token, data:user});
  } catch (error) {
    // Handle any errors during the process
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// login user

exports.loginUser = async (req,res) => {
  const { email, password } = req.body;

  // Validate the presence of email and password
  if (!email || !password) {
    return res.status(400).json({ message: "All fields must be filled" });
  }
  try {
    // Check if the user exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    // Compare the provided password with the hashed password stored in the database
    const decryptedPassword = await bcrypt.compare(password, user.password);
    if (!decryptedPassword) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = createToken(user._id);
      // Respond with a success message and the user data
      res.status(200).json({ message: "User logged in successfully",tokenid:token, data: user });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};



// delete user
exports.deleteUser = async (req, res) => {
  try {
    const {id} = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully", data: deletedUser });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

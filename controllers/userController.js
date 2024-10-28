const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Register a new user
exports.registerUser = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({ username, password, email });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ error: "Failed to register user" });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Failed to log in" });
  }
};

// Fetch user details by ID
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user details" });
  }
};

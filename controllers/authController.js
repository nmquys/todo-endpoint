const User = require("../schema/userSchema");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//tao jwt jwt token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

//register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //kiem tra ton tai
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    //tao user moi
    const user = new User({ name, email, password });
    await user.save();

    //tao token
    const token = generateToken(user._id);

    //tra ve token
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    //tra ve token
    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

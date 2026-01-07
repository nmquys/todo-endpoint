const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
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
async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    //kiem tra ton tai
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    } else {
      const hash = await bcrypt.hash(password, 10);
      let newUser = new User({
        name,
        email,
        password: hash,
      });
      const user = await newUser.save();
      //tao token
      // const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      //   expiresIn: "1h",
      // });
      const token = generateToken(user._id);
      //tra ve token
      res.status(201).json({ token });
    }
  } catch (error) {
    res.status(500).json({ error: "sai o day " + error.message });
  }
}

//login
async function login(req, res) {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(400).json({ error: "Invalid email or password" });
      }
      // const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      //   expiresIn: "1h",
      // });
      const token = generateToken(user._id);
      return res.status(200).json({ token });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  register,
  login,
};

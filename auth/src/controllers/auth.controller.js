const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function registerUser(req, res) {
  try {
    const {
      username,
      email,
      password,
      fullName: { firstName, lastName },
    } = req.body;

    const isUserAlreadyExits = await userModel.findOne({
      $or: [{ email }, { username }],
    });

    if (isUserAlreadyExits) {
      return res
        .status(400)
        .json({ message: "User with given email or username already exists" });
    }
    const hash = await bcrypt.hash(password, 10);

    const user = new userModel({
      username,
      email,
      password: hash,
      fullName: { firstName, lastName },
    });

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      secure: true, // set to true in production
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
        addresses: user.addresses,
      },
    });
  } catch (e) {
    console.error("Error in registerUser:", e);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { registerUser };

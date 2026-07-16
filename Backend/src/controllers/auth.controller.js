const dotenv = require("dotenv").config();
const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const blacklistToken = require("../models/blacklist.model");
const tokenBlackListModel = require("../models/blacklist.model");

/**
 *@name userRegister
 *@description register a new user , expects username, email and password in the request
 *@access public
 */

const userRegister = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(401).json({
      message: "All Fields required",
    });
  }

  const isUserExists = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (isUserExists) {
    if (isUserExists.username === username) {
      return res.status(401).json({
        message: "username Already exists",
      });
    } else {
      return res.status(401).json({
        message: "Email Already exists",
      });
    }
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    username,
    email,
    password: hash,
  });

  const token = JWT.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    message: "user Created successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
};

/**
 *@name userLogin
 *@description login a new user , expects email and password in the request
 *@access public
 */

const userLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(404).json({
      message: "No account found with this email",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({
      message: "Invalid password",
    });
  }

  const token = JWT.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    message: "user logged in successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
};

/**
 *@name userlogout
 *@description: clear token from user Cookie and added the token in blacklist
 *@access Public
 */

const userlogout = async (req, res) => {
  const token = req.cookies.token;

  if (token) {
    await tokenBlackListModel.create({ token });
  }

  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  res.status(200).json({
    message: "user logged out successfully",
  });
};

/**
 *@name getMeController
 *@description: get the current logged in details,
 *@access Public
 */

const getMeController = async (req, res) => {
  const user = await userModel.findById(req.user.id);

  res.status(200).json({
    message: "user details fetched successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
};

module.exports = { userRegister, userLogin, userlogout, getMeController };

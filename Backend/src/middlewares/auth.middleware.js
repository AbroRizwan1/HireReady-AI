const JWT = require("jsonwebtoken");
const blacklistModel = require("../models/blacklist.model");
const authUser = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "token not found",
    });
  }

  const isTokenBlackListed = blacklistModel.findOne({ token });

  if (!isTokenBlackListed) {
    return res.status(401).json({
      message: "token is invalid",
    });
  }

  try {
    const decoded = JWT.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalide Token",
    });
  }
};

module.exports = { authUser };

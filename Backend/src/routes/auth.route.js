const express = require("express");
const AuthController = require("../controllers/auth.controller");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");

/**
 *@route POST -> /api/auth/register
 *@description: register new user
 *@access Public
 */

router.post("/register", AuthController.userRegister);

/**
 *@route POST -> /api/auth/login
 *@description: Login user with email and password
 *@access Public
 */

router.post("/login", AuthController.userLogin);

/**
 *@route get -> /api/auth/logout
 *@description: clear token from user Cookie and added the token in blacklist
 *@access Public
 */

router.get("/logout", AuthController.userlogout);

/**
 *@route get -> /api/auth/get-me
 *@description: get the current user logged in details
 *@access Private
 */

router.get("/get-me", authMiddleware.authUser, AuthController.getMeController);

module.exports = router;

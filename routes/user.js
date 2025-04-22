const express = require("express");
const router = express.Router();
const passport = require("passport");
const {isLoggedIn, saveredirectUrl} = require("../middleware.js");
const userController = require("../controllers/user.js");

// signup form
router.get("/signUp",(userController.rendersignUp));

// now signup
router.post("/signUp",(userController.signUp));

// login form
router.get("/login",(userController.renderlogin));

// authentication
router.post("/login",saveredirectUrl,passport.authenticate("local",{failureRedirect:"/login", failureFlash:true}),(userController.login));

// logout 
router.get("/logout",(userController.logout));

// privacy
router.get("/privacy",(userController.privacyForm));

// term and condtions
router.get("/termAndcondition",(userController.termAndconditions));

module.exports = router;
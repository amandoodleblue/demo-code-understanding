const { userController } = require("../../controllers/index");
const { verifyToken } = require("../../middleware");

const express = require("express");
const userRoutes = express.Router();
const passport = require('passport');
let validator = require("express-joi-validation").createValidator({
  passError: true
});
const {
  getOTP,
  verifyOTPAndRegister,
  verifyOTPAndLogin,
  loginWithPassword,
  changePassword,
  forgotPassword,
  resetPassword,
  updateUser,
  userStatus,
  loginWithUsernameAndPassword,
  terms
} = require("../../validators/user.validator");

userRoutes.post('/otp/get', validator.body(getOTP), userController.getOTP);
userRoutes.post('/otp/verify/register', validator.body(verifyOTPAndRegister), userController.verifyOTPAndRegister);
userRoutes.post('/otp/verify/login', validator.body(verifyOTPAndLogin), userController.verifyOTPAndLogin);

userRoutes.post('/login/username/password', validator.body(loginWithUsernameAndPassword), userController.loginWithUsername);

userRoutes.post('/login/password', validator.body(loginWithPassword), userController.loginWithPassword);

userRoutes.post('/logout', verifyToken.validateToken, userController.logout);

userRoutes.post('/change/password', verifyToken.validateToken, validator.body(changePassword), userController.changePassword);

userRoutes.post('/forgot/password', validator.body(forgotPassword), userController.forgotPassword);

userRoutes.post('/reset/password', verifyToken.validateTokenResetToken, validator.body(resetPassword), userController.resetPassword);

userRoutes.get('/', verifyToken.validateToken, userController.getUserById);

userRoutes.delete('/delete', verifyToken.validateToken, userController.deleteUser);

userRoutes.put('/', verifyToken.validateToken, validator.body(updateUser), userController.updateUser);

userRoutes.put('/terms', verifyToken.validateToken, validator.body(terms), userController.updateUser);

userRoutes.put('/status', verifyToken.validateToken, validator.body(userStatus), userController.updateUser);

userRoutes.get('/index', function (req, res) {
  res.render('pages/auth.ejs'); // load the index.ejs file
});

userRoutes.get('/profile', isLoggedIn, function (req, res) {
  res.render('pages/success.ejs', {
    user: req.user // get the user out of session and pass to template
  });
});

userRoutes.get('/error', isLoggedIn, function (req, res) {
  res.render('pages/error.ejs');
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/user/index');
}

userRoutes.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
 
userRoutes.get('/auth/google/callback',passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
    // Successful authentication, redirect success.
    res.redirect('/api/v1/user/profile');
});

module.exports = userRoutes;

const express = require("express");
const register = require("./auth/register");
const login = require("./auth/login");
const profile = require("./profile");
const passwordReset = require("./auth/login/password-reset");
const TwoFa = require("./auth/2FA");

const app = express();
app.use(express.json());

app.post("/auth/register/phone", register.registerPhone);
app.post("/auth/register/google", register.registerGoogle);
app.post("/auth/register/facebook", register.registerFacebook);
// app.post("/auth/register/apple", register.registerApple);

app.post("/auth/login/password-reset/new-password", passwordReset.newPassword);
app.post("/auth/login/password-reset/request", passwordReset.request);
app.post("/auth/login/password-reset/verify", passwordReset.verify);

app.post("/auth/login/phone", login.loginPhone);
app.post("/auth/login/email", login.loginEmail);
app.post("/auth/login/google", login.loginGoogle);
// app.post("/auth/login/facebook", login.loginFacebook);
// app.post("/auth/login/apple", login.loginApple);

app.post("/auth/profile/create", profile.createProfile);

app.post("/auth/2fa/enable-sms", TwoFa.enableSms);

module.exports = app;

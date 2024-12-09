const express = require("express");
// const register = require("./auth/register");
// const login = require("./auth/login");
const profile = require("./profile");

const app = express();
app.use(express.json());

// app.post("/auth/register/phone", register.registerPhone);
// app.post("/auth/register/google", register.registerGoogle);
// app.post("/auth/register/facebook", register.registerFacebook);
// app.post("/auth/register/apple", register.registerApple);

// app.post("/auth/login/phone", login.loginPhone);
// app.post("/auth/login/google", login.loginGoogle);
// app.post("/auth/login/facebook", login.loginFacebook);
// app.post("/auth/login/apple", login.loginApple);

app.post("/profile/create", profile.createProfile);

module.exports = app;

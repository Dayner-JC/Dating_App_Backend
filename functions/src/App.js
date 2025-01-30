const express = require("express");
const register = require("./auth/register");
const login = require("./auth/login");
const profile = require("./profile");
const passwordReset = require("./auth/login/password-reset");
const TwoFa = require("./auth/2FA");
const emailVerify = require("./auth/login/email-verify");
const editProfile = require("./profile/edit");
const deleteUser = require("./user");

const app = express();
app.use(express.json());

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});

// Register
app.post("/auth/register/phone", register.registerPhone);
app.post("/auth/register/google", register.registerGoogle);
app.post("/auth/register/facebook", register.registerFacebook);
// app.post("/auth/register/apple", register.registerApple);

// Password reset
app.post("/auth/login/password-reset/new-password", passwordReset.newPassword);
app.post("/auth/login/password-reset/request", passwordReset.request);
app.post("/auth/login/password-reset/verify", passwordReset.verify);

// Login
app.post("/auth/login/phone", login.loginPhone);
app.post("/auth/login/email", login.loginEmail);
app.post("/auth/login/email-verify/verify", emailVerify.verify);
app.post("/auth/login/google", login.loginGoogle);
// app.post("/auth/login/facebook", login.loginFacebook);
// app.post("/auth/login/apple", login.loginApple);

// Create profile
app.post("/profile/create", profile.createProfile);
app.post("/profile/request-data", profile.requestData);

// Edit profile
app.post("/profile/edit/edit-name", editProfile.editName);
app.post("/profile/edit/edit-birthday", editProfile.editBirthday);
app.post("/profile/edit/edit-gender", editProfile.editGender);
app.post("/profile/edit/edit-height", editProfile.editHeight);
app.post("/profile/edit/edit-preference", editProfile.editPreference);
app.post("/profile/edit/edit-intentions", editProfile.editIntentions);
app.post("/profile/edit/edit-about", editProfile.editAbout);
app.post("/profile/edit/edit-interests", editProfile.editInterests);
app.post("/profile/edit/edit-location", editProfile.editLocation);
app.post("/profile/edit/edit-photos", editProfile.editPhotos);

// 2FA
app.post("/auth/2fa/enable-sms", TwoFa.enableSms);
app.post("/auth/2fa/update-sms", TwoFa.updateSMS);
app.post("/auth/2fa/app-generate", TwoFa.appGenerate);
app.post("/auth/2fa/app-verify", TwoFa.appVerify);
app.post("/auth/2fa/isEnable-verify", TwoFa.isEnableVerify);

// Delete User
app.post("/user/delete", deleteUser.deleteUser);

module.exports = app;

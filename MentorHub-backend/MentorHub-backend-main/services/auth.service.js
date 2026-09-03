const UserModel = require("../models/user.model");
const ApiError = require("../helper/apiError");
const httpStatus = require("../util/httpStatus");
const config = require("../config");
const tokenService = require("./token.service");
const emailService = require("./email.service");

const createUser = async (data) => {
  const approvalStatus = data.role === "mentor" ? "pending" : "approved";
  return await UserModel.create({ ...data, approvalStatus });
};

const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await UserModel.findOne({ email }).select("+password");

  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.unauthorized, "Incorrect email or password");
  }

  return user;
};

const forgotPassword = async (email) => {
  const user = await UserModel.findOne({ email });

  // Don't reveal whether the email exists - just return silently either way.
  if (!user) return;

  const resetToken = await tokenService.generateResetPasswordToken(user._id);
  const resetLink = `${config.frontendUrl}/reset-password?token=${resetToken}`;

  await emailService.sendResetPasswordMail(
    user.email,
    user.name,
    resetLink,
    config.jwt.resetPasswordExpirationMinutes
  );
};

const resetPassword = async (token, newPassword) => {
  let payload;
  try {
    payload = await tokenService.verifyToken(token, "resetPassword");
  } catch (error) {
    throw new ApiError(
      httpStatus.badRequest,
      "Reset link is invalid or has expired"
    );
  }

  const user = await UserModel.findById(payload._id);
  if (!user) {
    throw new ApiError(httpStatus.badRequest, "User no longer exists");
  }

  user.password = newPassword;
  await user.save();
};

module.exports = {
  createUser,
  loginUserWithEmailAndPassword,
  forgotPassword,
  resetPassword,
};

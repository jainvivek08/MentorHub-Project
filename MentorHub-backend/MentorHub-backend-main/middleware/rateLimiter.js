const rateLimit = require("express-rate-limit");

// Applies to every request. Generous enough that normal use never hits it,
// but stops obvious scraping/abuse.
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

// Much stricter - only applied to signup/signin/forgot-password, since
// these are the classic brute-force / credential-stuffing targets.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many attempts. Please try again in a few minutes.",
  },
});

module.exports = {
  generalLimiter,
  authLimiter,
};

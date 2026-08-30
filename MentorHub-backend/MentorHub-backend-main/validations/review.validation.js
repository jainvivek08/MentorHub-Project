const Joi = require("joi");

const createReviewValidation = Joi.object().keys({
  bookingId: Joi.string().required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().allow("").max(1000).optional(),
});

module.exports = {
  createReviewValidation,
};

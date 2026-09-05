const Joi = require("joi");

const sendMessageSchema = Joi.object({
  message: Joi.string().trim().min(1).max(2000).required(),
  // Frontend sends back the last few turns so the bot has short-term memory.
  // Keep this capped so no one can smuggle a huge payload into the LLM call.
  history: Joi.array()
    .items(
      Joi.object({
        role: Joi.string().valid("user", "assistant").required(),
        content: Joi.string().trim().min(1).max(2000).required(),
      })
    )
    .max(10)
    .optional(),
});

module.exports = {
  sendMessageSchema,
};
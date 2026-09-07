const Joi = require("joi");

const timeSlotSchema = Joi.object({
  startTime: Joi.string().required(),
  endTime: Joi.string().required(),
});

const weeklyAvailabilitySchema = Joi.object({
  monday: Joi.array().items(timeSlotSchema).optional(),
  tuesday: Joi.array().items(timeSlotSchema).optional(),
  wednesday: Joi.array().items(timeSlotSchema).optional(),
  thursday: Joi.array().items(timeSlotSchema).optional(),
  friday: Joi.array().items(timeSlotSchema).optional(),
  saturday: Joi.array().items(timeSlotSchema).optional(),
  sunday: Joi.array().items(timeSlotSchema).optional(),
});

// NEW: one-off date overrides, e.g. { date: "2026-09-08", slots: [...] }
const specificAvailabilitySchema = Joi.object({
  date: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required(),
  slots: Joi.array().items(timeSlotSchema).required(),
});

const createAvailabilityValidation = Joi.object({
  weeklyAvailability: weeklyAvailabilitySchema.optional(),
  specificAvailability: Joi.array()
    .items(specificAvailabilitySchema)
    .optional(),
  unavailableDates: Joi.array().items(Joi.date()).optional(),
});

module.exports = {
  createAvailabilityValidation,
};
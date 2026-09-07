const AvailabilityModel = require("../models/availability.model");
const ApiError = require("../helper/apiError");
const httpStatus = require("../util/httpStatus");
const moment = require("moment");
const BookingModel = require("../models/booking.model");

const createAvailability = async (userId, availabilityData) => {
  return await AvailabilityModel.findOneAndUpdate(
    { userId },
    { userId, ...availabilityData },
    { new: true, upsert: true, runValidators: true }
  );
};

const updateAvailability = async (userId, availabilityData) => {
  try {
    const availability = await AvailabilityModel.findOneAndUpdate(
      { userId },
      availabilityData,
      { new: true, runValidators: true }
    );
    if (!availability) {
      throw new ApiError(httpStatus.NOT_FOUND, "Availability not found");
    }
    return availability;
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Error updating availability");
  }
};

const getAvailability = async (userId) => {
  return await AvailabilityModel.findOne({ userId });
};

const getMentorAvailabilityForNext14Days = async (
  userId,
  durationInMinutes
) => {
  try {
    // Fetch the mentor's availability by userId
    const mentorAvailability = await AvailabilityModel.findOne({ userId });

    if (!mentorAvailability) {
      throw new ApiError(httpStatus.notFound, "Mentor availability not found.");
    }

    const { weeklyAvailability, unavailableDates, specificAvailability } =
      mentorAvailability;

    const unavailableDateSet = new Set(
      unavailableDates.map((date) => moment(date).format("YYYY-MM-DD"))
    );

    // NEW: map of "YYYY-MM-DD" -> slots[], for one-off date overrides.
    // If a date is in here, it wins over the weekly recurring pattern -
    // it does NOT repeat on other weeks.
    const specificMap = new Map(
      (specificAvailability || []).map((entry) => [entry.date, entry.slots])
    );

    // Function to break down time slots into smaller durations with full date-time
    const getSlots = (currentDate, startTime, endTime, duration) => {
      const start = moment(`${currentDate}T${startTime}`);
      const end = moment(`${currentDate}T${endTime}`);
      const slots = [];

      while (start < end) {
        const slotEnd = moment(start).add(duration, "minutes");
        if (slotEnd > end) break;
        slots.push({
          startTime: start.format("HH:mm"),
          endTime: slotEnd.format("HH:mm"),
          fullStart: start.toISOString(),
          fullEnd: slotEnd.toISOString(),
        });
        start.add(duration, "minutes");
      }

      return slots;
    };

    // Get all bookings for the next 14 days for the mentor.
    // IMPORTANT: only "confirmed" (i.e. paid) bookings should block a slot.
    // A booking is created with status "pending" the moment a user clicks
    // "Book Session", *before* payment is completed - it only becomes
    // "confirmed" once Razorpay's webhook fires. If we don't filter by
    // status here, an abandoned/incomplete checkout (payment never
    // finished, or the webhook never reached the server, e.g. in local
    // dev) permanently blocks that date/time for every future customer,
    // even though the slot was never actually paid for.
    const bookings = await BookingModel.find({
      mentor: userId,
      status: "confirmed",
      dateAndTime: {
        $gte: moment().startOf("day").toDate(),
        $lte: moment().add(14, "days").endOf("day").toDate(),
      },
    });

    const bookedSlots = new Set(
      bookings.map((booking) => moment(booking.dateAndTime).toISOString())
    );

    // Generate availability for the next 14 days
    const next14DaysAvailability = [];
    for (let i = 0; i < 14; i++) {
      const currentDate = moment().add(i, "days").format("YYYY-MM-DD");

      // Skip if the date is marked as unavailable
      if (unavailableDateSet.has(currentDate)) {
        continue;
      }

      // NEW: a specific-date override always wins over the weekly pattern
      // for that exact date - it will not show up on any other date.
      let dailyAvailability;
      if (specificMap.has(currentDate)) {
        dailyAvailability = specificMap.get(currentDate);
      } else {
        const dayOfWeek = moment(currentDate).format("dddd").toLowerCase();
        dailyAvailability = weeklyAvailability[dayOfWeek] || [];
      }

      const slotsForDay = [];

      dailyAvailability.forEach((slot) => {
        const slots = getSlots(
          currentDate,
          slot.startTime,
          slot.endTime,
          durationInMinutes
        );

        // Exclude slots that are already booked
        const availableSlots = slots.filter(
          (slot) => !bookedSlots.has(slot.fullStart)
        );

        slotsForDay.push(...availableSlots);
      });

      if (slotsForDay.length > 0) {
        next14DaysAvailability.push({
          date: currentDate,
          slots: slotsForDay,
        });
      }
    }

    return next14DaysAvailability;
  } catch (error) {
    console.error("Error fetching mentor availability:", error);
    throw error;
  }
};

module.exports = {
  createAvailability,
  updateAvailability,
  getAvailability,
  getMentorAvailabilityForNext14Days,
};

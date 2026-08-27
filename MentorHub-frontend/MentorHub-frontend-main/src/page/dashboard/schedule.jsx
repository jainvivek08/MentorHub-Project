import React, { useState, useEffect } from "react";
import { Calendar, Modal, Button, Checkbox, message } from "antd";
import moment from "moment";
import Dashboard from "./dashboard";
import availabilityApi from "../../apiManger/availability";

const SLOT_OPTIONS = [
  { label: "09:00 AM - 09:59 AM", startTime: "09:00", endTime: "09:59" },
  { label: "10:00 AM - 10:59 AM", startTime: "10:00", endTime: "10:59" },
  { label: "11:00 AM - 11:59 AM", startTime: "11:00", endTime: "11:59" },
  { label: "12:00 PM - 12:59 PM", startTime: "12:00", endTime: "12:59" },
  { label: "01:00 PM - 01:59 PM", startTime: "13:00", endTime: "13:59" },
  { label: "02:00 PM - 02:59 PM", startTime: "14:00", endTime: "14:59" },
  { label: "03:00 PM - 03:59 PM", startTime: "15:00", endTime: "15:59" },
];

const Schedule = () => {
  const [weeklyAvailability, setWeeklyAvailability] = useState({
    sunday: [],
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
  });
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const res = await availabilityApi.getMyAvailability();
        const data = res.data.availability;
        if (data) {
          setWeeklyAvailability(data.weeklyAvailability || {});
          setUnavailableDates(
            (data.unavailableDates || []).map((d) =>
              moment(d).format("YYYY-MM-DD")
            )
          );
        }
      } catch (err) {
        console.log("No existing availability found");
      }
    };
    fetchAvailability();
  }, []);

  const handleSelectDate = (date) => {
    const formattedDate = moment(date).format("YYYY-MM-DD");

    if (moment(formattedDate).isBefore(moment().format("YYYY-MM-DD"))) {
      return;
    }

    setSelectedDate(formattedDate);

    const dayOfWeek = moment(formattedDate).format("dddd").toLowerCase();
    const existingSlots = weeklyAvailability[dayOfWeek] || [];
    const preselected = SLOT_OPTIONS.filter((opt) =>
      existingSlots.some(
        (slot) =>
          slot.startTime === opt.startTime && slot.endTime === opt.endTime
      )
    ).map((opt) => opt.label);

    setSelectedSlots(preselected);
    setShowModal(true);
  };

  const handleSlotSelection = (value) => {
    setSelectedSlots(value);
  };

  const saveToBackend = async (updatedWeekly, updatedUnavailable) => {
    setLoading(true);
    try {
      // 🔧 Fix: har din ke slots se _id (aur koi extra field) hatao
      const cleanedWeekly = Object.fromEntries(
        Object.entries(updatedWeekly).map(([day, slots]) => [
          day,
          slots.map(({ startTime, endTime }) => ({ startTime, endTime })),
        ])
      );

      await availabilityApi.saveAvailability({
        weeklyAvailability: cleanedWeekly,
        unavailableDates: updatedUnavailable,
      });
      message.success("Availability saved successfully!");
    } catch (err) {
      message.error("Failed to save availability. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const handleScheduleSave = async () => {
    if (!selectedDate) return;

    const dayOfWeek = moment(selectedDate).format("dddd").toLowerCase();
    const newSlots = SLOT_OPTIONS.filter((opt) =>
      selectedSlots.includes(opt.label)
    ).map((opt) => ({ startTime: opt.startTime, endTime: opt.endTime }));

    const updatedWeekly = {
      ...weeklyAvailability,
      [dayOfWeek]: newSlots,
    };

    const updatedUnavailable = unavailableDates.filter(
      (d) => d !== selectedDate
    );

    setWeeklyAvailability(updatedWeekly);
    setUnavailableDates(updatedUnavailable);
    setShowModal(false);
    setSelectedSlots([]);
    setSelectedDate(null);

    await saveToBackend(updatedWeekly, updatedUnavailable);
  };

  const handleMarkUnavailable = async () => {
    if (!selectedDate) return;

    const updatedUnavailable = [...new Set([...unavailableDates, selectedDate])];
    setUnavailableDates(updatedUnavailable);
    setShowModal(false);
    setSelectedSlots([]);
    setSelectedDate(null);

    await saveToBackend(weeklyAvailability, updatedUnavailable);
  };

  const dateCellRender = (value) => {
    const currentDate = moment(value).format("YYYY-MM-DD");

    if (unavailableDates.includes(currentDate)) {
      return <div className="bg-red-500 text-white p-2 rounded">Unavailable</div>;
    }

    const dayOfWeek = moment(currentDate).format("dddd").toLowerCase();
    const slotsForDay = weeklyAvailability[dayOfWeek] || [];

    if (slotsForDay.length) {
      return (
        <div>
          {slotsForDay.map((slot, index) => (
            <div key={index} className="bg-green-200 p-1 rounded mb-1">
              {slot.startTime} - {slot.endTime}
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <Dashboard>
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Schedule Time Slots</h2>
        <p className="text-gray-500 mb-4">
          Note: Setting slots for a date applies to every{" "}
          {selectedDate ? moment(selectedDate).format("dddd") : "that weekday"}{" "}
          (recurring weekly).
        </p>

        <Calendar
          fullscreen={false}
          dateCellRender={dateCellRender}
          onSelect={handleSelectDate}
        />

        <Modal
          title={`Select Available Time Slots${
            selectedDate ? ` (${moment(selectedDate).format("dddd")})` : ""
          }`}
          open={showModal}
          onCancel={() => setShowModal(false)}
          footer={[
            <Button key="cancel" onClick={() => setShowModal(false)}>
              Cancel
            </Button>,
            <Button
              key="save"
              type="primary"
              loading={loading}
              onClick={handleScheduleSave}
            >
              Save Slots
            </Button>,
            <Button
              key="unavailable"
              danger
              loading={loading}
              onClick={handleMarkUnavailable}
            >
              Mark Unavailable
            </Button>,
          ]}
        >
          <Checkbox.Group
            options={SLOT_OPTIONS.map((opt) => opt.label)}
            onChange={handleSlotSelection}
            value={selectedSlots}
          />
        </Modal>
      </div>
    </Dashboard>
  );
};

export default Schedule;

import AxiosInstances from ".";

const getMentorAvailability = async (mentorId, duration) => {
  return await AxiosInstances.get(
    `availability/${mentorId}?duration=${duration}`
  );
};

const getMyAvailability = async () => {
  return await AxiosInstances.get(`availability`);
};

const saveAvailability = async (data) => {
  return await AxiosInstances.post(`availability`, data);
};

export default { getMentorAvailability, getMyAvailability, saveAvailability };

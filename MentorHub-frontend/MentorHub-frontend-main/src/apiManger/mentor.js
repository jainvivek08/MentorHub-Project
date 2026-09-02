import AxiosInstances from ".";

// Define the functions
const getAllMentors = (params = {}) => {
  return AxiosInstances.get("/mentor", { params });
};

const getMentorByUsername = (userName) => {
  return AxiosInstances.get("/mentor/" + userName);
};

// Assign the object to a variable
const mentorAPI = {
  getAllMentors,
  getMentorByUsername,
};

// Export the variable as default
export default mentorAPI;

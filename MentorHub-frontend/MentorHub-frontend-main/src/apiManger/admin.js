import AxiosInstances from ".";

const getPendingMentors = () => {
  return AxiosInstances.get("/admin/mentors/pending");
};

const approveMentor = (mentorId) => {
  return AxiosInstances.patch(`/admin/mentors/${mentorId}/approve`);
};

const rejectMentor = (mentorId) => {
  return AxiosInstances.patch(`/admin/mentors/${mentorId}/reject`);
};

const adminAPI = {
  getPendingMentors,
  approveMentor,
  rejectMentor,
};

export default adminAPI;

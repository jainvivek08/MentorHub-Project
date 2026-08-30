import AxiosInstances from ".";

const createReview = (data) => {
  return AxiosInstances.post("/review", data);
};

const getMentorReviews = (mentorId) => {
  return AxiosInstances.get(`/review/${mentorId}`);
};

export default { createReview, getMentorReviews };

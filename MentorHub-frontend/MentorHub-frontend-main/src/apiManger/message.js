import AxiosInstances from ".";

const getMessages = (bookingId) => {
  return AxiosInstances.get(`/message/${bookingId}`, {
    // Polling every few seconds shouldn't spam error toasts if it
    // briefly fails - just retry on the next tick silently.
    skipErrorToast: true,
  });
};

const sendMessage = (bookingId, text) => {
  return AxiosInstances.post(`/message/${bookingId}`, { text });
};

const messageAPI = {
  getMessages,
  sendMessage,
};

export default messageAPI;

import AxiosInstances from ".";

const sendMessage = async (message, history) => {
  return await AxiosInstances.post(
    "/chatbot/message",
    { message, history },
    { skipErrorToast: true } // widget shows its own inline error, no need for a toast too
  );
};

// eslint-disable-next-line import/no-anonymous-default-export
export default { sendMessage };
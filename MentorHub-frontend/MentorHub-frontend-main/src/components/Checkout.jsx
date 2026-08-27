import { RAZORPAY_KEY_ID } from "../const/env.const";

const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

const handlePayment = async (orderId, handler, prefill = {}) => {
  await loadScript("https://checkout.razorpay.com/v1/checkout.js");

  const paymentObject = new window.Razorpay({
    key: RAZORPAY_KEY_ID,
    order_id: orderId,
    prefill: {
      name: prefill.name || "",
      email: prefill.email || "",
      contact: prefill.contact || "9999999999",
    },
    handler: function (response) {
      console.log(response);
      handler?.(response);
    },
  });
  paymentObject.open();
};

export default handlePayment;

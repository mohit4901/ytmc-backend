import Razorpay from "razorpay";

let razorpayInstance;

const createRazorpayInstance = () => {
  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    console.log("Razorpay Initialized Successfully");
  }

  return razorpayInstance;
};

export default createRazorpayInstance;

import api from "configs/api";

const sendOtp = async (mobile) => {
  try {
    const response = await api.post("auth/send-otp", { mobile: mobile });
    return { response };
    // since we hae the base url in api.js, we dont need to write the whole url and it will
    // attach this part to the end of our base url to create a whole link.
    // notice that the post method is to post the data in () so we can send the
    // mobile number we took from the input as well.
  } catch (error) {
    return { error };
  }
};

const checkOtp = async (mobile, code) => {
  try {
    const response = await api.post("auth/check-otp", { mobile, code });
    return { response };
  } catch (error) {
    return { error };
  }
};

export { sendOtp, checkOtp };


import axios from "axios";

const API_URL = "https://loopus.nguyenhoangan.site/otp";

export const verifyRegisterOtp = async (email, otp) => {
  try {
    const res = await axios.post(
      `${API_URL}/verify-register`,
      null,
      { params: { email, otp } }
    );

    console.log("Verify OTP response:", res.data);

    return {
      status: res.data?.status,
      data: res.data,
      success: res.data?.status === 200, 
      message: res.data?.message,
    };
  } catch (error) {
    console.error("Verify OTP error:", error.response?.data || error.message);

    let message = error.response?.data?.message || "Xác minh OTP thất bại";

    return {
      status: error.response?.status || 500,
      message,
      success: false,
    };
  }
};


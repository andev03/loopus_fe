import axios from "axios";

const API_URL = "https://loopus.nguyenhoangan.site";

export const sendForgotPasswordOtp = async (email) => {
  try {
    const res = await axios.post(
      `${API_URL}/api/users/otp-forgot-password`,
      null,
      { params: { email } }
    );

    console.log("Send OTP response:", res.data);

    return {
      success: res.data?.status === 0 || res.data?.status === 200,  
      message: res.data?.message,
      data: res.data,
    };
  } catch (error) {
    console.error("Send OTP error:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || "Gửi OTP thất bại",
    };
  }
};

export const verifyForgotPassword = async (email, otp, password, confirmPassword) => {
  try {
    const res = await axios.post(`${API_URL}/otp/verify-forgot-password`, {
      email,
      otp,
      password,
      confirmPassword,
    });

    console.log("Verify forgot password response:", res.data);

    return {
      success: res.data?.status === 0 || res.data?.status === 200,
      message: res.data?.message,
      data: res.data,
    };
  } catch (error) {
    console.error("Verify forgot password error:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || "Đặt lại mật khẩu thất bại",
    };
  }
};
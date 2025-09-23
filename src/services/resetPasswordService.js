import axios from "axios";

const API_URL = "https://loopus.nguyenhoangan.site";

export const sendForgotPasswordOtp = async (email) => {
  try {
    const res = await axios.post(
      `${API_URL}/api/users/otp-forgot-password`,
      null,
      { params: { email } }
    );
    return {
      success: res.data?.status === 200,   
      message: res.data?.message,
      data: res.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Gửi OTP thất bại",
    };
  }
};

export const verifyForgotPasswordOtp = async (email, otp) => {
  try {
    const res = await axios.post(
      `${API_URL}/otp/verify-forgot-password`,
      null,
      { params: { email, otp } }
    );
    return {
      success: res.data?.status === 200,   
      message: res.data?.message,
      data: res.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Xác minh OTP thất bại",
    };
  }
};

export const resetPassword = async (email, password, confirmPassword) => {
  try {
    const res = await axios.post(`${API_URL}/otp/reset-password`, {
      email,
      password,
      confirmPassword,
    });
    return {
      success: res.data?.status === 200,  
      message: res.data?.message,
      data: res.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Đặt lại mật khẩu thất bại",
    };
  }
};

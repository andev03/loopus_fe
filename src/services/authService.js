import axios from "axios";

const API_URL = "https://loopus.nguyenhoangan.site/api/users";

export const register = async (userData) => {
  try {
    const res = await axios.post(`${API_URL}/register`, userData);
    console.log("Register API response:", res.data);

    // ✅ Check backend status
    const success = res.data?.status === 200;

    return {
      status: res.data?.status,
      data: res.data,
      success,
      message: res.data?.message
    };
  } catch (error) {
    console.log("Register error:", error.response?.data || error.message);

    let message = error.response?.data?.message || "Đăng ký thất bại";

    return {
      status: error.response?.status || 500,
      message,
      success: false
    };
  }
};

export const login = async (username, password) => {
  try {
    const res = await axios.post(`${API_URL}/login`, { username, password });
    console.log("API response:", res.data);

    return {
      status: res.data?.status,
      message: res.data?.message,
      user: res.data?.data,   // 👈 user object có userId
      token: res.data?.token, // 👈 nếu backend có trả token
    };
  } catch (error) {
    console.log("Login error:", error.response?.data || error.message);

    let message = error.response?.data?.message || "Đăng nhập thất bại";
    return {
      status: error.response?.status || 500,
      message,
    };
  }
};



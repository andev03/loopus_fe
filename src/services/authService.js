import axios from "axios";

const API_URL = "https://loopus.nguyenhoangan.site/api/users";

export const register = async (userData) => {
  try {
    const res = await axios.post(`${API_URL}/register`, userData);
    console.log("Register API response:", res.data);
    
    return {
      status: res.status,
      data: res.data,
      success: true
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

    return res.data;
  } catch (error) {
    console.log("Login error:", error.response?.data || error.message);
    let message =
      error.response?.data?.message || "Đăng nhập thất bại";

     if (lowerMsg.includes("Invalid username or password")) {
      message = "Sai tài khoản hoặc mật khẩu";
    }

    return {
      status: error.response?.status || 500,
      message,
    };
  }
};

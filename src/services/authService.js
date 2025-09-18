import axios from "axios";

const API_URL = "https://loopus.nguyenhoangan.site/api/users";


export const login = async (username, password) => {
  try {
    const res = await axios.post(`${API_URL}/login`, {
      username,
      password,
    });
    return res.data; 
  } catch (error) {
    throw error.response?.data || { message: "Login failed" };
  }
};
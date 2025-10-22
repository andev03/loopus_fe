import axios from "axios";

const API_BASE_URL = "https://loopus.nguyenhoangan.site/api";

export const createFeedback = async (userId, type, content) => {
  try {
    console.log("📤 [CREATE FEEDBACK] Gửi feedback:", { userId, type, content });

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("type", type);
    formData.append("content", content);

    const response = await axios.post(`${API_BASE_URL}/feedback`, formData, {
      headers: {
        Accept: "*/*",
        "Content-Type": "multipart/form-data",
      },
      timeout: 10000,
    });

    console.log("✅ [CREATE FEEDBACK] Phản hồi server:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ [CREATE FEEDBACK] Lỗi khi gửi feedback:",
      error.response?.data || error.message
    );
    throw error;
  }
};

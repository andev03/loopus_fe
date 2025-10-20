import axios from "axios";

const API_BASE_URL = "https://loopus.nguyenhoangan.site/api";

/**
 * 🟢 User gửi feedback
 * @param {string} userId - UUID của user
 * @param {string} type - "bug" hoặc "suggestion"
 * @param {string} content - Nội dung góp ý / báo lỗi
 * @param {File | null} file - File ảnh (optional)
 */
export const createFeedback = async (userId, type, content, file) => {
  try {
    console.log("📤 [CREATE FEEDBACK] Gửi feedback:", {
      userId,
      type,
      content,
      hasFile: !!file,
    });

    const formData = new FormData();

    // request body dạng JSON (stringify)
    const requestData = {
      userId,
      type,
      content,
    };
    formData.append("request", JSON.stringify(requestData));

    // nếu có file ảnh thì append vào
    if (file) {
      formData.append("file", {
        uri: file.uri,
        type: file.type || "image/jpeg",
        name: file.name || "feedback.jpg",
      });
    }

    const response = await axios.post(`${API_BASE_URL}/feedback`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("✅ [CREATE FEEDBACK] Phản hồi server:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ [CREATE FEEDBACK] Lỗi khi gửi feedback:", error);
    throw error;
  }
};

import axios from "axios";

const API_BASE_URL = "https://loopus.nguyenhoangan.site/api/support";

/**
 * 🟢 Gửi tin nhắn của user
 * @param {string} userId - UUID của user
 * @param {string} message - Nội dung tin nhắn
 */
export const sendUserMessage = async (userId, message) => {
  try {
    console.log("📤 [SEND MESSAGE] Gửi tin nhắn:", { userId, message });

    const response = await axios.post(`${API_BASE_URL}/${userId}/chat`, null, {
      params: { message },
    });

    console.log("✅ [SEND MESSAGE] Phản hồi server:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ [SEND MESSAGE] Lỗi khi gửi tin nhắn:",
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * 🟢 Lấy tất cả tin nhắn trong 1 box chat
 * @param {string} chatId - UUID của box chat
 */
export const getChatMessages = async (chatId) => {
  try {
    console.log("📥 [GET MESSAGES] Lấy tin nhắn cho chatId:", chatId);

    const response = await axios.get(`${API_BASE_URL}/${chatId}/messages`);

    console.log("✅ [GET MESSAGES] Nhận được dữ liệu:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ [GET MESSAGES] Lỗi khi lấy danh sách tin nhắn:",
      error.response?.data || error.message
    );
    throw error;
  }
};

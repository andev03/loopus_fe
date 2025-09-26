import axios from "axios";

const API_URL = "https://loopus.nguyenhoangan.site/api/chats";

export const chatService = {
  getChatsByGroup: async (groupId, currentUserId) => {
    try {
      const res = await axios.get(API_URL, { params: { groupId } });
      if (res.status === 200) {
        const raw = res.data?.data || [];
        console.log("📩 Dữ liệu API trả về:", JSON.stringify(raw, null, 2));

        const mapped = raw.map((m) => {
  const isCurrentUser = m.senderId === currentUserId;
  return {
    id: m.chatId,
    sender: isCurrentUser ? "Bạn" : m.senderName || "Ẩn danh",
    text: m.message,
    avatar: m.avatarUrl || "https://via.placeholder.com/150",
    time: new Date(m.createdAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    createdAt: new Date(m.createdAt),
    isCurrentUser, // 👈 thêm flag này
  };
});

        return { success: true, data: mapped };
      }
      return { success: false, data: [] };
    } catch (error) {
      console.error(
        "❌ Lỗi gọi API getChatsByGroup:",
        error.response?.data || error.message
      );
      return { success: false, error };
    }
  },

  sendMessage: async (groupId, userId, message) => {
    try {
      const res = await axios.post(`${API_URL}/chat-text`, {
        groupId,
        userId,
        message,
      });
      if (res.status === 200) {
        const m = res.data?.data;
        return {
          success: true,
          data: {
            id: m.chatId,
            sender: m.user?.fullName || "Bạn",
            text: m.message,
            avatar: m.user?.avatarUrl || "https://via.placeholder.com/150",
            time: new Date(m.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        };
      }
      return { success: false };
    } catch (error) {
      console.error(
        "❌ Lỗi gửi tin nhắn:",
        error.response?.data || error.message
      );
      return { success: false, error };
    }
  },
};

// services/notificationService.js
const API_BASE_URL = "https://loopus.nguyenhoangan.site/api/notifications";

export const notificationService = {
  // 1. Lấy danh sách thông báo của user
  getNotifications: async (userId) => {
    try {
      console.log("📥 Fetching notifications for user:", userId);
      const response = await fetch(`${API_BASE_URL}/${userId}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });
      const data = await response.json();
      console.log("✅ Get notifications response:", data);
      if (!response.ok) {
        throw new Error(data.message || "Lấy danh sách thông báo thất bại");
      }
      return data; // { status, message, data: [...] }
    } catch (error) {
      console.error("❌ Lỗi khi lấy thông báo:", error);
      throw error;
    }
  },

  // 2. Đánh dấu 1 thông báo là đã đọc
  markAsRead: async (notificationId) => {
    try {
      console.log("📬 Marking notification as read:", notificationId);
      // SỬA: dùng đúng route /notifications/{notificationId}/read
      const response = await fetch(`https://loopus.nguyenhoangan.site/api/${notificationId}/read`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
        },
      });
      const data = await response.json();
      console.log("✅ Mark as read response:", data);
      if (!response.ok) {
        throw new Error(data.message || "Đánh dấu đã đọc thất bại");
      }
      return data;
    } catch (error) {
      console.error("❌ Lỗi khi đánh dấu đã đọc:", error);
      throw error;
    }
  },

  // 3. Đánh dấu tất cả thông báo là đã đọc
  markAllAsRead: async (userId) => {
    try {
      console.log("📬 Marking all notifications as read for user:", userId);
      const response = await fetch(`${API_BASE_URL}/${userId}/read-all`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
        },
      });
      const data = await response.json();
      console.log("✅ Mark all as read response:", data);
      if (!response.ok) {
        throw new Error(data.message || "Đánh dấu tất cả thất bại");
      }
      return data;
    } catch (error) {
      console.error("❌ Lỗi khi đánh dấu tất cả đã đọc:", error);
      throw error;
    }
  },
};

import axios from "axios";

const API_URL = "https://loopus.nguyenhoangan.site/api";

export const settingService = {
  // 🟢 Lấy danh sách tất cả setting
  getAllSettings: async () => {
    try {
      console.log("📡 Gọi API: GET /api/settings");

      const res = await axios.get(`${API_URL}/settings`);

      if (res.status === 200) {
        console.log("✅ Dữ liệu tất cả setting:", res.data);
        return { success: true, data: res.data?.data || [] };
      }

      return { success: false, data: [] };
    } catch (error) {
      console.error("❌ Lỗi getAllSettings:", error.response?.data || error.message);
      return { success: false, error };
    }
  },

  // 🟢 Lấy setting theo userId
  getSettingsByUserId: async (userId) => {
    try {
      console.log("📡 Gọi API: GET /api/setting?userId=", userId);

      const res = await axios.get(`${API_URL}/setting`, {
        params: { userId },
      });

      if (res.status === 200) {
        console.log("✅ Dữ liệu setting của user:", res.data);
        return { success: true, data: res.data?.data || [] };
      }

      return { success: false, data: [] };
    } catch (error) {
      console.error("❌ Lỗi getSettingsByUserId:", error.response?.data || error.message);
      return { success: false, error };
    }
  },

  // 🟢 Cập nhật setting cho user
  // body dạng: [{ "settingId": "uuid", "enabled": true }]
  updateSettingsByUserId: async (settingsArray) => {
    try {
      console.log("📡 Gọi API: PUT /api/setting với payload:", settingsArray);

      const res = await axios.put(`${API_URL}/setting`, settingsArray, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (res.status === 200) {
        console.log("✅ Cập nhật setting thành công:", res.data);
        return { success: true, data: res.data?.data || [] };
      }

      return { success: false, data: [] };
    } catch (error) {
      console.error("❌ Lỗi updateSettingsByUserId:", error.response?.data || error.message);
      return { success: false, error };
    }
  },
};

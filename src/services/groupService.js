import axios from "axios";

const API_URL = "https://loopus.nguyenhoangan.site/api/groups";

export const groupService = {
  getGroups: async (userId) => {
    try {
      const res = await axios.get(API_URL, {
        params: { userId }
      });

      // Kiểm tra HTTP code
      if (res.status === 200) {
        console.log("✅ Gọi API getGroups thành công");
        console.log("Dữ liệu trả về:", res.data);   // kiểm tra nội dung
        return { success: true, data: res.data };
      } else {
        console.log("⚠️ Server trả về mã khác 200:", res.status);
        return { success: false, data: res.data };
      }
    } catch (error) {
      console.error("❌ Lỗi gọi API getGroups:",
        error.response?.data || error.message
      );
      return { success: false, error };
    }
  },

  createGroup: async (data) => {
  try {
    console.log("📦 Payload gửi lên:", data);

    const res = await axios.post(API_URL, data);

    console.log("✅ Tạo group thành công:", res.data);

    return {
      success: true,
      data: res.data?.data || res.data,
      status: res.status,
      message: res.data?.message || "Tạo group thành công",
    };
  } catch (error) {
    console.error("❌ Lỗi tạo group:", {
      status: error.response?.status,
      data: error.response?.data,
    });

    return {
      success: false,
      status: error.response?.status || 500,
      message: error.response?.data?.message || "Không thể tạo group",
      error: error.response?.data || error.message,
    };
  }
},

  addMembers: async (data) => {
    try {
      const res = await axios.put(`${API_URL}/add-members`, data);
      console.log("✅ Thêm member thành công:", res.data);
      return { success: true, data: res.data };
    } catch (error) {
      console.error("❌ Lỗi thêm member:", error.response?.data || error.message);
      return { success: false, error };
    }
  },
};

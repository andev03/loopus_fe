import axios from "axios";

const API_BASE_URL = "https://loopus.nguyenhoangan.site/api/albums";

export const albumService = {
  // Tạo album mới
  createAlbum: async (data) => {
    try {
      const res = await axios.post(`${API_BASE_URL}`, data);
      console.log("✅ Tạo album thành công:", res.data);
      return { success: true, data: res.data };
    } catch (error) {
      console.error("❌ Lỗi tạo album:", error.response?.data || error.message);
      return { success: false, error: error.response?.data };
    }
  },

  // Cập nhật album
  updateAlbum: async (albumId, data) => {
    try {
      const res = await axios.put(`${API_BASE_URL}/${albumId}`, data);
      console.log("✅ Cập nhật album thành công:", res.data);
      return { success: true, data: res.data };
    } catch (error) {
      console.error("❌ Lỗi cập nhật album:", error.response?.data || error.message);
      return { success: false, error: error.response?.data };
    }
  },

  // Xóa album
  deleteAlbum: async (albumId) => {
    try {
      const res = await axios.delete(`${API_BASE_URL}/${albumId}`);
      console.log("✅ Xóa album thành công:", res.data);
      return { success: true, data: res.data };
    } catch (error) {
      console.error("❌ Lỗi xóa album:", error.response?.data || error.message);
      return { success: false, error: error.response?.data };
    }
  },
};

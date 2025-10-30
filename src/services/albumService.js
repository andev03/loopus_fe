import axios from "axios";
import { getUser } from "../services/storageService";

const API_BASE_URL = "https://loopus.nguyenhoangan.site/api/albums";

export const albumService = {
  // 🟢 Tạo album mới
  createAlbum: async (data) => {
    try {
      const user = await getUser();
      const token = user?.token;

      const res = await axios.post(`${API_BASE_URL}`, data, {
        headers: {
          Accept: "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      console.log("✅ Tạo album thành công:", res.data);
      return { success: true, data: res.data };
    } catch (error) {
      console.error("❌ Lỗi tạo album:", error.response?.data || error.message);
      return { success: false, error: error.response?.data };
    }
  },

  // 🟡 Cập nhật album
  updateAlbum: async (albumId, data) => {
    try {
      const user = await getUser();
      const token = user?.token;

      const res = await axios.put(`${API_BASE_URL}/${albumId}`, data, {
        headers: {
          Accept: "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      console.log("✅ Cập nhật album thành công:", res.data);
      return { success: true, data: res.data };
    } catch (error) {
      console.error("❌ Lỗi cập nhật album:", error.response?.data || error.message);
      return { success: false, error: error.response?.data };
    }
  },

  // 🔴 Xóa album
  deleteAlbum: async (albumId) => {
    try {
      const user = await getUser();
      const token = user?.token;

      const res = await axios.delete(`${API_BASE_URL}/${albumId}`, {
        headers: {
          Accept: "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      console.log("✅ Xóa album thành công:", res.data);
      return { success: true, data: res.data };
    } catch (error) {
      console.error("❌ Lỗi xóa album:", error.response?.data || error.message);
      return { success: false, error: error.response?.data };
    }
  },

  // 🟢 Get albums by groupId
  getAlbumsByGroup: async (groupId) => {
    try {
      const user = await getUser();
      const token = user?.token;

      const res = await axios.get(`${API_BASE_URL}/${groupId}`, {
        headers: {
          Accept: "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      console.log("✅ Lấy album theo group thành công:", res.data);
      return { success: true, data: res.data };
    } catch (error) {
      console.error("❌ Lỗi lấy album:", error.response?.data || error.message);
      return { success: false, error: error.response?.data };
    }
  },
};

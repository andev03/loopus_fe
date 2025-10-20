import axios from "axios";
import { getUser, getUserId } from "../services/storageService";

const API_BASE_URL = "https://loopus.nguyenhoangan.site/api/stories";

export const storyService = {
  // 🟢 Tạo story
  createStory: async (file, caption = "", visibilityType = "followers", albumId = null) => {
    try {
      const userId = await getUserId();
      const user = await getUser();
      const token = user?.token;

      if (!userId) throw new Error("Thiếu userId, không thể tạo story.");

      const formData = new FormData();

      formData.append("file", {
        uri: file.uri.startsWith("file://") ? file.uri : `file://${file.uri}`,
        type: file.type || "image/jpeg",
        name: file.name || "story.jpg",
      });

      const requestBody = { userId, caption, visibilityType, albumId };
      formData.append("request", JSON.stringify(requestBody));

      console.log("📤 Gửi formData:", requestBody);

      const res = await axios.post(API_BASE_URL, formData, {
        headers: {
          Accept: "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        transformRequest: (data) => data, // giữ nguyên formData
      });

      console.log("✅ [createStory] Thành công:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ [createStory] Gặp lỗi:", err.message);
      if (err.response)
        console.log("📨 Server trả:", err.response.status, err.response.data);
      throw err;
    }
  },

  // 🔵 Lấy danh sách story feed của user
  getFeed: async (userId) => {
    try {
      const user = await getUser();
      const token = user?.token;

      const res = await axios.get(`${API_BASE_URL}/${userId}/feed`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      return res.data;
    } catch (err) {
      console.error("❌ getFeed error:", err);
      throw err.response?.data || err;
    }
  },

  // 🟣 Lấy danh sách story trong 1 album
  getStoriesByAlbum: async (albumId) => {
    try {
      const user = await getUser();
      const token = user?.token;

      const res = await axios.get(`${API_BASE_URL}/${albumId}`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      return res.data;
    } catch (err) {
      console.error("❌ getStoriesByAlbum error:", err);
      throw err.response?.data || err;
    }
  },

  // 🟢 Lấy story của 1 user cụ thể
  getStoriesByUser: async (userId) => {
    try {
      const user = await getUser();
      const token = user?.token;

      const res = await axios.get(`${API_BASE_URL}/user/${userId}`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      return res.data;
    } catch (err) {
      console.error("❌ getStoriesByUser error:", err);
      throw err.response?.data || err;
    }
  },

  // 🔴 Xóa 1 story
  deleteStory: async (storyId) => {
    try {
      const user = await getUser();
      const token = user?.token;

      const res = await axios.delete(`${API_BASE_URL}/${storyId}`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      return res.data;
    } catch (err) {
      console.error("❌ deleteStory error:", err);
      throw err.response?.data || err;
    }
  },
};

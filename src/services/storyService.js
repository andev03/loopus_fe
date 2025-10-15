import axios from "axios";
import { getToken, getUserId } from "../services/storageService";

const API_BASE_URL = "https://loopus.nguyenhoangan.site/api/stories";

export const storyService = {
  createStory: async (file, visibilityType = "followers", caption = "") => {
    try {
      const token = await getToken();
      const userId = await getUserId();

      const formData = new FormData();

      // ⚙️ Thêm file đúng format React Native
      formData.append("file", {
        uri: file.uri,
        type: file.type || "image/jpeg",
        name: file.name || "story.jpg",
      });

      // ⚙️ Thêm request (stringify JSON)
      formData.append(
        "request",
        JSON.stringify({
          userId,
          caption,
          visibilityType,
        })
      );

      // ❗ Không set Content-Type thủ công để axios tự thêm boundary
      const res = await axios.post(API_BASE_URL, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      return res.data;
    } catch (err) {
      console.error("❌ createStory error:", err.response?.data || err.message);
      throw err.response?.data || err;
    }
  },

  // 🔵 Lấy danh sách story feed của user
  getFeed: async (userId) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/${userId}/feed`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
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
      const res = await axios.get(`${API_BASE_URL}/${albumId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
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
    const res = await axios.get(`${API_BASE_URL}/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
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
    const res = await axios.delete(`${API_BASE_URL}/${storyId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.data;
  } catch (err) {
    console.error("❌ deleteStory error:", err);
    throw err.response?.data || err;
  }
},

};

import axios from "axios";

const API_BASE_URL = "https://loopus.nguyenhoangan.site/api/follows";

export const followService = {
  // 🟢 Follow 1 user
  followUser: async (userId, targetUserId) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/${userId}/${targetUserId}`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return res.data;
    } catch (err) {
      console.error("❌ followUser error:", err);
      throw err.response?.data || err;
    }
  },

  // 🔴 Unfollow 1 user
  unfollowUser: async (userId, targetUserId) => {
    try {
      const res = await axios.delete(`${API_BASE_URL}/${userId}/${targetUserId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return res.data;
    } catch (err) {
      console.error("❌ unfollowUser error:", err);
      throw err.response?.data || err;
    }
  },

  // 🟣 Kiểm tra đã follow chưa
  checkFollowStatus: async (userId, targetUserId) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/status/${userId}/${targetUserId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return res.data;
    } catch (err) {
      console.error("❌ checkFollowStatus error:", err);
      throw err.response?.data || err;
    }
  },

  // 🔵 Danh sách người userId đang follow
  getFollowing: async (userId) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/following/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return res.data;
    } catch (err) {
      console.error("❌ getFollowing error:", err);
      throw err.response?.data || err;
    }
  },

  // 🟠 Danh sách người đang follow userId
  getFollowers: async (userId) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/followers/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return res.data;
    } catch (err) {
      console.error("❌ getFollowers error:", err);
      throw err.response?.data || err;
    }
  },
};

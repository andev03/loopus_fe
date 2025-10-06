import axios from "axios";

const API_URL = "https://loopus.nguyenhoangan.site/api/poll";

export const pollService = {
  createPoll: async (groupId, userId, title, options) => {
    try {
      console.log("📤 Sending createPoll request:", {
        groupId,
        userId,
        title,
        options,
      });

      const res = await axios.post(`${API_URL}/create`, {
        groupId,
        userId,
        name: title,
        options,
      });

      console.log("✅ createPoll response:", res.data);

      const success = res.data?.status === 0 || res.data?.status === 200;

      return {
        success,
        data: res.data?.data || null,
        message: res.data?.message || (success ? "Tạo bình chọn thành công" : "Tạo bình chọn thất bại"),
      };
    } catch (error) {
      console.error("❌ Error creating poll:", error.response?.data || error.message);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || "Không thể tạo bình chọn",
      };
    }
  },
  addOption: async (pollId, optionText) => {
  try {
    console.log("📤 Sending addOption request:", { pollId, optionText });

    const res = await axios.post(`${API_URL}/add-option`, {
      pollId,
      optionText,
    });

    console.log("✅ addOption response:", res.data);

    const success = res.data?.status === 0 || res.data?.status === 200;

    return {
      success,
      data: res.data?.data || null,
      message:
        res.data?.message ||
        (success ? "Thêm lựa chọn thành công" : "Thêm lựa chọn thất bại"),
    };
  } catch (error) {
    console.error("❌ Error adding option:", error.response?.data || error.message);
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || "Không thể thêm lựa chọn",
    };
  }
},
getPolls: async (groupId) => {
    try {
      console.log("📤 Fetching polls for groupId:", groupId);

      const res = await axios.get(`https://loopus.nguyenhoangan.site/api/polls`, {
        params: { groupId }, // query param
      });

      console.log("✅ getPolls response:", res.data);

      const success = res.data?.status === 0 || res.data?.status === 200;

      return {
        success,
        data: res.data?.data || [],
        message:
          res.data?.message ||
          (success ? "Lấy danh sách bình chọn thành công" : "Lấy danh sách thất bại"),
      };
    } catch (error) {
      console.error("❌ Error fetching polls:", error.response?.data || error.message);
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || "Không thể lấy danh sách bình chọn",
      };
    }
  },
vote: async (pollId, optionId, userId) => {  
  try {
    console.log("📤 Sending vote request:", { pollId, optionId, userId });

    const res = await axios.post(`${API_URL}/vote`, {
      pollId,
      optionId,
      userId, // ✅ gửi userId lên server
    });

    console.log("✅ vote response:", res.data);

    const success = res.data?.status === 0 || res.data?.status === 200;

    return {
      success,
      data: res.data?.data || null,
      message: res.data?.message || (success ? "Vote thành công" : "Vote thất bại"),
    };
  } catch (error) {
    console.error("❌ Error voting:", error.response?.data || error.message);
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || "Không thể vote",
    };
  }
},

deletePoll: async (pollId) => {
    try {
      console.log("🗑️ Sending deletePoll request:", pollId);

      const res = await axios.delete(`${API_URL}/delete`, {
        params: { pollId }, // query param
      });

      console.log("✅ deletePoll response:", res.data);

      const success = res.data?.status === 0 || res.data?.status === 200;

      return {
        success,
        data: res.data?.data || null,
        message:
          res.data?.message ||
          (success ? "Xóa bình chọn thành công" : "Xóa bình chọn thất bại"),
      };
    } catch (error) {
      console.error(
        "❌ Error deleting poll:",
        error.response?.data || error.message
      );
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || "Không thể xóa bình chọn",
      };
    }
  },
};

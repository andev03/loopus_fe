import axios from "axios";

const API_URL = "https://loopus.nguyenhoangan.site/api/groups"; 
const API_SINGLE = process.env.EXPO_PUBLIC_API_GROUP;

export const groupService = {
  getGroups: async (userId) => {
    try {
      const res = await axios.get(API_URL, {
        params: { userId },
      });

      // Kiểm tra HTTP code
      if (res.status === 200) {
        console.log("✅ Gọi API getGroups thành công");
        console.log("Dữ liệu trả về:", res.data); // kiểm tra nội dung
        return { success: true, data: res.data };
      } else {
        console.log("⚠️ Server trả về mã khác 200:", res.status);
        return { success: false, data: res.data };
      }
    } catch (error) {
      console.error(
        "❌ Lỗi gọi API getGroups:",
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
      console.log(
        "📦 Payload gửi lên add-members:",
        JSON.stringify(data, null, 2)
      ); // Thêm log này
      const res = await axios.put(`${API_URL}/add-members`, data);
      console.log("✅ Thêm member thành công:", res.data);
      return { success: true, data: res.data };
    } catch (error) {
      console.error("❌ Lỗi thêm member:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      }); // Cải tiến log lỗi
      return { success: false, error };
    }
  },

  leaveGroup: async (groupId, userId) => {
  try {
    const res = await axios.delete(`${API_URL}/leave-group`, {
      data: { groupId, userId },      // 👈 DELETE phải để trong data
      headers: { "Content-Type": "application/json" }
    });
    return { success: true, data: res.data };
  } catch (error) {
    console.error("❌ Lỗi rời nhóm:", error.response?.data || error.message);
    return { success: false, error };
  }
},

viewMembers: async (groupId) => {
    try {
      const res = await axios.get(`${API_URL}/view-member`, {
        params: { groupId },
      });
      console.log("✅ Gọi API view-member thành công:", res.data);

      // Kiểm tra phản hồi
      if (res.data?.status === 0) {
        return { success: true, data: res.data };
      }
      return { success: false, data: res.data };
    } catch (error) {
      console.error(
        "❌ Lỗi gọi API view-member:",
        error.response?.data || error.message
      );
      return { success: false, error };
    }
  },

updateGroupInfo: async (data) => {
  try {
    console.log("📦 Payload update group:", data);
    const res = await axios.put(`${API_SINGLE}/update-information`, data, {
      headers: { "Content-Type": "application/json" }
    });

    if (res.status === 200) {
      console.log("✅ Update group thành công:", res.data);
      return { success: true, data: res.data };
    } else {
      console.log("⚠️ Update group trả về status:", res.status);
      return { success: false, data: res.data };
    }
  } catch (error) {
    console.error("❌ Lỗi update group:", error.response?.data || error.message);
    return { success: false, error };
  }
},

getGroupById: async (groupName, userId) => {
  try {
    const res = await axios.get(API_SINGLE, {
      params: { groupName, userId },
    });
    if (res.status === 200) {
      console.log("✅ getGroupById:", res.data);
      return { success: true, data: res.data };
    }
    return { success: false, data: res.data };
  } catch (error) {
    console.error("❌ getGroupById error:", error.response?.data || error.message);
    return { success: false, error };
  }
},

updateGroupAvatar: async (groupId, fileUri) => {
  try {
    const formData = new FormData();
    formData.append("file", {
      uri: fileUri,
      name: "avatar.jpg",
      type: "image/jpeg",
    });

    const res = await axios.put(
      `${API_SINGLE}/update-avatar?groupId=${groupId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (res.status === 200) {
      console.log("✅ Update avatar thành công:", res.data);
      return { success: true, data: res.data };
    } else {
      console.log("⚠️ Update avatar trả về:", res.status);
      return { success: false, data: res.data };
    }
  } catch (error) {
    console.error("❌ Lỗi update avatar:", error.response?.data || error.message);
    return { success: false, error };
  }
},

deleteGroup: async (groupId) => {
  try {
    const res = await axios.delete(`${API_SINGLE}?groupId=${groupId}`);
    if (res.status === 200) {
      console.log("✅ Giải tán nhóm thành công:", res.data);
      return { success: true, data: res.data };
    }
    return { success: false, data: res.data };
  } catch (error) {
    console.error("❌ Lỗi giải tán nhóm:", error.response?.data || error.message);
    return { success: false, error };
  }
},
};

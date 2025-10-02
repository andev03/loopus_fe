import axios from "axios";

const API_URL = "https://loopus.nguyenhoangan.site/api/group";

export const eventService = {
  createEvent: async (eventData) => {
    try {
      const res = await axios.post(`${API_URL}/event`, eventData);
      console.log("Create Event API response:", res.data);

      const success = res.data?.status === 0 || res.data?.status === 200;

      return {
        status: res.data?.status,
        data: res.data,
        success,
        message: res.data?.message || "Tạo sự kiện thành công",
      };
    } catch (error) {
      console.log("❌ Create Event error:", error.response?.data || error.message);

      let message = error.response?.data?.message || "Tạo sự kiện thất bại";

      return {
        status: error.response?.status || 500,
        message,
        success: false,
      };
    }
  },
  getGroupEvents: async (groupId) => {
    try {
      const res = await axios.get(`${API_URL}/events`, {
        params: { groupId }
      });
      console.log("📌 Get Events API response:", res.data);

      const success = res.data?.status === 0 || res.data?.status === 200;

      return {
        status: res.data?.status,
        data: res.data?.data || [],
        success,
        message: res.data?.message || "Lấy sự kiện thành công",
      };
    } catch (error) {
      console.log("❌ Get Events error:", error.response?.data || error.message);

      let message = error.response?.data?.message || "Lấy sự kiện thất bại";

      return {
        status: error.response?.status || 500,
        message,
        success: false,
        data: []
      };
    }
  },
  getEventDetail: async (eventId) => {
  try {
    const res = await axios.get(`${API_URL}/event/detail`, {
      params: { eventId }
    });
    console.log("📌 Get Event Detail API response:", res.data);

    const success = res.data?.status === 0 || res.data?.status === 200;

    return {
      status: res.data?.status,
      data: res.data?.data || null,
      success,
      message: res.data?.message || "Lấy chi tiết sự kiện thành công",
    };
  } catch (error) {
    console.log("❌ Get Event Detail error:", error.response?.data || error.message);

    let message = error.response?.data?.message || "Lấy chi tiết sự kiện thất bại";

    return {
      status: error.response?.status || 500,
      message,
      success: false,
      data: null
    };
  }
},

updateEvent: async (eventData) => {
  try {
    const res = await axios.put(`${API_URL}/event/update`, eventData);
    const success = res.data?.status === 0 || res.data?.status === 200;
    return {
      success,
      message: res.data?.message || "Cập nhật sự kiện thành công",
      event: res.data?.data || null,  // ✅ đổi thành event
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Cập nhật sự kiện thất bại",
      event: null,
    };
  }
},

processInvite: async ({ eventId, userId, status }) => {
  try {
    const res = await axios.put(`${API_URL}/event/process-invite`, {
      eventId,
      userId,
      status, // "ACCEPTED" | "DECLINED"
    });

    const success = res.data?.status === 0 || res.data?.status === 200;

    return {
      success,
      message: res.data?.message || "Cập nhật lời mời thành công",
      data: res.data?.data || null,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Cập nhật lời mời thất bại",
      data: null,
    };
  }
},
deleteEvent: async (eventId) => {
  try {
    const res = await axios.delete(`${API_URL}/event/delete`, {
      params: { eventId },
    });
    const success = res.data?.status === 0 || res.data?.status === 200;
    return {
      success,
      message: res.data?.message || "Xóa sự kiện thành công",
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Xóa sự kiện thất bại",
    };
  }
},
};

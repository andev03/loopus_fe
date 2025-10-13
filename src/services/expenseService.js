const API_URL = "https://loopus.nguyenhoangan.site/api/expense";
const API_LIST_URL = "https://loopus.nguyenhoangan.site/api/expenses";
const API_DEBT_INDIVIDUAL_URL = `${API_URL}/debt-reminder-individual`;
const API_DEBT_GROUP_URL = `${API_URL}/debt-reminder-group`;
const API_DEBT_ALL_URL = `${API_URL}/debt-reminder-all`;

export const expenseService = {
  getExpensesByGroup: async (groupId) => {
    try {
      console.log("📥 Fetching expenses for groupId:", groupId);

      const response = await fetch(`${API_LIST_URL}?groupId=${groupId}`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      });

      const data = await response.json();
      console.log("✅ Get expenses response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Lấy danh sách chia tiền thất bại");
      }

      return data;
    } catch (error) {
      console.error("❌ Lỗi khi lấy danh sách chia tiền:", error);
      throw error;
    }
  },

  getExpenseDetail: async (expenseId) => {
    try {
      console.log("📥 Fetching expense detail:", expenseId);

      const response = await fetch(`${API_URL}?expenseId=${expenseId}`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      });

      const data = await response.json();
      console.log("✅ Get expense detail response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Lấy chi tiết chia tiền thất bại");
      }

      return data;
    } catch (error) {
      console.error("❌ Lỗi khi lấy chi tiết chia tiền:", error);
      throw error;
    }
  },

  createExpense: async (expenseData) => {
    try {
      console.log("📦 Sending expense payload:", expenseData);

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expenseData),
      });

      const data = await response.json();
      console.log("✅ Expense API response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Tạo chia tiền thất bại");
      }

      return data;
    } catch (error) {
      console.error("❌ Lỗi khi tạo chia tiền:", error);
      throw error;
    }
  },
  
  updateExpense: async (expenseData) => {
    try {
      console.log("🟡 Sending update expense payload:", expenseData);

      const response = await fetch(API_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expenseData),
      });

      const data = await response.json();
      console.log("✅ Update expense response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Cập nhật chia tiền thất bại");
      }

      return data;
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật chia tiền:", error);
      throw error;
    }
  },

  deleteExpense: async (expenseId) => {
    try {
      console.log("🗑️ Đang gửi yêu cầu xóa expense:", expenseId);

      const response = await fetch(`${API_URL}?expenseId=${expenseId}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
        },
      });

      const data = await response.json();
      console.log("✅ Delete expense response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Xóa chia tiền thất bại");
      }

      return data;
    } catch (error) {
      console.error("❌ Lỗi khi xóa chia tiền:", error);
      throw error;
    }
  },

  getDebtReminder: async (userId, payerId) => {
  try {
    console.log("📥 Fetching debt reminder individual:", { userId, payerId });
    const response = await fetch(`${API_DEBT_INDIVIDUAL_URL}?userId=${userId}&payerId=${payerId}`, {
      method: "GET",
      headers: { "Accept": "application/json" },
    });
    const data = await response.json();
    console.log("✅ Get debt reminder individual response:", data);
    if (!response.ok) throw new Error(data.message || "Lấy nhắc nợ thất bại");
    return data;
  } catch (error) {
    console.error("❌ Lỗi khi lấy nhắc nợ:", error);
    throw error;
  }
},

createDebtReminder: async ({ userId, payerId }) => {
  try {
    const url = `https://loopus.nguyenhoangan.site/api/expense/debt-reminder-individual?userId=${userId}&payerId=${payerId}`;
    console.log("📡 Gửi yêu cầu nhắc nợ cá nhân:", url);

    const response = await fetch(url, {
      method: "POST",
      headers: { Accept: "application/json" },
    });

    const data = await response.json();
    console.log("✅ Phản hồi nhắc nợ cá nhân:", data);

    if (!response.ok || data.status !== 200) {
      throw new Error(data.message || "Tạo nhắc nợ thất bại");
    }

    return data;
  } catch (error) {
    console.error("❌ Lỗi khi tạo nhắc nợ:", error);
    throw error;
  }
},

getDebtReminderGroup: async (expenseId) => {
  try {
    console.log("📥 Fetching debt reminder group for expense:", expenseId);
    const response = await fetch(`${API_DEBT_GROUP_URL}?expenseId=${expenseId}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    const data = await response.json();
    console.log("✅ Get debt reminder group response:", data);
    if (!response.ok) throw new Error(data.message || "Lấy danh sách nhắc nợ nhóm thất bại");
    return data;
  } catch (error) {
    console.error("❌ Lỗi khi lấy nhắc nợ nhóm:", error);
    throw error;
  }
},

createDebtReminderGroup: async (expenseId, userId) => {
  try {
    console.log("📦 Creating debt reminder group:", { expenseId, userId });
    const response = await fetch(
      `${API_DEBT_GROUP_URL}?expenseId=${expenseId}&userId=${userId}`,
      {
        method: "POST",
        headers: { Accept: "application/json" },
      }
    );
    const data = await response.json();
    console.log("✅ Create debt reminder group response:", data);
    if (!response.ok) throw new Error(data.message || "Tạo nhắc nợ nhóm thất bại");
    return data;
  } catch (error) {
    console.error("❌ Lỗi khi tạo nhắc nợ nhóm:", error);
    throw error;
  }
},

getAllDebtReminders: async (userId) => {
    try {
      console.log("📥 Fetching all debt reminders for user:", userId);

      const response = await fetch(`${API_DEBT_ALL_URL}?userId=${userId}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      const data = await response.json();
      console.log("✅ Get all debt reminders response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Lấy danh sách nhắc nợ thất bại");
      }

      return data;
    } catch (error) {
      console.error("❌ Lỗi khi lấy danh sách nhắc nợ:", error);
      throw error;
    }
  },

  createAllDebtReminders: async (userId) => {
    try {
      console.log("📦 Creating all debt reminders for user:", userId);

      const response = await fetch(`${API_DEBT_ALL_URL}?userId=${userId}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
      });

      const data = await response.json();
      console.log("✅ Create all debt reminders response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Tạo nhắc nợ tất cả thất bại");
      }

      return data;
    } catch (error) {
      console.error("❌ Lỗi khi tạo nhắc nợ tất cả:", error);
      throw error;
    }
  },  
};

const API_URL = "https://loopus.nguyenhoangan.site/api/expense";
const API_LIST_URL = "https://loopus.nguyenhoangan.site/api/expenses";

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

  getDebtReminder: async (userId, payerId) => {
    try {
      console.log("📥 Fetching debt reminder:", { userId, payerId });
      const response = await fetch(`${API_DEBT_URL}?userId=${userId}&payerId=${payerId}`, {
        method: "GET",
        headers: { "Accept": "application/json" },
      });
      const data = await response.json();
      console.log("✅ Get debt reminder response:", data);
      if (!response.ok) throw new Error(data.message || "Lấy nhắc nợ thất bại");
      return data;
    } catch (error) {
      console.error("❌ Lỗi khi lấy nhắc nợ:", error);
      throw error;
    }
  },

  createDebtReminder: async (reminderData) => {
    try {
      console.log("📦 Sending debt reminder payload:", reminderData);
      const response = await fetch(API_DEBT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reminderData),
      });
      const data = await response.json();
      console.log("✅ Create debt reminder response:", data);
      if (!response.ok) throw new Error(data.message || "Tạo nhắc nợ thất bại");
      return data;
    } catch (error) {
      console.error("❌ Lỗi khi tạo nhắc nợ:", error);
      throw error;
    }
  },
};

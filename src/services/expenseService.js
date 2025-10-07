const API_URL = "https://loopus.nguyenhoangan.site/api/expense";

export const expenseService = {
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
};

import axios from "axios";
const API_URL = "https://loopus.nguyenhoangan.site";

export const createPayout = async (userId, payload) => {
  console.log("📤 Gửi payout:", { userId, payload });
  try {
    const res = await axios.post(`${API_URL}/payouts/create?userId=${userId}`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("📥 Response payout:", res.data);
    return res.data;
  } catch (error) {
    console.error("❌ Lỗi API createPayout:", error.response?.data || error.message);
    return { error: -1, message: "fail" };
  }
};

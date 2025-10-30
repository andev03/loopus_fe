import axios from "axios";

// URL backend của bạn
const BASE_URL = "https://loopus.nguyenhoangan.site";

// Tạo instance axios (có thể thêm header sau này)
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Gọi API tạo link thanh toán
 * @param {string} userId - ID của user đang đăng nhập
 * @param {number} price - Số tiền cần thanh toán (VD: 50000)
 * @returns {Promise<string>} checkoutUrl - Link thanh toán trả về từ PayOS
 */
export const createPaymentLink = async (userId, price = 50000) => {
  try {
    const body = {
      userId,
      price,
    };

    console.log("📦 Gửi dữ liệu tạo order:", body);

    const response = await api.post("/order/create", body);

    console.log("✅ API /order/create trả về:", response.data);

    const { error, message, data } = response.data;

    if (error === 0 && data?.checkoutUrl) {
      return data.checkoutUrl; // Trả về link thanh toán
    } else {
      throw new Error(message || "Không tạo được link thanh toán");
    }
  } catch (error) {
    console.error("❌ Lỗi khi gọi createPaymentLink:", error);
    throw error;
  }
};

import axios from "axios";
import { getUserId } from "./storageService";

const API_URL = "https://loopus.nguyenhoangan.site/api/wallets";

/**
 * 🪙 Lấy ví theo userId
 */
export const getWalletByUserId = async () => {
  try {
    const userId = await getUserId();
    if (!userId) throw new Error("Không tìm thấy userId, vui lòng đăng nhập lại.");

    console.log("🚀 Gọi API getWalletByUserId:", `${API_URL}/${userId}`);

    const res = await axios.get(`${API_URL}/${userId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("💰 Kết quả API getWalletByUserId:", res.data);

    return {
      success: true,
      status: res.data?.status,
      message: res.data?.message,
      data: res.data?.data,
    };
  } catch (error) {
    console.error("❌ getWalletByUserId error:", error.response?.data || error.message);

    return {
      success: false,
      message: error.response?.data?.message || "Không thể lấy dữ liệu ví",
    };
  }

  
};

/**
 * 💸 Chuyển tiền giữa 2 người dùng
 * @param {string} receiverId - id người nhận
 * @param {number} amount - số tiền
 * @param {string} groupId - id nhóm (nếu có)
 * @param {string} expenseId - id chi phí (nếu có)
 * @param {string} typeTransfer - loại chuyển: INDIVIDUAL_TRANSFER hoặc GROUP_EXPENSE
 */
export const transferMoney = async (receiverId, amount, groupId = "", expenseId = "", typeTransfer = "INDIVIDUAL_TRANSFER") => {
  try {
    const senderId = await getUserId();
    if (!senderId) throw new Error("Không tìm thấy userId, vui lòng đăng nhập lại.");

    const url = `${API_URL}/transfer`;
    const body = {
      senderId,
      receiverId,
      amount,
      expenseId: expenseId || "", // ✅ Đảm bảo expenseId là string rỗng nếu null
      groupId: groupId || "",
      typeTransfer,
    };

    console.log("🚀 Gọi API transferMoney:", url, body);

    const res = await axios.post(url, body, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("💸 Kết quả API transferMoney:", res.data);

    return {
      success: true,
      status: res.data?.status,
      message: res.data?.message,
      data: res.data?.data,
    };
  } catch (error) {
    console.error("❌ transferMoney error:", error.response?.data || error.message);

    return {
      success: false,
      message: error.response?.data?.message || "Không thể chuyển tiền",
    };
  }
};


/**
 * 📜 Lấy danh sách giao dịch của 1 ví
 * @param {string} walletId - ID của ví cần xem
 */
export const getTransactionsByWalletId = async (walletId) => {
  try {
    if (!walletId) throw new Error("Thiếu walletId.");

    const url = `${API_URL}/${walletId}/transactions`;
    console.log("🚀 Gọi API getTransactionsByWalletId:", url);

    const res = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("📜 Kết quả API getTransactionsByWalletId:", res.data);

    return {
      success: true,
      status: res.data?.status,
      message: res.data?.message,
      data: res.data?.data,
    };
  } catch (error) {
    console.error("❌ getTransactionsByWalletId error:", error.response?.data || error.message);

    return {
      success: false,
      message: error.response?.data?.message || "Không thể lấy danh sách giao dịch",
    };
  }
};

/**
 * 🧾 Lấy chi tiết 1 giao dịch theo walletTransactionId
 * @param {string} walletTransactionId - ID của giao dịch
 */
export const getTransactionDetailById = async (walletTransactionId) => {
  try {
    if (!walletTransactionId) throw new Error("Thiếu walletTransactionId.");

    const url = `${API_URL}/transaction/${walletTransactionId}`;
    console.log("🚀 Gọi API getTransactionDetailById:", url);

    const res = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("🧾 Kết quả API getTransactionDetailById:", res.data);

    return {
      success: true,
      status: res.data?.status,
      message: res.data?.message,
      data: res.data?.data,
    };
  } catch (error) {
    console.error("❌ getTransactionDetailById error:", error.response?.data || error.message);

    return {
      success: false,
      message: error.response?.data?.message || "Không thể lấy chi tiết giao dịch",
    };
  }
};
/**
 * 💳 Nạp tiền vào ví người dùng
 * @param {number} amount - Số tiền cần nạp
 */
/**
 * 💳 Nạp tiền vào ví người dùng
 * @param {number} amount - Số tiền cần nạp
 */
export const depositMoney = async (amount) => {
  try {
    const userId = await getUserId();
    const numericAmount = parseFloat(amount);

    if (!userId) throw new Error("Không tìm thấy userId, vui lòng đăng nhập lại.");
    if (isNaN(numericAmount) || numericAmount < 0.01)
      throw new Error("Số tiền phải lớn hơn hoặc bằng 0.01");

    const url = `${API_URL}/deposit`;
    console.log("🚀 Gọi API depositMoney:", url, { userId, price: numericAmount });

    const res = await axios.post(
      url,
      { userId, price: numericAmount }, // ✅ đổi 'amount' → 'price'
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("💰 Kết quả API depositMoney:", res.data);
    return {
      success: true,
      status: res.data?.status,
      message: res.data?.message,
      data: res.data?.data,
    };
  } catch (error) {
    console.error("❌ depositMoney error:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || "Không thể nạp tiền vào ví",
    };
  }
};


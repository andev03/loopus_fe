import axios from "axios";

const API_URL = "https://loopus.nguyenhoangan.site/api/banks";

/**
 * 🏦 Lấy danh sách tất cả ngân hàng
 */
export const getAllBanks = async () => {
  try {
    const res = await axios.get(API_URL);
    return {
      success: res.status === 200,
      message: res.data.message,
      data: res.data.data,
    };
  } catch (error) {
    console.error("❌ [getAllBanks] Error:", error);
    return { success: false, message: error.message, data: [] };
  }
};

/**
 * 🔍 Lấy thông tin ngân hàng theo ID
 * @param {string} bankId
 */
export const getBankById = async (bankId) => {
  try {
    const res = await axios.get(`${API_URL}/${bankId}`);
    return {
      success: res.status === 200,
      message: res.data.message,
      data: res.data.data,
    };
  } catch (error) {
    console.error("❌ [getBankById] Error:", error);
    return { success: false, message: error.message, data: null };
  }
};

/**
 * ➕ Tạo ngân hàng mới
 * @param {object} bankData { bankId, bankName, binCode, createdAt }
 */
export const createBank = async (bankData) => {
  try {
    const res = await axios.post(API_URL, bankData);
    return {
      success: res.status === 200,
      message: res.data.message,
      data: res.data.data,
    };
  } catch (error) {
    console.error("❌ [createBank] Error:", error);
    return { success: false, message: error.message, data: null };
  }
};

/**
 * ✏️ Cập nhật thông tin ngân hàng
 * @param {string} bankId
 * @param {object} bankData
 */
export const updateBank = async (bankId, bankData) => {
  try {
    const res = await axios.put(`${API_URL}/${bankId}`, bankData);
    return {
      success: res.status === 200,
      message: res.data.message,
      data: res.data.data,
    };
  } catch (error) {
    console.error("❌ [updateBank] Error:", error);
    return { success: false, message: error.message, data: null };
  }
};

/**
 * 🗑️ Xóa ngân hàng theo ID
 * @param {string} bankId
 */
export const deleteBank = async (bankId) => {
  try {
    const res = await axios.delete(`${API_URL}/${bankId}`);
    return {
      success: res.status === 200,
      message: res.data.message,
      data: res.data.data,
    };
  } catch (error) {
    console.error("❌ [deleteBank] Error:", error);
    return { success: false, message: error.message, data: null };
  }
};

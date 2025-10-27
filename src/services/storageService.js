import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_KEY = "userInfo";
const TOKEN_KEY = "userToken"; 

export const saveToken = async (token) => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error("Error saving token:", error);
  }
};

export const getToken = async () => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
};

export const clearToken = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error("Error clearing token:", error);
  }
};

// ✅ Lưu user info (giữ nguyên)
export const saveUser = async (user) => {
  try {
    const oldUser = await getUser();
    const oldUserId = oldUser ? oldUser.userId : null;
    
    // 🟢 Chỉ clear chatId của acc cũ nếu switch acc khác
    if (oldUserId && oldUserId !== user.userId) {
      await clearChatId(oldUserId);
      console.log("🗑️ [STORAGE] Switch acc khác, clear chatId cũ của", oldUserId);
    }
    
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    console.log("💾 [STORAGE] Đã lưu user:", user.userId, "Role:", user.role);
  } catch (error) {
    console.error("Error saving user:", error);
  }
};

// Các hàm user giữ nguyên...
export const getUser = async () => {
  try {
    const user = await AsyncStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
};

export const clearUser = async () => {
  try {
    await AsyncStorage.removeItem(USER_KEY);
    console.log("🗑️ [STORAGE] Đã xóa user info");
  } catch (error) {
    console.error("Error clearing user:", error);
  }
};

export const getUserId = async () => {
  try {
    const user = await getUser();
    const userId = user ? user.userId : null;
    console.log("👤 [STORAGE] Lấy userId:", userId); 
    return userId;
  } catch (error) {
    console.error("Error getting userId:", error);
    return null;
  }
};

export const getUserRole = async () => {
  try {
    const user = await getUser();
    const role = user ? user.role : null;
    console.log("👑 [STORAGE] Lấy userRole:", role);
    return role;
  } catch (error) {
    console.error("Error getting userRole:", error);
    return null;
  }
};

// 🟢 Lưu chatId RIÊNG theo userId
export const saveChatId = async (userId, chatId) => {
  try {
    const key = `chatId_${userId}`;
    await AsyncStorage.setItem(key, chatId);
    console.log("💾 [STORAGE] Đã lưu chatId cho user", userId, ":", chatId);
  } catch (error) {
    console.error("Error saving chatId:", error);
  }
};

// 🟢 Lấy chatId RIÊNG theo userId
export const getChatId = async (userId) => {
  try {
    const key = `chatId_${userId}`;
    const chatId = await AsyncStorage.getItem(key);
    console.log("💾 [STORAGE] Lấy chatId cho user", userId, ":", chatId);
    return chatId;
  } catch (error) {
    console.error("Error getting chatId:", error);
    return null;
  }
};

// 🟢 Clear chatId RIÊNG theo userId
export const clearChatId = async (userId) => {
  try {
    const key = `chatId_${userId}`;
    await AsyncStorage.removeItem(key);
    console.log("🗑️ [STORAGE] Đã xóa chatId cho user", userId);
  } catch (error) {
    console.error("Error clearing chatId:", error);
  }
};

export const clearChatStorage = clearChatId; // Alias

// 🟢 Clear tất cả (FIX: Không xóa chatId để giữ lịch sử khi login lại cùng acc)
export const clearAll = async () => {
  try {
    await clearUser(); // Chỉ xóa user info
    await clearToken(); // Xóa token nếu có
    // 🟢 KHÔNG xóa chatId → Giữ lịch sử chat riêng theo userId
    console.log("🗑️ [STORAGE] Đã clear user + token (giữ chatId để login lại thấy cũ)");
  } catch (error) {
    console.error("Error clearing all:", error);
  }
};
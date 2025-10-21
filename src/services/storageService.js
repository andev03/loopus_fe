import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_KEY = "userInfo";
const CHAT_KEY = "chatId"; 


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


// ✅ Lưu user info
export const saveUser = async (user) => {
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    console.log("💾 [STORAGE] Đã lưu user:", user.userId); // Log để debug
  } catch (error) {
    console.error("Error saving user:", error);
  }
};

// ✅ Lấy user info
export const getUser = async () => {
  try {
    const user = await AsyncStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
};

// ✅ Xóa user info
export const clearUser = async () => {
  try {
    await AsyncStorage.removeItem(USER_KEY);
    console.log("🗑️ [STORAGE] Đã xóa user");
  } catch (error) {
    console.error("Error clearing user:", error);
  }
};

// ✅ Lấy userId từ user info
export const getUserId = async () => {
  try {
    const user = await getUser();
    const userId = user ? user.userId : null;
    console.log("👤 [STORAGE] Lấy userId:", userId); // Log để debug
    return userId;
  } catch (error) {
    console.error("Error getting userId:", error);
    return null;
  }
};

// 🟢 Lưu chatId (gọi sau khi gửi tin nhắn đầu tiên thành công)
export const saveChatId = async (chatId) => {
  try {
    await AsyncStorage.setItem(CHAT_KEY, chatId);
    console.log("💾 [STORAGE] Đã lưu chatId:", chatId);
  } catch (error) {
    console.error("Error saving chatId:", error);
  }
};

// 🟢 Lấy chatId (gọi khi vào màn chat để load lịch sử)
export const getChatId = async () => {
  try {
    const chatId = await AsyncStorage.getItem(CHAT_KEY);
    console.log("💾 [STORAGE] Lấy chatId:", chatId);
    return chatId;
  } catch (error) {
    console.error("Error getting chatId:", error);
    return null;
  }
};

// 🟢 Xóa chatId (gọi khi logout hoặc reset chat)
export const clearChatId = async () => {
  try {
    await AsyncStorage.removeItem(CHAT_KEY);
    console.log("🗑️ [STORAGE] Đã xóa chatId");
  } catch (error) {
    console.error("Error clearing chatId:", error);
  }
};

// 🟢 Bonus: Clear tất cả (user + chat) khi logout
export const clearAll = async () => {
  try {
    await clearUser();
    await clearChatId();
    console.log("🗑️ [STORAGE] Đã clear tất cả");
  } catch (error) {
    console.error("Error clearing all:", error);
  }
};
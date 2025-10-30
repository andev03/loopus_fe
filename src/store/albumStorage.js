import AsyncStorage from "@react-native-async-storage/async-storage";

const PREFIX = "album_"; // để phân biệt giữa các group

export const saveAlbumForGroup = async (groupId, albumId, albumName) => {
  try {
    await AsyncStorage.setItem(
      `${PREFIX}${groupId}`,
      JSON.stringify({ albumId, albumName })
    );
  } catch (e) {
    console.error("Lỗi lưu album:", e);
  }
};

export const getAlbumForGroup = async (groupId) => {
  try {
    const data = await AsyncStorage.getItem(`${PREFIX}${groupId}`);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error("Lỗi đọc album:", e);
    return null;
  }
};

export const clearAlbumForGroup = async (groupId) => {
  try {
    await AsyncStorage.removeItem(`${PREFIX}${groupId}`);
  } catch (e) {
    console.error("Lỗi xóa album:", e);
  }
};

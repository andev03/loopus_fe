import axios from "axios";

const API_URL = "https://loopus.nguyenhoangan.site/api/users";

export const register = async (userData) => {
  try {
    const res = await axios.post(`${API_URL}/register`, userData);
    console.log("Register API response:", res.data);

    // ✅ Check backend status
    const success = res.data?.status === 200;

    return {
      status: res.data?.status,
      data: res.data,
      success,
      message: res.data?.message
    };
  } catch (error) {
    console.log("Register error:", error.response?.data || error.message);

    let message = error.response?.data?.message || "Đăng ký thất bại";

    return {
      status: error.response?.status || 500,
      message,
      success: false
    };
  }
};

export const login = async (username, password) => {
  try {
    const res = await axios.post(`${API_URL}/login`, { username, password });
    console.log("API response:", res.data);

    return {
      status: res.data?.status,
      message: res.data?.message,
      user: res.data?.data,   // 👈 user object có userId
      token: res.data?.token, // 👈 nếu backend có trả token
    };
  } catch (error) {
    console.log("Login error:", error.response?.data || error.message);

    let message = error.response?.data?.message || "Đăng nhập thất bại";
    return {
      status: error.response?.status || 500,
      message,
    };
  }
};

export const findUserByEmail = async (email) => {
  try {
    const res = await axios.get(`${API_URL}/find-by-email`, {
      params: { email },
    });
    console.log("findUserByEmail API response:", res.data);

    // 🔑 Check thêm cả res.data.data (phải khác null)
    if (res.data?.status === 200 && res.data?.data) {
      const user = res.data.data;
      return {
        success: true,
        userId: user.userId,
        name: user.fullName || user.username || email,
        email: user.username,
        avatar:
          user.avatarUrl ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            user.fullName || email
          )}`,
        message: "Tìm thấy user",
      };
    } else {
      return {
        success: false,
        userId: null,
        message: "Không tìm thấy user", // 🚀 override message cho dễ hiểu
      };
    }
  } catch (error) {
    console.log(
      "findUserByEmail error:",
      error.response?.data || error.message
    );
    return {
      success: false,
      userId: null,
      message: error.response?.data?.message || "Lỗi khi tìm user",
    };
  }
};
export const updateUserInformation = async (userData, token) => {
  try {
    const res = await axios.put(
      `${API_URL}/update-information`,
      userData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Update profile response:", res.data);

    return {
      success: res.data?.status === 200,
      message: res.data?.message || "Cập nhật thành công",
      data: res.data?.data,
    };
  } catch (error) {
    console.log("Update profile error:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || "Cập nhật thất bại",
    };
  }
};

export const updateUserAvatar = async (userId, file, token) => {
  try {
    const formData = new FormData();
    formData.append("file", {
      uri: file.uri, // 👈 URI của ảnh (React Native: từ ImagePicker hoặc Camera)
      type: file.type || "image/jpeg", // 👈 MIME type, ví dụ: image/png
      name: file.name || `avatar_${Date.now()}.jpg`,
    });

    const res = await axios.put(
      `${API_URL}/update-avatar`,
      formData,
      {
        params: { userId }, // 🔑 query param
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Update avatar response:", res.data);

    return {
      success: res.data?.status === 200,
      message: res.data?.message || "Cập nhật avatar thành công",
      data: res.data?.data, // thường chứa URL mới của avatar
    };
  } catch (error) {
    console.log("Update avatar error:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || "Cập nhật avatar thất bại",
    };
  }
};






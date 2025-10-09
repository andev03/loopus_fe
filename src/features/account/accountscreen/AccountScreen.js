import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import styles from "../accountScreen/AccountScreen.styles";
import {
  clearUser,
  clearToken,
  getUser,
} from "../../../services/storageService";

// ✅ Import ảnh avatar mặc định trong assets
import DefaultAvatar from "../../../assets/images/default-avatar.jpg";

export default function AccountScreen() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const u = await getUser();
      setUser(u);
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    Alert.alert("Xác nhận", "Bạn có chắc chắn muốn đăng xuất?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: async () => {
          await clearUser(); // xoá user info
          await clearToken(); // xoá token
          router.replace("/login"); // điều hướng về trang login
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Avatar */}
        <View style={styles.header}>
          <Image
            source={user?.avatarUrl ? { uri: user.avatarUrl } : DefaultAvatar}
            style={styles.avatar}
          />

          {/* 2 nút QR + sửa thông tin */}
          <View style={styles.actionRow}>
            <TouchableOpacity
  style={styles.actionButton}
  onPress={() => router.push("/account/my-wallet")}
>
  <Text style={styles.actionText}>Ví của tôi</Text>
</TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionText}>Sửa thông tin</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu */}
        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Loopus Premium</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/notification/help-center")} 
          >
            <Text style={styles.menuText}>Trung tâm trợ giúp</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/account/app-info")} 
          >
            <Text style={styles.menuText}>Thông tin chung</Text>
          </TouchableOpacity>

          {/* 👉 Điều hướng sang trang notification-setting */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/notification/notification-setting")}
          >
            <Text style={styles.menuText}>Cài đặt thông báo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/account/feedback")}
          >
            <Text style={styles.menuText}>Chia sẻ góp ý</Text>
          </TouchableOpacity>
        </View>

        {/* Nút Đăng xuất */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

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
import DefaultAvatar from "../../../assets/images/default-avatar.jpg";
import { useFocusEffect } from "@react-navigation/native";

export default function AccountScreen() {
  const [user, setUser] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      const loadUser = async () => {
        const u = await getUser();
        setUser(u);
      };
      loadUser();
    }, [])
  );

  const handleLogout = async () => {
    Alert.alert("Xác nhận", "Bạn có chắc chắn muốn đăng xuất?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: async () => {
          await clearUser();
          await clearToken();
          router.replace("/login");
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          {/* Avatar với viền vàng nếu là MEMBER */}
          <View style={user?.role === "MEMBER" ? styles.avatarPremium : {}}>
            <Image
              source={user?.avatarUrl ? { uri: user.avatarUrl } : DefaultAvatar}
              style={styles.avatar}
            />
          </View>

          {/* Tên + Badge Premium */}
          <View style={{ alignItems: "center", marginTop: 12 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ fontSize: 18, fontWeight: "600", color: "#111" }}>
                Xin chào, {user?.fullName || "Người dùng"}
              </Text>
              {user?.role === "MEMBER" && (
                <View style={styles.premiumBadge}>
                  <Text style={styles.premiumBadgeText}>PREMIUM</Text>
                </View>
              )}
            </View>

            {user?.bio ? (
              <Text
                style={{
                  fontSize: 15,
                  color: "#1f2937",
                  marginTop: 6,
                  fontWeight: "600",
                  textAlign: "center",
                  lineHeight: 20,
                }}
              >
                {user.bio}
              </Text>
            ) : (
              <Text
                style={{
                  fontSize: 14,
                  color: "#111213ff",
                  marginTop: 6,
                  fontWeight: "500",
                  textAlign: "center",
                }}
              >
                Hãy thêm giới thiệu về bạn
              </Text>
            )}
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push("/account/my-wallet")}
            >
              <Text style={styles.actionText}>Ví của tôi</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push("edit-profile")}
            >
              <Text style={styles.actionText}>Sửa thông tin</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Premium Banner */}
        {user?.role === "MEMBER" ? (
          <View style={styles.premiumActiveBanner}>
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 4,
                }}
              >
                <Text style={{ fontSize: 20, marginRight: 6 }}>
                  Thành viên Premium
                </Text>
              </View>
              <Text style={{ fontSize: 13, color: "#d1fae5", marginTop: 2 }}>
                Bạn đang tận hưởng toàn bộ tính năng
              </Text>
            </View>
            <View
              style={{
                backgroundColor: "#fff",
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 20,
              }}
            ></View>
          </View>
        ) : (
          <TouchableOpacity
            style={{
              backgroundColor: "#10b981",
              marginHorizontal: 16,
              marginTop: 20,
              marginBottom: 16,
              borderRadius: 16,
              padding: 16,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              shadowColor: "#059669",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
              borderWidth: 2,
              borderColor: "#34d399",
            }}
            onPress={() => router.push("/account/premium")}
          >
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 4,
                }}
              >
                <Text style={{ fontSize: 20, marginRight: 6 }}>
                  Nâng cấp Premium
                </Text>
              </View>
              <Text style={{ fontSize: 13, color: "#d1fae5", marginTop: 2 }}>
                Mở khóa tất cả tính năng
              </Text>
            </View>
            <View
              style={{
                backgroundColor: "#fff",
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 20,
              }}
            >
              <Text
                style={{ color: "#10b981", fontWeight: "bold", fontSize: 13 }}
              >
                Nâng cấp
              </Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Menu */}
        <View style={styles.menu}>
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

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function AppInfoScreen() {
  const [expandedId, setExpandedId] = useState(null);

  const menuItems = [
    {
      id: "1",
      title: "Điều khoản sử dụng",
      detail:
        "Đây là các quy định bạn cần tuân thủ khi sử dụng ứng dụng LOOPUS. Việc vi phạm có thể dẫn đến việc khóa tài khoản.",
    },
    {
      id: "2",
      title: "Chính sách quyền riêng tư",
      detail:
        "Chúng tôi cam kết bảo mật dữ liệu cá nhân của bạn và không chia sẻ cho bên thứ ba nếu không có sự đồng ý.",
    },
    {
      id: "3",
      title: "Quy chế hoạt động",
      detail:
        "Ứng dụng LOOPUS vận hành theo các quy định của pháp luật Việt Nam và tuân thủ các điều khoản được công bố.",
    },
  ];

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/(tabs)/account")}>
          <Ionicons name="arrow-back-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông tin chung</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Logo */}
        <View style={styles.logoBox}>
          <Text style={styles.logo}>LOOPUS</Text>
        </View>

        {/* Menu items */}
        {menuItems.map((item) => (
          <View key={item.id}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => toggleExpand(item.id)}
            >
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Ionicons
                name={expandedId === item.id ? "chevron-up" : "chevron-forward"}
                size={20}
                color="#999"
              />
            </TouchableOpacity>

            {expandedId === item.id && (
              <View style={styles.detailBox}>
                <Text style={styles.detailText}>{item.detail}</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2ECC71",
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  content: {
    flex: 1,
  },
  logoBox: {
    alignItems: "center",
    paddingVertical: 30,
    backgroundColor: "#fff",
    borderBottomWidth: 8,
    borderColor: "#f2f2f2",
  },
  logo: {
    fontSize: 28,
    fontWeight: "800",
    color: "#2ECC71",
  },
  version: {
    marginTop: 4,
    color: "#666",
    fontSize: 14,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  detailBox: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#f9f9f9",
  },
  detailText: {
    fontSize: 14,
    color: "#444",
  },
});

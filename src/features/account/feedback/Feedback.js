import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function FeedbackScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chia sẻ góp ý</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Greeting */}
        <View style={styles.greetingBox}>
          <MaterialCommunityIcons name="email-outline" size={70} color="#2ECC71" />
          <Text style={styles.hello}>Xin chào, Công Phát</Text>
          <Text style={styles.subHello}>
            Chúng tôi luôn luôn sẵn sàng lắng nghe góp ý phản hồi của bạn!
          </Text>
        </View>

        {/* Góp ý cải thiện */}
        <TouchableOpacity style={styles.menuItem}>
          <View style={{ flex: 1 }}>
            <Text style={styles.menuTitle}>Góp ý cải thiện</Text>
            <Text style={styles.menuDesc}>
              Đề xuất thay đổi, cải thiện tính năng hoặc dịch vụ
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        {/* Báo lỗi ứng dụng */}
        <TouchableOpacity style={styles.menuItem}>
          <View style={{ flex: 1 }}>
            <Text style={styles.menuTitle}>Báo lỗi ứng dụng</Text>
            <Text style={styles.menuDesc}>
              Báo lỗi kỹ thuật, màn hình trắng, tính năng không hoạt động, lỗi font chữ,...
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
      </ScrollView>

      {/* Nút Chat */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.chatButton}>
          <Text style={styles.chatText}>Chat với Loopus</Text>
        </TouchableOpacity>
      </View>
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
    backgroundColor: "#fff",
  },
  greetingBox: {
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 8,
    borderColor: "#f2f2f2",
  },
  hello: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 8,
  },
  subHello: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
    textAlign: "center",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  menuDesc: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  footer: {
    padding: 16,
    backgroundColor: "#F2F2F2",
  },
  chatButton: {
    backgroundColor: "#2ECC71",
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: "center",
  },
  chatText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

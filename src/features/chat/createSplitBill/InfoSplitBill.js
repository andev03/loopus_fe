import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function InfoSplitBillScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerBtn}
        >
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Avatar nhóm */}
      <View style={styles.avatarBox}>
        <Image
          source={{ uri: "https://i.pravatar.cc/150?img=5" }}
          style={styles.avatar}
        />
        <Text style={styles.groupName}>Group 2</Text>
      </View>

      {/* Tổng số tiền */}
      <Text style={styles.totalText}>
        Tổng cộng bạn sẽ nhận được{" "}
        <Text style={{ fontWeight: "bold", color: "#2ECC71" }}>60.000VND</Text>
      </Text>

      {/* Danh sách thành viên */}
      <View style={{ marginTop: 8 }}>
        <Text style={styles.memberText}>
          Thư Đào phải trả bạn{" "}
          <Text style={{ color: "#2ECC71" }}>30.000VND</Text>
        </Text>
        <Text style={styles.memberText}>
          Đặng Lê Anh phải trả bạn{" "}
          <Text style={{ color: "#2ECC71" }}>30.000VND</Text>
        </Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        <Text style={[styles.tab, styles.tabActive]}>Thanh toán</Text>
        <Text style={styles.tab}>Nhắc nợ</Text>
      </View>

      {/* Lịch sử tháng */}
      <View style={styles.history}>
        <Text style={styles.monthTitle}>Tháng 7/2025</Text>
        <View style={styles.paymentRow}>
          <Ionicons name="cash-outline" size={22} color="#000" />
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text style={styles.paymentTitle}>Cơm tấm sườn</Text>
            <Text style={styles.paymentSub}>Bạn đã trả 90.000VND</Text>
            <Text style={styles.paymentSub}>Lúc 12/7/2025 15:30</Text>
          </View>
          <Text style={styles.paymentReceive}>Bạn sẽ nhận 60.000VND</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    backgroundColor: "#2ECC71",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  headerBtn: {
    padding: 6,
  },
  avatarBox: {
    alignItems: "center",
    marginTop: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  groupName: { fontSize: 18, fontWeight: "bold" },
  totalText: {
    textAlign: "center",
    marginTop: 8,
    fontSize: 14,
    color: "#333",
  },
  memberText: { textAlign: "center", fontSize: 13, color: "#444" },
  tabRow: {
    flexDirection: "row",
    marginTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tab: {
    flex: 1,
    textAlign: "center",
    paddingVertical: 10,
    fontWeight: "500",
    color: "#888",
  },
  tabActive: {
    color: "#2ECC71",
    borderBottomWidth: 2,
    borderBottomColor: "#2ECC71",
  },
  history: { marginTop: 16, paddingHorizontal: 12 },
  monthTitle: {
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 8,
  },
  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  paymentTitle: { fontSize: 15, fontWeight: "500" },
  paymentSub: { fontSize: 12, color: "#777" },
  paymentReceive: {
    color: "#2ECC71",
    fontWeight: "600",
    fontSize: 13,
  },
});

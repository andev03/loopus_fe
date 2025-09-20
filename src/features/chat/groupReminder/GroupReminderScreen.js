import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const members = [
  {
    id: "1",
    name: "Đặng Lê Anh",
    amount: 100000,
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: "2",
    name: "Thư Đào",
    amount: 30000,
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: "3",
    name: "Ngọc Nhi",
    amount: 30000,
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
  },
];

export default function GroupReminderScreen() {
  const total = members.reduce((sum, m) => sum + m.amount, 0);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerBtn}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nhắc nợ</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Tổng cộng */}
      <View style={styles.totalBox}>
        <Text style={styles.totalLabel}>Tổng cộng bạn nhận được</Text>
        <Text style={styles.totalAmount}>{total.toLocaleString()}VND</Text>
      </View>

      {/* Danh sách */}
      <View style={styles.list}>
        {members.map((m) => (
          <TouchableOpacity
            key={m.id}
            style={styles.memberRow}
            onPress={() => router.push(`/chat/member-debt-detail?id=${m.id}`)}
          >
            <Image source={{ uri: m.avatar }} style={styles.avatar} />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{m.name}</Text>
              <Text style={styles.subText}>Phải trả bạn</Text>
            </View>
            <Text style={styles.amount}>{m.amount.toLocaleString()}VND</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Nhắc tất cả */}
      <TouchableOpacity style={styles.remindAllBtn}>
        <Text style={styles.remindAllText}>Nhắc tất cả</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    backgroundColor: "#2ECC71",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  headerBtn: { padding: 4 },
  headerTitle: { color: "#fff", fontSize: 16, fontWeight: "600" },
  totalBox: { alignItems: "center", marginTop: 16, marginBottom: 8 },
  totalLabel: { fontSize: 14, color: "#555" },
  totalAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2ECC71",
    marginTop: 4,
  },
  list: { marginTop: 12, paddingHorizontal: 16 },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  name: { fontSize: 15, fontWeight: "500" },
  subText: { fontSize: 12, color: "#888" },
  amount: { color: "#2ECC71", fontWeight: "600", fontSize: 14 },
  remindAllBtn: {
    backgroundColor: "#2ECC71",
    paddingVertical: 12,
    marginHorizontal: 16,
    borderRadius: 6,
    marginTop: 20,
    alignItems: "center",
  },
  remindAllText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});

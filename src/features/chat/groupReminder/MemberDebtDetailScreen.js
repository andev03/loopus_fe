import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router, useFocusEffect } from "expo-router";
import { useState, useCallback } from "react";

const dummyMember = {
  id: "1",
  name: "Đặng Lê Anh",
  avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  total: 100000,
  details: [
    {
      id: "1",
      title: "Cơm tấm sườn",
      amount: 30000,
      date: "12/07/2025",
      time: "11:30",
    },
    {
      id: "2",
      title: "Bún bò",
      amount: 50000,
      date: "14/07/2025",
      time: "19:00",
    },
    {
      id: "3",
      title: "Trà sữa",
      amount: 20000,
      date: "15/07/2025",
      time: "11:30",
    },
  ],
};

export default function MemberDebtDetailScreen() {
  const { id, paid } = useLocalSearchParams();
  const [member, setMember] = useState(dummyMember);

  useFocusEffect(
    useCallback(() => {
      if (paid) {
        const updatedDetails = member.details.map((item, idx) =>
          idx === member.details.length - 1
            ? { ...item, status: "Đã trả", paidAmount: paid }
            : item
        );

        setMember({
          ...member,
          total: member.total - parseInt(paid),
          details: updatedDetails,
        });
      }
    }, [paid])
  );

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
        <Text style={styles.headerTitle}>{member.name}</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Avatar + Tổng nợ */}
      <View style={styles.profileBox}>
        <Image source={{ uri: member.avatar }} style={styles.avatarLarge} />
        <Text style={styles.subText}>
          Sẽ trả bạn{" "}
          <Text style={styles.totalAmount}>
            {member.total.toLocaleString()}VND
          </Text>
        </Text>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => router.push(`/chat/member-payment/`)}
          >
            <Text style={styles.actionText}>Thanh toán</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.actionText}>Nhắc nợ</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Lịch sử nợ */}
      <View style={styles.history}>
        <Text style={styles.historyTitle}>Tháng 7/2025</Text>

        {/* Tổng kết số tiền đã trả */}
        {paid && (
          <View style={styles.summaryRow}>
            <Ionicons name="cash-outline" size={20} color="#555" />
            <Text style={styles.summaryText}>
              {member.name} đã trả bạn{" "}
              <Text style={styles.summaryAmount}>
                {parseInt(paid).toLocaleString()}VND
              </Text>
            </Text>
          </View>
        )}

        {/* Các món chi tiết */}
        {member.details.map((d) => (
          <View key={d.id} style={styles.historyRow}>
            <Ionicons name="document-text-outline" size={20} color="#555" />
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.historyName}>{d.title}</Text>
              <Text style={styles.historyInfo}>
                {d.status === "Đã trả"
                  ? `Đã trả ${parseInt(
                      d.paidAmount
                    ).toLocaleString()}VND\nLúc ${d.date} - ${d.time}`
                  : `Bạn đã trả ${d.amount.toLocaleString()}VND\nLúc ${
                      d.date
                    } - ${d.time}`}
              </Text>
            </View>
            <Text
              style={[
                styles.historyAmount,
                { color: d.status === "Đã trả" ? "#2ECC71" : "#000" },
              ]}
            >
              {d.amount.toLocaleString()}VND
            </Text>
          </View>
        ))}
      </View>
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
  profileBox: { alignItems: "center", marginVertical: 20 },
  avatarLarge: { width: 80, height: 80, borderRadius: 40, marginBottom: 8 },
  subText: { fontSize: 14, color: "#555" },
  totalAmount: { color: "#2ECC71", fontWeight: "600" },
  actionRow: { flexDirection: "row", marginTop: 12, gap: 12 },
  actionBtn: {
    backgroundColor: "#2ECC71",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  actionText: { color: "#fff", fontWeight: "600" },
  history: { paddingHorizontal: 16, marginTop: 12 },
  historyTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginBottom: 8,
  },
  historyRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  historyName: { fontSize: 15, fontWeight: "500" },
  historyInfo: { fontSize: 12, color: "#888", marginTop: 2 },
  historyAmount: { fontSize: 14, color: "#2ECC71", fontWeight: "600" },
  summaryRow: {
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: 10,
  borderBottomWidth: 1,
  borderBottomColor: "#eee",
},
summaryText: {
  marginLeft: 8,
  fontSize: 14,
  color: "#333",
},
summaryAmount: {
  color: "#2ECC71",
  fontWeight: "600",
},
});

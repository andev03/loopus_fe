import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function GroupCalendarScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Lịch nhóm</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Body */}
      <View style={styles.body}>
        <Ionicons
          name="calendar"
          size={64}
          color="#2ECC71"
          style={{ marginBottom: 20 }}
        />

        {/* Tạo nhắc hẹn */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/chat/create-reminder")}
        >
          <Ionicons
            name="add"
            size={28}
            color="#2ECC71"
            style={styles.plusIcon}
          />
          <View>
            <Text style={styles.cardTitle}>Tạo nhắc hẹn</Text>
            <Text style={styles.cardSubtitle}>Gặp mặt, đi ăn, du lịch</Text>
          </View>
        </TouchableOpacity>

        {/* Tạo kỷ niệm */}
        <TouchableOpacity style={styles.card}>
          <Ionicons
            name="add"
            size={28}
            color="#2ECC71"
            style={styles.plusIcon}
          />
          <View>
            <Text style={styles.cardTitle}>Tạo kỷ niệm</Text>
            <Text style={styles.cardSubtitle}>Sinh nhật, dấu mốc...</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#2ECC71",
    padding: 12,
  },
  title: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  body: { flex: 1, padding: 16, alignItems: "center" },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
    padding: 16,
    borderRadius: 8,
    marginTop: 12,
    width: "100%",
  },
  plusIcon: { marginRight: 12 },
  cardTitle: { fontSize: 16, fontWeight: "600", color: "#000" },
  cardSubtitle: { fontSize: 13, color: "#555", marginTop: 2 },
});

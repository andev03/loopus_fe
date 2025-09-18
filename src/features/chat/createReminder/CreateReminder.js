import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";

export default function CreateReminderScreen() {
  const { id } = useLocalSearchParams(); // lấy id nhóm chat
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState("me");

  const handleCreateReminder = () => {
    if (!title) return;

    const reminder = {
      title,
      target,
      date: new Date().toLocaleDateString("vi-VN"),
      time: new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    router.push({
      pathname: `/chat/${id}`,
      params: { reminder: JSON.stringify(reminder) },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Tạo nhắc hẹn</Text>
          <Text style={styles.headerSubtitle}>Nhóm Cơm Tấm</Text>
        </View>
        <View style={{ width: 28 }} />
      </View>

      {/* Body */}
      <View style={styles.body}>
        {/* Chủ đề */}
        <View style={styles.inputRow}>
          <Ionicons
            name="time-outline"
            size={22}
            color="#666"
            style={styles.icon}
          />
          <TextInput
            placeholder="Gặp nhau lúc..."
            placeholderTextColor="#999"
            value={title}
            onChangeText={setTitle}
            style={styles.textInput}
          />
        </View>

        {/* Nhắc cho */}
        <View style={styles.inputRow}>
          <Ionicons
            name="lock-closed-outline"
            size={22}
            color="#666"
            style={styles.icon}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Nhắc cho</Text>
            <TouchableOpacity
              onPress={() => setTarget("me")}
              style={styles.radioRow}
            >
              <Ionicons
                name={target === "me" ? "radio-button-on" : "radio-button-off"}
                size={18}
                color="#2ECC71"
              />
              <Text style={styles.radioText}>Chỉ mình tôi</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setTarget("group")}
              style={styles.radioRow}
            >
              <Ionicons
                name={target === "group" ? "radio-button-on" : "radio-button-off"}
                size={18}
                color="#2ECC71"
              />
              <Text style={styles.radioText}>Cả nhóm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Button */}
      <TouchableOpacity
        style={styles.createButton}
        onPress={handleCreateReminder}
      >
        <Text style={styles.createButtonText}>Tạo nhắc hẹn</Text>
      </TouchableOpacity>
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
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  headerSubtitle: { color: "#fff", fontSize: 12 },
  body: { flex: 1, padding: 16 },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 12,
  },
  icon: { marginRight: 12, marginTop: 4 },
  textInput: { flex: 1, fontSize: 15, color: "#000" },
  label: { fontSize: 15, color: "#000", marginBottom: 8 },
  radioRow: { flexDirection: "row", alignItems: "center", marginVertical: 4 },
  radioText: { marginLeft: 6, fontSize: 14, color: "#333" },
  createButton: {
    backgroundColor: "#2ECC71",
    margin: 16,
    padding: 14,
    borderRadius: 24,
    alignItems: "center",
  },
  createButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

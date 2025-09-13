import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import QRCode from "react-native-qrcode-svg"; 

export default function GroupQRCodeScreen() {
  const groupLink = "https://loopus.me/adjpmds897";

  return (
    <LinearGradient
  colors={["#7BD9B3", "#A8E6CF", "#DFFFEA"]}
  start={{ x: 0, y: 0 }}
  end={{ x: 0, y: 1 }}
  style={{ flex: 1 }}
>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mã QR nhóm</Text>
        </View>

        {/* Nội dung */}
        <View style={styles.content}>
          <QRCode value={groupLink} size={200} />
          <View style={styles.linkRow}>
            <TextInput value={groupLink} editable={false} style={styles.linkInput} />
            <TouchableOpacity style={styles.linkButton}>
              <Text style={styles.linkButtonText}>Lấy link</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  backButton: { marginRight: 12 },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#000" },

  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    backgroundColor: "#fff",
    borderRadius: 25,
    overflow: "hidden",
  },
  linkInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    fontSize: 14,
    color: "#333",
  },
  linkButton: {
    backgroundColor: "#2ECC71",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 25,
  },
  linkButtonText: { color: "#fff", fontWeight: "600" },
});

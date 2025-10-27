import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { createFeedback } from "../../../services/feedbackService";
import { getUserId } from "../../../services/storageService";

export default function ImproveFeedbackScreen() {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getUserId();
      if (id) {
        setUserId(id);
        console.log("👤 [FEEDBACK] Lấy userId:", id);
      } else {
        Alert.alert("Lỗi", "Không tìm thấy thông tin người dùng");
        router.replace("/(tabs)/account");
      }
    };
    fetchUserId();
  }, []);

  const handleSubmit = async () => {
    if (!description.trim()) {
      Alert.alert("Thiếu nội dung", "Vui lòng nhập góp ý của bạn.");
      return;
    }
    if (!userId) {
      Alert.alert("Lỗi", "Không tìm thấy thông tin người dùng.");
      return;
    }

    setLoading(true);
    try {
      // 🟢 Gửi feedback với type="suggestion"
      await createFeedback(userId, "suggestion", description);
      Alert.alert("Cảm ơn bạn!", "Góp ý của bạn đã được ghi nhận.");
      setDescription("");
      router.replace("/(tabs)/account");
    } catch (err) {
      console.error("❌ [FEEDBACK] Lỗi gửi:", err);
      Alert.alert("Lỗi", "Không thể gửi góp ý. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  if (!userId) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator
          size="large"
          color="#2ECC71"
          style={{ flex: 1, justifyContent: "center" }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/(tabs)/account")}>
          <Ionicons name="arrow-back-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Góp ý cải thiện</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Nội dung */}
      <View style={styles.content}>
        <Text style={styles.desc}>
          Chia sẻ ý tưởng hoặc đề xuất giúp Loopus trở nên tốt hơn.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Mô tả chi tiết góp ý của bạn..."
          multiline
          maxLength={500}
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
          editable={!loading}
        />
        <Text style={styles.counter}>{description.length}/500</Text>

        <TouchableOpacity
          style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={loading || !description.trim()}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>Gửi góp ý</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F2F2" },
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
  content: { flex: 1, padding: 20 },
  desc: {
    fontSize: 14,
    marginBottom: 12,
    color: "#333",
    lineHeight: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    height: 120,
    textAlignVertical: "top",
    backgroundColor: "#fff",
    fontSize: 16,
  },
  counter: {
    alignSelf: "flex-end",
    marginTop: 4,
    marginBottom: 20,
    color: "#666",
    fontSize: 12,
  },
  submitBtn: {
    backgroundColor: "#2ECC71",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
  },
  submitBtnDisabled: {
    backgroundColor: "#ccc",
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

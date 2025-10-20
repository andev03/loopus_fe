import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { createFeedback } from "../../../services/feedbackService";
import { getUserId } from "../../../services/storageService"; // 🟢 Import getUserId từ storage

export default function BugReportScreen() {
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null); // 🟢 State cho userId

  // 🟢 Lấy userId từ storage khi mount
  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getUserId();
      if (id) {
        setUserId(id);
        console.log("👤 [FEEDBACK] Lấy userId:", id);
      } else {
        Alert.alert("Lỗi", "Không tìm thấy thông tin người dùng");
        router.replace("/(tabs)/account"); // Quay về nếu không có user
      }
    };
    fetchUserId();
  }, []);

  const pickImage = async () => {
    // 🟢 Yêu cầu quyền truy cập thư viện ảnh
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Quyền truy cập", "Cần quyền truy cập thư viện ảnh để chọn ảnh.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true, // 🟢 Cho phép crop/edit
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0]);
      console.log("🖼️ [FEEDBACK] Chọn ảnh:", result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      Alert.alert("Thiếu nội dung", "Vui lòng nhập mô tả chi tiết.");
      return;
    }
    if (!userId) {
      Alert.alert("Lỗi", "Không tìm thấy thông tin người dùng.");
      return;
    }

    setLoading(true);
    try {
      // 🟢 Gửi feedback báo lỗi với type="bug" và userId thật
      await createFeedback(userId, "bug", description, image);
      Alert.alert("Thành công", "Cảm ơn bạn đã báo lỗi! Chúng tôi sẽ xử lý sớm.");
      setDescription("");
      setImage(null);
      router.replace("/(tabs)/account"); // Quay về sau gửi thành công
    } catch (err) {
      console.error("❌ [FEEDBACK] Lỗi gửi:", err);
      Alert.alert("Lỗi", "Không thể gửi báo lỗi. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  if (!userId) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#2ECC71" style={{ flex: 1, justifyContent: "center" }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/(tabs)/account")}>
          <Ionicons name="arrow-back-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Báo lỗi ứng dụng</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.desc}>
          Báo lỗi kỹ thuật, màn hình trắng, tính năng không hoạt động, lỗi font chữ...
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Mô tả chi tiết (ví dụ: Lỗi xảy ra ở màn hình nào, cách tái hiện...)"
          multiline
          maxLength={500}
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
          editable={!loading}
        />
        <Text style={styles.counter}>{description.length}/500</Text>

        <TouchableOpacity style={styles.imagePicker} onPress={pickImage} disabled={loading}>
          {image ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: image.uri }} style={styles.preview} />
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => setImage(null)}
              >
                <Ionicons name="close-circle" size={20} color="#ff0000" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.placeholder}>
              <Ionicons name="image-outline" size={24} color="#2ECC71" />
              <Text style={styles.placeholderText}>+ Thêm ảnh minh họa (tùy chọn)</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={loading || !description.trim()}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>Gửi báo lỗi</Text>
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
  imagePicker: {
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#2ECC71",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  imageContainer: {
    position: "relative",
  },
  preview: { 
    width: 100, 
    height: 100, 
    borderRadius: 8,
    marginBottom: 8,
  },
  removeBtn: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  placeholder: {
    alignItems: "center",
  },
  placeholderText: {
    marginTop: 4,
    color: "#2ECC71",
    fontSize: 14,
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
    fontWeight: "600" 
  },
});
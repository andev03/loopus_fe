import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";

export default function BugReportScreen() {
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/(tabs)/account")}>
          <Ionicons name="arrow-back-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Báo lỗi ứng dụng</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Nội dung */}
      <View style={styles.content}>
        <Text style={styles.desc}>
          Báo lỗi kỹ thuật, màn hình trắng, tính năng không hoạt động, lỗi font
          chữ...
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Mô tả chi tiết"
          multiline
          maxLength={500}
          value={description}
          onChangeText={setDescription}
        />
        <Text style={styles.counter}>{description.length}/500</Text>

        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.preview} />
          ) : (
            <Text style={{ color: "#2ECC71" }}>+ Thêm ảnh</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitBtn} onPress={() => console.log("Send bug report")}>
          <Text style={styles.submitText}>Gửi</Text>
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
  content: { flex: 1, padding: 20, backgroundColor: "#fff" },
  desc: { fontSize: 14, marginBottom: 12, color: "#333" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    height: 120,
    textAlignVertical: "top",
  },
  counter: { alignSelf: "flex-end", marginTop: 4, color: "#666" },
  imagePicker: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#2ECC71",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  preview: { width: 100, height: 100, borderRadius: 8 },
  submitBtn: {
    backgroundColor: "#2ECC71",
    marginTop: 30,
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
  },
  submitText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});

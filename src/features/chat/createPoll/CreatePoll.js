import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import styles from "./CreatePoll.styles";
import { pollService } from "../../../services/pollService";
import { getUser } from "../../../services/storageService";

export default function CreatePollScreen() {
  const { groupId } = useLocalSearchParams(); // lấy groupId từ params
  const [title, setTitle] = useState("");
  const [options, setOptions] = useState(["", ""]);
  

  const handleAddOption = () => setOptions([...options, ""]);

  const handleChangeOption = (text, index) => {
    const newOptions = [...options];
    newOptions[index] = text;
    setOptions(newOptions);
  };

  const handleRemoveOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions.length ? newOptions : [""]);
  };

  const handleSubmit = async () => {
    if (!groupId) {
      Alert.alert("Lỗi", "Không tìm thấy groupId");
      console.log("❌ groupId is undefined");
      return;
    }
    if (!title.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập nội dung bình chọn");
      return;
    }

    const optionsFiltered = options.filter((o) => o.trim() !== "");
    if (optionsFiltered.length < 2) {
      Alert.alert("Lỗi", "Cần ít nhất 2 lựa chọn");
      return;
    }

    try {
      // ✅ Lấy user từ storage
      const user = await getUser();
      console.log("📦 User từ AsyncStorage:", user);

      const userId = user?.userId || user?.id; // tuỳ backend trả về field nào
      if (!userId) {
        Alert.alert("Lỗi", "Không tìm thấy userId");
        return;
      }

      console.log("🚀 Creating poll with:", {
        groupId,
        userId,
        title,
        options: optionsFiltered,
      });

      const res = await pollService.createPoll(groupId, userId, title, optionsFiltered);

      if (res.success) {
  Alert.alert("Thành công", res.message);
  console.log("🎉 Poll created:", res.data);
  const pollData = res.data;

const formattedPoll = {
  id: pollData.pollId || Date.now().toString(),  
  type: "poll",
  title: pollData.title || title,   // 👈 fallback về state title
  options: (pollData.options || optionsFiltered).map((opt) => ({
    text: opt.text || opt.optionText || opt, // fallback nếu backend trả text khác
    votes: opt.votes || [],
  })),
  sender: user.fullName || "Bạn",
  avatarUrl: user.avatarUrl || "https://via.placeholder.com/150",
  time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  isCurrentUser: true,
};

router.push({
  pathname: `/chat/${groupId}`,
  params: { poll: JSON.stringify(formattedPoll) },
});

} else {
  Alert.alert("Lỗi", res.message);
  console.log("⚠️ API Error:", res);
}
    } catch (err) {
      Alert.alert("Lỗi", "Không thể kết nối đến server");
      console.log("❌ Exception:", err);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconWrap}>
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Bình chọn</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.label}>Thăm dò ý kiến...</Text>

          <TextInput
            style={styles.input}
            placeholder="Nhập nội dung bình chọn..."
            value={title}
            onChangeText={setTitle}
          />

          {options.map((opt, idx) => (
            <View key={idx} style={styles.optionRow}>
              <Ionicons
                name="pencil-outline"
                size={18}
                color="#999"
                style={{ marginRight: 8 }}
              />
              <TextInput
                style={styles.optionInput}
                placeholder={`Bình chọn ${idx + 1}`}
                value={opt}
                onChangeText={(text) => handleChangeOption(text, idx)}
                underlineColorAndroid="transparent"
              />
              <TouchableOpacity
                onPress={() => handleRemoveOption(idx)}
                style={styles.removeBtn}
              >
                <Ionicons name="close" size={18} color="#bbb" />
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity style={styles.addRow} onPress={handleAddOption}>
            <Ionicons name="add-circle-outline" size={20} color="#2ECC71" />
            <Text style={styles.addOption}> Thêm bình chọn</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.submitText}>Bình chọn</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

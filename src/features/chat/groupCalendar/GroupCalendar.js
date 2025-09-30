import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "./GroupCalendar.style";
import { getUser } from "../../../services/storageService";

export default function GroupCalendarScreen() {
  const { id: groupId } = useLocalSearchParams();
  const [content, setContent] = useState("");
  const [date, setDate] = useState(new Date());
  const [repeat, setRepeat] = useState("Không lặp lại");
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [showRepeatOptions, setShowRepeatOptions] = useState(false);

  const handleCreateReminder = async () => {
  if (!content.trim()) {
    alert("Vui lòng nhập nội dung nhắc hẹn");
    return;
  }

  if (date < new Date()) {
    alert("Không thể chọn ngày giờ trong quá khứ");
    return;
  }

  if (!groupId) {
    alert("Không tìm thấy groupId, vui lòng thử lại");
    console.log("❌ Lỗi: groupId is undefined");
    return;
  }

  try {
    const user = await getUser();
    if (!user) {
      alert("Không thể lấy thông tin người dùng");
      return;
    }

    const newReminderMessage = {
      id: Date.now().toString(),
      type: "reminder",
      content,
      date: date.toISOString(),
      repeat,
      sender: "Bạn",
      senderId: user.userId,
      avatarUrl: user.avatarUrl || "https://via.placeholder.com/150",
      time: new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isCurrentUser: true,
    };

    // Lưu nhắc hẹn vào AsyncStorage
    const cachedMessages = await AsyncStorage.getItem(`messages_${groupId}`);
    const existingMessages = cachedMessages ? JSON.parse(cachedMessages) : [];
    const updatedMessages = [...existingMessages, newReminderMessage].sort(
      (a, b) => new Date(a.createdAt || a.date) - new Date(b.createdAt || b.date)
    );
    await AsyncStorage.setItem(`messages_${groupId}`, JSON.stringify(updatedMessages));

    // Reset form
    resetForm();

    // 👉 Quay về màn chat kèm param newReminder
    router.push({
  pathname: `/chat/${groupId}`,
  params: { id: groupId, newReminder: JSON.stringify(newReminderMessage) },
});

  } catch (err) {
    console.log("❌ Lỗi tạo nhắc hẹn:", err);
    alert("Đã xảy ra lỗi khi tạo nhắc hẹn");
  }
};


  const resetForm = () => {
    setContent("");
    setDate(new Date());
    setRepeat("Không lặp lại");
    setShowRepeatOptions(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tạo nhắc hẹn</Text>
      </View>
      <View style={styles.formBox}>
        <Text style={styles.label}>Nhập nội dung</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập nội dung nhắc hẹn"
          value={content}
          onChangeText={setContent}
        />
        <Text style={styles.label}>Chọn ngày nhắc hẹn</Text>
        <Pressable
          style={styles.dateBtn}
          onPress={() => setDatePickerVisible(true)}
        >
          <Ionicons name="calendar-outline" size={20} color="#333" />
          <Text style={{ marginLeft: 8 }}>{date.toLocaleString("vi-VN")}</Text>
        </Pressable>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="datetime"
          date={date}
          onConfirm={(selectedDate) => {
            setDate(selectedDate);
            setDatePickerVisible(false);
          }}
          onCancel={() => setDatePickerVisible(false)}
        />
        <Text style={styles.label}>Chọn kiểu lặp lại</Text>
        <Pressable
          style={styles.dateBtn}
          onPress={() => setShowRepeatOptions((prev) => !prev)}
        >
          <Ionicons name="repeat-outline" size={20} color="#333" />
          <Text style={{ marginLeft: 8 }}>{repeat}</Text>
        </Pressable>
        {showRepeatOptions && (
          <View style={styles.dropdown}>
            {["Không lặp lại", "Hàng ngày", "Hàng tuần", "Hàng tháng"].map(
              (option) => (
                <Pressable
                  key={option}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setRepeat(option);
                    setShowRepeatOptions(false);
                  }}
                >
                  <Text
                    style={{
                      color: repeat === option ? "#2ecc71" : "#333",
                      fontWeight: repeat === option ? "600" : "400",
                    }}
                  >
                    {option}
                  </Text>
                </Pressable>
              )
            )}
          </View>
        )}
        <TouchableOpacity style={styles.createBtn} onPress={handleCreateReminder}>
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Tạo nhắc hẹn
          </Text>
        </TouchableOpacity>
      </View>
      {/* Bỏ FlatList nếu không cần hiển thị danh sách ở đây */}
      {/* Nếu muốn giữ, thêm lại và load từ AsyncStorage như trước */}
    </SafeAreaView>
  );
}
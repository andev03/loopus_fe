import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { router, useLocalSearchParams } from "expo-router";
import styles from "./GroupCalendar.style";
import { getUser } from "../../../services/storageService";
import { eventService } from "../../../services/eventService";

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
      return;
    }

    try {
      const user = await getUser();
      if (!user) {
        alert("Không thể lấy thông tin người dùng");
        return;
      }

      // Format ngày & giờ theo local
      const eventDate = date.toLocaleDateString("sv-SE"); // yyyy-mm-dd
      const eventTime = date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      }); // HH:mm

      // Chuẩn bị body đúng theo API
      const payload = {
        groupId,
        creatorId: user.userId,
        title: content,
        eventDate,
        eventTime,
        repeatType:
          repeat === "Không lặp lại"
            ? "NONE"
            : repeat === "Hàng ngày"
            ? "DAILY"
            : repeat === "Hàng tuần"
            ? "WEEKLY"
            : "MONTHLY",
      };

      const res = await eventService.createEvent(payload);

      if (res.success) {
        // ✅ Quay về chat, màn chat sẽ tự load danh sách event từ API
        router.push(`/chat/${groupId}`);
      } else {
        alert(res.message);
      }
    } catch (err) {
      console.log("❌ Lỗi tạo nhắc hẹn:", err);
      alert("Đã xảy ra lỗi khi tạo nhắc hẹn");
    }
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
        <TouchableOpacity
          style={styles.createBtn}
          onPress={handleCreateReminder}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Tạo nhắc hẹn
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
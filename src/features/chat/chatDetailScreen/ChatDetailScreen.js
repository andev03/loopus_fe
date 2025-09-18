import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "react-native";
import { useState, useEffect } from "react";
import styles from "./ChatDetailScreen.styles";

export default function ChatDetailScreen() {
  const { id, poll, reminder } = useLocalSearchParams();
  const [showMenu, setShowMenu] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "1",
      sender: "Đặng Lê Anh",
      text: "Hôm trước mình ăn bao nhiêu vậy?",
      type: "text",
      time: "9:41",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    {
      id: "2",
      sender: "Đặng Lê Anh",
      text: "Ai là người ứng tiền vậy?",
      type: "text",
      time: "9:41",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    },
  ]);

  // 👉 Nhận poll từ CreatePollScreen
  useEffect(() => {
    if (poll) {
      try {
        const parsed = JSON.parse(poll);
        const newPoll = {
          id: Date.now().toString(),
          type: "poll",
          sender: "Bạn",
          poll: parsed,
        };
        setMessages((prev) => [...prev, newPoll]);
      } catch (e) {
        console.log("Poll parse error:", e);
      }
    }
  }, [poll]);

  // 👉 Nhận reminder từ CreateReminderScreen
  useEffect(() => {
    if (reminder) {
      try {
        const parsed = JSON.parse(reminder);
        const newEvent = {
          id: Date.now().toString(),
          type: "event",
          sender: "Bạn",
          event: parsed,
        };
        setMessages((prev) => [...prev, newEvent]);
      } catch (e) {
        console.log("Reminder parse error:", e);
      }
    }
  }, [reminder]);

  const renderMessage = ({ item }) => {
    if (item.type === "text") {
      return (
        <View style={styles.messageRow}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
          <View style={styles.bubbleContainer}>
            <View style={styles.bubble}>
              <View style={styles.headerRow}>
                <Text style={styles.sender}>{item.sender}</Text>
                <Text style={styles.time}>{item.time}</Text>
              </View>
              <Text style={styles.messageText}>{item.text}</Text>
            </View>
          </View>
        </View>
      );
    }

    if (item.type === "event") {
      return (
        <View style={styles.eventCard}>
          <Text style={styles.eventHeader}>📅 Bạn đã tạo một nhắc hẹn</Text>
          <View style={styles.eventBody}>
            <View style={{ flex: 1 }}>
              <Text style={styles.eventTitle}>{item.event.title}</Text>
              <Text style={styles.eventTime}>
                {item.event.date} - {item.event.time}
              </Text>
              <Text style={styles.eventTarget}>
                Nhắc cho:{" "}
                {item.event.target === "me" ? "Chỉ mình tôi" : "Cả nhóm"}
              </Text>
            </View>
          </View>
          <View style={styles.eventActions}>
            <Text style={styles.eventReject}>Bỏ qua</Text>
            <Text style={styles.eventAccept}>OK</Text>
          </View>
        </View>
      );
    }

    if (item.type === "poll") {
      return (
        <View style={styles.pollCard}>
          <View style={styles.pollHeaderRow}>
            <Ionicons name="person-circle" size={16} color="#6b6b6b" />
            <Text style={styles.pollHeader}>Bạn đã tạo lượt bình chọn</Text>
          </View>

          <Text style={styles.pollTitle} numberOfLines={2}>
            {item.poll.title}
          </Text>

          <View style={styles.pollOptions}>
            {item.poll.options.map((opt, idx) => (
              <View key={idx} style={styles.pollOption}>
                <View style={styles.pollRadioOuter}>
                  <View style={styles.pollRadioInner} />
                </View>
                <Text style={styles.pollOptionText}>{opt}</Text>
              </View>
            ))}
          </View>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.push("/chat")}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Nhóm Cơm Tấm</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="call" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="videocam" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerIcon}
            onPress={() => router.push("/chat/group-info")}
          >
            <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.flex1}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesContainer}
        />

        {/* Menu xổ xuống */}
        {showMenu && (
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuRow}>
              <Ionicons
                name="camera"
                size={22}
                color="#2ECC71"
                style={styles.menuIcon}
              />
              <Text style={styles.menuText}>Máy ảnh</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuRow}>
              <Ionicons
                name="image"
                size={22}
                color="#2ECC71"
                style={styles.menuIcon}
              />
              <Text style={styles.menuText}>Ảnh</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuRow}>
              <Ionicons
                name="mic"
                size={22}
                color="#2ECC71"
                style={styles.menuIcon}
              />
              <Text style={styles.menuText}>Ghi âm</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuRow}
              onPress={() => {
                setShowMenu(false);
                router.push("/chat/group-calendar");
              }}
            >
              <Ionicons
                name="calendar"
                size={22}
                color="#2ECC71"
                style={styles.menuIcon}
              />
              <Text style={styles.menuText}>Lịch nhóm</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuRow}
              onPress={() => {
                setShowMenu(false);
                router.push("/chat/create-poll");
              }}
            >
              <Ionicons
                name="list"
                size={22}
                color="#2ECC71"
                style={styles.menuIcon}
              />
              <Text style={styles.menuText}>Bình chọn</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuRow}
              onPress={() => {
                setShowMenu(false);
                router.push(`/chat/create-reminder?id=${id}`);
              }}
            >
              <Ionicons
                name="alarm"
                size={22}
                color="#2ECC71"
                style={styles.menuIcon}
              />
              <Text style={styles.menuText}>Nhắc hẹn</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Ô nhập tin nhắn */}
        <SafeAreaView edges={["bottom"]} style={{ backgroundColor: "#fff" }}>
          <View style={styles.inputContainer}>
            <TouchableOpacity
              style={styles.plusButton}
              onPress={() => setShowMenu(!showMenu)}
            >
              <Ionicons name="add" size={24} color="#333" />
            </TouchableOpacity>
            <TextInput
              placeholder="Gửi tin nhắn"
              style={styles.input}
              placeholderTextColor="#999"
              multiline
            />
            <TouchableOpacity style={styles.sendButton}>
              <Ionicons name="send" size={22} color="#2ECC71" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

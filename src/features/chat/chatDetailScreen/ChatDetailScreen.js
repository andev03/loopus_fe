import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "./ChatDetailScreen.styles";

import { chatService } from "../../../services/chatService";
import { getUser } from "../../../services/storageService";

export default function ChatDetailScreen() {
  const { id: groupId, newReminder, poll: newPoll } = useLocalSearchParams();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  // Load user + tin nhắn nhóm
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const u = await getUser();
        setUser(u);

        // Check groupId hợp lệ
        if (!groupId || groupId.length < 20) {
          console.log("❌ groupId không hợp lệ:", groupId);
          setLoading(false);
          return;
        }

        console.log("✅ Received groupId:", groupId, "userId:", u.userId);

        // Load cache trước
        const cachedMessages = await AsyncStorage.getItem(
          `messages_${groupId}`
        );
        if (cachedMessages) {
          setMessages(JSON.parse(cachedMessages));
        }

        // Gọi API
        const res = await chatService.getChatsByGroup(groupId, u.userId);
        if (res.success) {
          if (res.data.length > 0) {
            const mapped = res.data.map((m) => ({
              ...m,
              isCurrentUser: m.sender === "Bạn",
            }));

            // 👉 Merge API + local
            setMessages((prev) => {
              const merged = [...mapped, ...prev].reduce((acc, msg) => {
                if (!acc.some((m) => m.id === msg.id)) acc.push(msg);
                return acc;
              }, []);

              const sorted = merged.sort(
                (a, b) =>
                  new Date(a.createdAt || a.date) -
                  new Date(b.createdAt || b.date)
              );

              AsyncStorage.setItem(
                `messages_${groupId}`,
                JSON.stringify(sorted)
              );
              return sorted;
            });
          } else {
            console.log("Không tìm thấy tin nhắn, giữ nguyên tin nhắn hiện tại");
          }
        } else {
          console.log("Lỗi API:", res.message);
        }
      } catch (err) {
        console.log("❌ Lỗi fetch chats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [groupId]);

  // Nhận reminder từ GroupCalendarScreen
  useEffect(() => {
    if (newReminder) {
      try {
        const reminder = JSON.parse(newReminder);
        setMessages((prev) => {
          if (prev.some((msg) => msg.id === reminder.id)) {
            return prev;
          }
          const updated = [...prev, reminder].sort(
            (a, b) =>
              new Date(a.createdAt || a.date) - new Date(b.createdAt || b.date)
          );
          AsyncStorage.setItem(`messages_${groupId}`, JSON.stringify(updated));
          return updated;
        });
      } catch (err) {
        console.log("❌ Parse reminder error:", err);
      }
    }
  }, [newReminder, groupId]);

  // Nhận poll từ CreatePollScreen
  useEffect(() => {
    if (newPoll) {
      try {
        const poll = JSON.parse(newPoll);
        setMessages((prev) => {
          if (prev.some((msg) => msg.id === poll.id)) return prev;
          const updated = [...prev, poll];
          AsyncStorage.setItem(`messages_${groupId}`, JSON.stringify(updated));
          return updated;
        });
      } catch (err) {
        console.log("❌ Parse poll error:", err);
      }
    }
  }, [newPoll, groupId]);

  const handleSend = async () => {
    if (!inputText.trim() || !user || !groupId) return;
    const text = inputText.trim();

    const res = await chatService.sendMessage(groupId, user.userId, text);
    if (res.success && res.data) {
      const newMsg = { ...res.data, isCurrentUser: true };
      setMessages((prev) => {
        const updated = [...prev, newMsg];
        AsyncStorage.setItem(`messages_${groupId}`, JSON.stringify(updated));
        return updated;
      });
      setInputText("");
    }
  };

  // render message types
  const renderMessage = ({ item }) => {
    // Reminder
    if (item.type === "reminder") {
      const eventDate = new Date(item.date);

      return (
        <View style={styles.eventCard}>
          <View style={styles.pollHeaderRow}>
            <Image
              source={
                item.avatarUrl
                  ? { uri: item.avatarUrl }
                  : require("../../../assets/images/default-avatar.jpg")
              }
              style={styles.avatar}
            />
            <Text style={styles.pollHeader}>
              {item.sender || "Bạn"} đã tạo một cuộc hẹn
            </Text>
          </View>
          <View style={styles.eventBody}>
            <View style={styles.eventDate}>
              <Text style={styles.eventDay}>
                THG {eventDate.getMonth() + 1}
              </Text>
              <Text style={styles.eventDateNumber}>{eventDate.getDate()}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.eventTitle}>{item.content}</Text>
              <Text style={styles.eventTime}>
                {eventDate.toLocaleDateString("vi-VN", {
                  weekday: "short",
                  day: "numeric",
                  month: "numeric",
                })}
              </Text>
              <Text style={styles.eventTime}>
                Lúc{" "}
                {eventDate.toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
          </View>
          <View style={styles.eventActions}>
            <Text style={styles.eventReject}>Từ chối</Text>
            <Text style={styles.eventAccept}>Tham gia</Text>
          </View>
        </View>
      );
    }

    // Poll
    if (item.type === "poll") {
      return (
        <View style={styles.pollCard}>
          <Text style={styles.pollTitle}>{item.title}</Text>

          {item.options.map((opt, idx) => {
            const totalVotes = item.options.reduce(
              (sum, o) => sum + o.votes.length,
              0
            );
            const percent =
              totalVotes > 0 ? (opt.votes.length / totalVotes) * 100 : 0;

            return (
              <View key={idx} style={{ marginBottom: 12 }}>
                <Text style={styles.pollOptionText}>{opt.text}</Text>
                <View style={styles.progressBar}>
                  <View
                    style={[styles.progressFill, { width: `${percent}%` }]}
                  />
                </View>
                <Text style={styles.pollVotes}>
                  {opt.votes.length} phiếu ({percent.toFixed(0)}%)
                </Text>
              </View>
            );
          })}

          <TouchableOpacity style={styles.voteBtn}>
            <Text style={styles.voteText}>Vote</Text>
          </TouchableOpacity>
        </View>
      );
    }

    // Normal text message
    const isMe = item.isCurrentUser;
    const avatarSource = item.avatarUrl
      ? { uri: item.avatarUrl }
      : require("../../../assets/images/default-avatar.jpg");

    return (
      <View
        style={[
          styles.messageRow,
          isMe
            ? { justifyContent: "flex-end" }
            : { justifyContent: "flex-start" },
        ]}
      >
        {!isMe && <Image source={avatarSource} style={styles.avatar} />}
        <View
          style={[
            styles.bubble,
            { backgroundColor: "#fff" },
            isMe
              ? { borderBottomRightRadius: 0, alignSelf: "flex-end" }
              : { borderBottomLeftRadius: 0, alignSelf: "flex-start" },
          ]}
        >
          <View style={styles.headerRow}>
            {!isMe && <Text style={styles.sender}>{item.sender}</Text>}
            <Text style={styles.time}>{item.time}</Text>
          </View>
          <Text style={styles.messageText}>{item.text}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.push("/chat")}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Chi tiết nhóm</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerIcon}
            onPress={() =>
              router.push({
                pathname: "/chat/group-info",
                params: { groupId },
              })
            }
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
          keyExtractor={(item, index) =>
            item.id?.toString() || index.toString()
          }
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesContainer}
          ListEmptyComponent={
            !loading && (
              <Text
                style={{ color: "#999", textAlign: "center", marginTop: 20 }}
              >
                Chưa có tin nhắn nào
              </Text>
            )
          }
        />
        <SafeAreaView edges={["bottom"]} style={{ backgroundColor: "#fff" }}>
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={() => setShowMenu((prev) => !prev)}>
              <Ionicons name="add-circle" size={28} color="#2ECC71" />
            </TouchableOpacity>
            <TextInput
              placeholder="Gửi tin nhắn"
              style={styles.input}
              placeholderTextColor="#999"
              multiline
              value={inputText}
              onChangeText={setInputText}
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <Ionicons name="send" size={22} color="#2ECC71" />
            </TouchableOpacity>
          </View>
          {showMenu && (
            <View style={styles.menuContainer}>
              <TouchableOpacity style={styles.menuRow}>
                <Ionicons
                  name="camera"
                  size={20}
                  color="#2ECC71"
                  style={styles.menuIcon}
                />
                <Text style={styles.menuText}>Máy ảnh</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuRow}>
                <Ionicons
                  name="image"
                  size={20}
                  color="#2ECC71"
                  style={styles.menuIcon}
                />
                <Text style={styles.menuText}>Ảnh</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuRow}>
                <Ionicons
                  name="mic"
                  size={20}
                  color="#2ECC71"
                  style={styles.menuIcon}
                />
                <Text style={styles.menuText}>Ghi âm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuRow}
                onPress={() =>
                  router.push({
                    pathname: "/chat/group-calendar",
                    params: { groupId },
                  })
                }
              >
                <Ionicons
                  name="calendar"
                  size={20}
                  color="#2ECC71"
                  style={styles.menuIcon}
                />
                <Text style={styles.menuText}>Nhắc hẹn</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuRow}
                onPress={() =>
                  router.push({
                    pathname: "/chat/create-poll",
                    params: { groupId },
                  })
                }
              >
                <Ionicons
                  name="list"
                  size={20}
                  color="#2ECC71"
                  style={styles.menuIcon}
                />
                <Text style={styles.menuText}>Bình chọn</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuRow}
                onPress={() =>
                  router.push({
                    pathname: "/chat/create-split-bill",
                    params: { groupId },
                  })
                }
              >
                <Ionicons
                  name="cash"
                  size={20}
                  color="#2ECC71"
                  style={styles.menuIcon}
                />
                <Text style={styles.menuText}>Chia tiền</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuRow}
                onPress={() =>
                  router.push({
                    pathname: "/chat/create-reminder",
                    params: { groupId },
                  })
                }
              >
                <Ionicons
                  name="alarm"
                  size={20}
                  color="#2ECC71"
                  style={styles.menuIcon}
                />
                <Text style={styles.menuText}>Nhắc nợ</Text>
              </TouchableOpacity>
            </View>
          )}
        </SafeAreaView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

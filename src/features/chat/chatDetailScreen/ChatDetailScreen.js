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
import styles from "./ChatDetailScreen.styles";

import { chatService } from "../../../services/chatService";
import { getUser } from "../../../services/storageService";

export default function ChatDetailScreen() {
  const { id: groupId } = useLocalSearchParams(); // groupId được truyền từ list
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user + tin nhắn nhóm
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const u = await getUser();
        setUser(u);

        const res = await chatService.getChatsByGroup(groupId);
        if (res.success) {
          setMessages(res.data);
        }
      } catch (err) {
        console.log("❌ Lỗi fetch chats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [groupId]);

  const handleSend = async () => {
  if (!inputText.trim() || !user) return;

  const text = inputText.trim();

  const res = await chatService.sendMessage(groupId, user.userId, text);
  if (res.success && res.data) {
    // lấy tin nhắn thật từ server
    setMessages((prev) => [...prev, res.data]);
    setInputText("");
  }
};

  // Render tin nhắn
  const renderMessage = ({ item }) => (
    <View style={styles.messageRow}>
      <Image
        source={{ uri: item.avatar || "https://via.placeholder.com/150" }}
        style={styles.avatar}
      />
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
        <Text style={styles.title}>Chi tiết nhóm</Text>
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

      {/* Nội dung chat */}
      <KeyboardAvoidingView
        style={styles.flex1}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <FlatList
          data={messages}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesContainer}
          ListEmptyComponent={
            !loading && (
              <Text style={{ color: "#999", textAlign: "center", marginTop: 20 }}>
                Chưa có tin nhắn nào
              </Text>
            )
          }
        />

        {/* Ô nhập tin nhắn */}
        <SafeAreaView edges={["bottom"]} style={{ backgroundColor: "#fff" }}>
          <View style={styles.inputContainer}>
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
        </SafeAreaView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

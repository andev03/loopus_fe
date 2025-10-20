import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { sendUserMessage, getChatMessages } from "../../../services/supportChatService";
import { getUserId, getChatId, saveChatId } from "../../../services/storageService";

export default function ChatLoopusScreen() {
  const navigation = useNavigation();
  const [userId, setUserId] = useState(null);
  const [chatId, setChatId] = useState(null); // 🟢 Thêm state cho chatId
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // 🟢 Lấy userId VÀ chatId từ AsyncStorage khi vào màn hình
  useEffect(() => {
    const fetchIds = async () => {
      const id = await getUserId();
      const savedChatId = await getChatId(); // 🟢 Lấy chatId đã lưu
      console.log("👤 [USER] Lấy IDs từ storage:", { userId: id, chatId: savedChatId });
      if (id) {
        setUserId(id);
        if (savedChatId) setChatId(savedChatId); // 🟢 Set chatId nếu có
      } else {
        Alert.alert("Lỗi", "Không tìm thấy thông tin người dùng");
      }
    };
    fetchIds();
  }, []);

  // 🟢 Lấy tin nhắn khi có userId HOẶC chatId
  useEffect(() => {
    if (!userId) return;
    const idToUse = chatId || userId; // 🟢 Ưu tiên chatId, fallback userId (lần đầu)
    const fetchMessages = async () => {
      try {
        console.log("🔄 [CHAT] Bắt đầu load tin nhắn với ID:", idToUse);
        setLoading(true);

        const res = await getChatMessages(idToUse); // 🟢 Dùng idToUse
        console.log("📦 [CHAT] Dữ liệu server trả về:", res);

        const data = Array.isArray(res.data) ? res.data : [];
        const formatted = data.map((msg) => ({
          id: msg.id || Date.now().toString(),
          sender: msg.isUser ? "Bạn" : "Loopus",
          text: msg.message,
          time: new Date(msg.createdAt).toLocaleTimeString().slice(0, 5),
        }));
        setMessages(formatted);

        console.log(`✅ [CHAT] Đã load ${formatted.length} tin nhắn`);
      } catch (error) {
        console.log("❌ [CHAT] Lỗi khi load tin nhắn:", error);
        // Nếu lỗi lần đầu (không có chat), có thể tạo bằng gửi message rỗng sau
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [userId, chatId]); // 🟢 Depend vào cả 2 để reload khi có chatId mới

  // 🟢 Gửi tin nhắn user
  const sendMessage = async () => {
    if (!input.trim() || !userId) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: "Bạn",
      text: input,
      time: new Date().toLocaleTimeString().slice(0, 5),
    };
    setMessages((prev) => [...prev, userMsg]);

    const content = input;
    setInput("");

    console.log("✉️ [CHAT] Đang gửi tin nhắn:", content);

    try {
      const res = await sendUserMessage(userId, content);
      console.log("📬 [CHAT] Phản hồi server đầy đủ:", res); // 🟢 Log full để check chatId

      // 🟢 Lưu chatId nếu server trả về (check field đúng, ví dụ: res.data.chatId)
      if (res?.data?.chatId) {
        const newChatId = res.data.chatId;
        setChatId(newChatId);
        await saveChatId(newChatId); // 🟢 Lưu vào storage
        console.log("💾 [CHAT] Đã lưu chatId mới:", newChatId);
      }

      if (res?.data) {
        const msg = res.data;
        const senderName = msg.sender?.fullName || "Loopus";
        const senderId = msg.sender?.userId;
        const isUser = senderId === userId;

        const replyMsg = {
          id: msg.messageId || Date.now().toString() + 1, // 🟢 Fallback nếu không có
          sender: isUser ? "Bạn" : senderName,
          text: msg.message,
          time: new Date(msg.createdAt || Date.now()).toLocaleTimeString().slice(0, 5),
        };

        setMessages((prev) => [...prev, replyMsg]);
      }
    } catch (error) {
      console.log("❌ [CHAT] Lỗi khi gửi tin nhắn:", error);
      Alert.alert("Lỗi", "Không gửi được tin nhắn");
    }
  };

  const renderMessage = ({ item }) => {
    const isUser = item.sender === "Bạn";
    return (
      <View
        style={[
          styles.messageRow,
          { justifyContent: isUser ? "flex-end" : "flex-start" },
        ]}
      >
        {!isUser && (
          <Image
            source={{
              uri: "https://via.placeholder.com/150/2ECC71/FFFFFF?text=L",
            }}
            style={styles.avatar}
          />
        )}
        <View
          style={[
            styles.messageBubble,
            { backgroundColor: isUser ? "#DCF8C6" : "#f1f1f1" },
          ]}
        >
          {!isUser && <Text style={styles.sender}>Trợ Lý Loopus</Text>}
          <Text style={styles.messageText}>{item.text}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close-outline" size={28} color="#fff" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Trợ Lý Loopus</Text>
          <Text style={styles.headerSubtitle}>Trung tâm trợ giúp</Text>
        </View>
        <View style={{ width: 28 }} />
      </View>

      {/* Chat list */}
      {loading ? (
        <ActivityIndicator
          style={{ marginTop: 20 }}
          size="large"
          color="#2ECC71"
        />
      ) : (
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={{ padding: 16 }}
        />
      )}

      {/* Input */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Nhập nội dung"
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Ionicons name="send" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    backgroundColor: "#2ECC71",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    justifyContent: "space-between",
  },
  headerTitle: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  headerSubtitle: { color: "#fff", fontSize: 12 },
  messageRow: { flexDirection: "row", marginBottom: 10 },
  avatar: { width: 32, height: 32, borderRadius: 16, marginRight: 8 },
  messageBubble: {
    maxWidth: "75%",
    padding: 10,
    borderRadius: 8,
  },
  sender: { fontSize: 12, fontWeight: "bold", marginBottom: 2 },
  messageText: { fontSize: 14 },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  input: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 14,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#2ECC71",
    padding: 10,
    borderRadius: 20,
  },
});
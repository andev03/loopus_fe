import React, { useEffect, useState, useRef } from "react";
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
import { getUserId, getChatId, saveChatId, getUserRole, clearChatId } from "../../../services/storageService";

export default function ChatLoopusScreen() {
  const navigation = useNavigation();
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef(null);

  useEffect(() => {
    const fetchIds = async () => {
      const id = await getUserId();
      const role = await getUserRole();
      console.log("👤 [USER] Lấy IDs từ storage:", { userId: id, role });
      if (id && role) {
        setUserId(id);
        setUserRole(role);
        
        // 🟢 Lấy chatId riêng theo userId
        const savedChatId = await getChatId(id);
        if (savedChatId) {
          setChatId(savedChatId);
          console.log("💾 [STORAGE] Load chatId riêng:", savedChatId);
        } else {
          console.log(`${role === 'ADMIN' ? '👑 [ADMIN]' : '👤 [USER]'} Chưa có chatId riêng, sẽ tạo khi gửi message`);
        }
        
        // 🟢 USER: Không Alert, chỉ rỗng nếu chưa chat
        if (role !== 'ADMIN') {
          console.log("👤 [USER] Chỉ xem chat riêng của mình");
        }
      } else {
        Alert.alert("Lỗi", "Không tìm thấy thông tin người dùng");
        navigation.goBack();
      }
    };
    fetchIds();
  }, []);

  const loadMessages = async (idToUse) => {
    // 🟢 USER chỉ load nếu có chatId riêng
    if (userRole === 'USER' && !chatId) {
      console.log("👤 [USER] Chưa có chatId riêng, giữ list rỗng");
      setMessages([]);
      return;
    }
    
    try {
      console.log("🔄 [CHAT] Load tin nhắn với ID:", idToUse, "(Role:", userRole, ")");
      setLoading(true);

      const res = await getChatMessages(idToUse);
      console.log("📦 Dữ liệu server:", res);

      let data = Array.isArray(res.data) ? res.data : [];
      // 🟢 USER: Filter chỉ message của userId (an toàn frontend)
      if (userRole === 'USER') {
        data = data.filter(msg => msg.sender?.userId === userId);
      }
      
      // Sort ASC (cũ trên, mới dưới)
      data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      const formatted = data.map((msg, index) => ({
        id: msg.messageId || `${Date.now()}-${Math.random().toString(36)}-${index}`,
        isUser: msg.sender?.userId === userId,
        sender: msg.sender?.userId === userId ? "Bạn" : (msg.sender?.fullName || (userRole === 'ADMIN' ? "User" : "Loopus")),
        text: msg.message || "",
        time: msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString().slice(0, 5) : "",
      }));
      
      const keys = formatted.map(m => m.id);
      if (new Set(keys).size !== keys.length) console.warn("⚠️ Duplicate keys!");
      console.log("🔍 Keys:", keys.slice(0, 5));

      setMessages(formatted);
      console.log(`✅ Load ${formatted.length} tin nhắn`);
    } catch (error) {
      console.log("❌ Lỗi load:", error);
      if (error.response?.status === 404) {
        console.log(`${userRole === 'ADMIN' ? '👑 [ADMIN]' : '👤 [USER]'} Chat chưa tồn tại`);
      }
      setMessages([]); // Rỗng nếu lỗi
    } finally {
      setLoading(false);
    }
  };

  // Auto-scroll xuống dưới
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages]);

  useEffect(() => {
    if (!userId || !userRole) return;
    const idToUse = chatId || userId; // Fallback userId để tạo/load
    loadMessages(idToUse);
  }, [userId, chatId, userRole]);

  const sendMessage = async () => {
    if (!input.trim() || !userId) return;

    const content = input.trim();
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36);
    const userMsg = {
      id: `${timestamp}-${randomStr}`,
      isUser: true,
      sender: "Bạn",
      text: content,
      time: new Date().toLocaleTimeString().slice(0, 5),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    console.log("✉️ Gửi:", content);

    try {
      setLoading(true);
      const res = await sendUserMessage(userId, content);
      console.log("📬 Phản hồi:", res);

      // 🟢 Lưu chatId riêng theo userId nếu có mới
      if (res?.data?.chatId) {
        await saveChatId(userId, res.data.chatId);
        setChatId(res.data.chatId);
        console.log("💾 Lưu chatId riêng cho", userId, ":", res.data.chatId);
      }

      const idToUse = chatId || userId || res?.data?.chatId;
      await loadMessages(idToUse); // Reload: ADMIN thấy tất, USER chỉ riêng

      setTimeout(() => {
        console.log("🔍 Keys after reload:", messages.map(m => m.id).slice(-2));
      }, 0);
    } catch (error) {
      console.log("❌ Lỗi gửi:", error);
      Alert.alert("Lỗi", "Không gửi được tin nhắn");
      setMessages((prev) => prev.filter(m => m.id !== userMsg.id)); // Rollback
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = ({ item }) => {
    const isUser = item.isUser || item.sender === "Bạn";
    const senderToShow = !isUser ? item.sender : null;
    const hasTime = !!item.time;
    return (
      <View style={[styles.messageRow, { justifyContent: isUser ? "flex-end" : "flex-start" }]}>
        {!isUser && (
          <Image source={{ uri: "https://via.placeholder.com/150/2ECC71/FFFFFF?text=L" }} style={styles.avatar} />
        )}
        <View style={[styles.messageBubble, { backgroundColor: isUser ? "#DCF8C6" : "#f1f1f1" }]}>
          {senderToShow && <Text style={styles.sender}>{senderToShow}</Text>}
          <Text style={styles.messageText}>{item.text}</Text>
          {hasTime && <Text style={styles.time}>{item.time}</Text>}
        </View>
      </View>
    );
  };

  // 🟢 Render text hướng dẫn nếu USER chưa chat (thay vì return riêng)
  const renderEmptyList = () => {
    if (userRole === 'USER' && messages.length === 0 && !loading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 16, textAlign: 'center', color: '#666', marginBottom: 20 }}>
            Gửi tin nhắn đầu tiên để bắt đầu chat hỗ trợ!
          </Text>
        </View>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header (luôn show) */}
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
      {loading && messages.length === 0 ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#2ECC71" />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={renderMessage}
          ListEmptyComponent={renderEmptyList} // 🟢 Text hướng dẫn nếu rỗng (chỉ USER)
          contentContainerStyle={{ padding: 16, flexGrow: 1 }}
        />
      )}

      {/* Input (luôn show) */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Nhập nội dung"
          value={input}
          onChangeText={setInput}
          editable={!loading}
        />
        <TouchableOpacity 
          style={[styles.sendButton, loading && { opacity: 0.5 }]} 
          onPress={sendMessage}
          disabled={loading || !input.trim()}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="send" size={22} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Styles (giữ nguyên từ code cũ, thêm nếu thiếu)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#2ECC71",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  headerSubtitle: {
    color: "#fff",
    fontSize: 14,
    opacity: 0.8,
  },
  messageRow: {
    flexDirection: "row",
    marginVertical: 4,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  sender: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 20,
  },
  time: {
    fontSize: 12,
    color: "#999",
    alignSelf: "flex-end",
    marginTop: 4,
  },
  inputRow: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#2ECC71",
    justifyContent: "center",
    alignItems: "center",
  },
});
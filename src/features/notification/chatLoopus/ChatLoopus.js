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
  const pollIntervalRef = useRef(null);  // Ref cho interval
  const isInitializedRef = useRef(false);  // ← THÊM: Flag để chỉ init polling 1 lần sau khi có chatId ổn định

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
    // 🟢 USER chỉ load nếu có chatId riêng (hoặc fallback userId để tạo)
    if (userRole === 'USER' && !idToUse) {
      console.log("👤 [USER] Chưa có chatId/userId, giữ list rỗng");
      setMessages([]);
      return;
    }
    
    try {
      console.log("🔄 [CHAT] Load tin nhắn với ID:", idToUse, "(Role:", userRole, ")");
      setLoading(true);

      const res = await getChatMessages(idToUse);
      console.log("📦 Raw dữ liệu server:", res);  // ← DEBUG: Xem full response

      // ✅ FIX: Unwrap đúng structure (array hoặc {data: [...]})
      let data = [];
      if (Array.isArray(res)) {
        data = res;
      } else if (res?.data && Array.isArray(res.data)) {
        data = res.data;
      } else if (Array.isArray(res.data?.data)) {
        data = res.data.data;
      } else {
        data = res.data || [];
      }
      
      console.log("🔍 Raw data before process:", data.length, "items");  // ← DEBUG: Check có admin msg không

      // ✅ FIX: BỎ FILTER SAI - User thấy TẤT CẢ messages (phân biệt sender sau)
      // Không filter nữa: User cần thấy cả admin + user msg

      // Sort ASC (cũ trên, mới dưới)
      data.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
      const formatted = data.map((msg, index) => ({
        id: msg.messageId || `${Date.now()}-${Math.random().toString(36)}-${index}`,
        isUser: msg.sender?.userId === userId,
        sender: msg.sender?.userId === userId ? "Bạn" : (msg.sender?.fullName || (userRole === 'ADMIN' ? "User" : "Loopus")),
        text: msg.message || msg.content || "",  // ← FIX: Hỗ trợ content/message
        time: msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString().slice(0, 5) : "",
      }));
      
      const keys = formatted.map(m => m.id);
      if (new Set(keys).size !== keys.length) console.warn("⚠️ Duplicate keys!");
      console.log("✅ Formatted", formatted.length, "messages (first sender:", formatted[0]?.sender, ")");  // ← DEBUG

      setMessages(formatted);
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

  // ✅ FIXED: Single useEffect cho INITIAL LOAD + POLLING (tránh multi-interval)
  useEffect(() => {
    if (!userId || !userRole) return;

    const idToUse = chatId || userId; // Fallback userId để tạo/load
    if (idToUse) {
      loadMessages(idToUse);  // Load ngay khi có ID
      console.log("🔄 [INITIAL] Load messages lần đầu với ID:", idToUse);

      // ✅ START POLLING CHỈ 1 LẦN SAU INITIAL LOAD (sử dụng flag ref)
      if (!isInitializedRef.current) {
        // Clear nếu có interval cũ (an toàn)
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
          console.log("🛑 [POLLING] Clear interval cũ trước khi start");
        }

        // Start polling với chatId hiện tại (sẽ dùng chatId mới nếu change sau)
        pollIntervalRef.current = setInterval(() => {
          loadMessages(chatId || idToUse);  // Dùng chatId ưu tiên
        }, 5000);
        isInitializedRef.current = true;  // Flag: Chỉ start 1 lần
        console.log("🔄 [POLLING] Bắt đầu poll messages mỗi 5s với ID:", idToUse);
      }
    }

    // Cleanup polling khi unmount
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
        isInitializedRef.current = false;  // Reset flag nếu cần re-init
        console.log("🛑 [POLLING] Dừng poll hoàn toàn (unmount)");
      }
    };
  }, [userId, userRole, chatId]);  // Depend on all, nhưng flag tránh re-start polling

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
        setChatId(res.data.chatId);  // Trigger effect để update ID (polling sẽ dùng ID mới)
        console.log("💾 Lưu chatId riêng cho", userId, ":", res.data.chatId);
      }

      const idToUse = chatId || userId || res?.data?.chatId;
      await loadMessages(idToUse); // Reload ngay sau gửi (không chờ poll)

      // ✅ FIXED: Log sau khi state update (sử dụng useEffect nếu cần, nhưng tạm console sau await)
      setTimeout(() => {
        console.log("🔍 Keys after reload:", messages.map(m => m.id).slice(-2));  // Note: Có thể log old, nhưng OK cho debug
      }, 100);  // Tăng timeout để state update
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
    if (userRole === 'USER' && messages.length === 0 && !loading && !chatId) {
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

// Styles (giữ nguyên)
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
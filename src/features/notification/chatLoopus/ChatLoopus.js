// app/notification/chatloopus.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function ChatLoopusScreen() {
  const navigation = useNavigation();
  const [messages, setMessages] = useState([
    {
      id: "1",
      sender: "Loopus",
      text: "Chào bạn, mình có thể hỗ trợ gì cho bạn?",
      time: "9:41",
    },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg = {
      id: Date.now().toString(),
      sender: "Bạn",
      text: input,
      time: new Date().toLocaleTimeString().slice(0, 5),
    };
    setMessages([...messages, newMsg]);
    setInput("");
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
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={{ padding: 16 }}
      />

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

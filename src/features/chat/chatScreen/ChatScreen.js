import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

// Import ảnh mặc định từ assets
import DefaultAvatar from "../../../assets/images/default-avatar.jpg"; // Sử dụng ảnh mặc định chung

import styles from "../chatScreen/ChatScreen.styles";
import { groupService } from "../../../services/groupService"; // <-- import service
import { getUser } from "../../../services/storageService";
import { chatService } from "../../../services/chatService";

function ChatScreen() {
  const [groups, setGroups] = useState([]); // dữ liệu nhóm
  const [loading, setLoading] = useState(true); // trạng thái loading
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // Thêm state cho tìm kiếm

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const user = await getUser();
        if (!user?.userId) {
          setError("Không tìm thấy userId");
          return;
        }

        // lấy danh sách group
        const res = await groupService.getGroups(user.userId);
        let groupsData = res.data?.data || [];

        // gọi thêm API lấy tin nhắn cuối cho từng group
        const groupsWithLastMsg = await Promise.all(
          groupsData.map(async (g) => {
            const chatRes = await chatService.getChatsByGroup(g.groupId);
            let lastMessage = null;
            let lastTime = null;

            if (chatRes.success && chatRes.data.length > 0) {
              const lastChat = chatRes.data[chatRes.data.length - 1];
              lastMessage = lastChat.message; // Sử dụng "message" theo log API
              lastTime = lastChat.createdAt;
            }

            return {
              ...g,
              lastMessage: lastMessage || "Chưa có tin nhắn",
              lastMessageTime: lastTime || "",
            };
          })
        );

        setGroups(groupsWithLastMsg);
      } catch (err) {
        console.log("Lỗi lấy nhóm:", err.response?.data || err.message);
        setError("Không tải được danh sách nhóm");
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  // Lọc danh sách nhóm dựa trên searchQuery
  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => router.push(`/chat/${item.groupId}`)}
    >
      <Image
        source={item.avatarUrl ? { uri: item.avatarUrl } : DefaultAvatar} // Sử dụng DefaultAvatar làm ảnh nhóm mặc định
        style={styles.avatar}
      />
      <View style={styles.textContainer}>
        <Text style={styles.groupName}>{item.name}</Text>
        <Text style={styles.lastMessage}>{item.lastMessage}</Text>
      </View>
      <Text style={styles.time}>
        {item.lastMessageTime
          ? new Date(item.lastMessageTime).toLocaleTimeString()
          : ""}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Ionicons
            name="search-outline"
            size={18}
            color="#fff"
            style={{ marginLeft: 6 }}
          />
          <TextInput
            placeholder="Tìm kiếm nhóm"
            placeholderTextColor="#e6e6e6"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery} // Cập nhật state khi nhập
          />
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/create-group")}
        >
          <Ionicons name="add" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Nội dung */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#fff"
          style={{ marginTop: 20 }}
        />
      ) : error ? (
        <Text style={{ color: "red", textAlign: "center", marginTop: 20 }}>
          {error}
        </Text>
      ) : (
        <FlatList
          data={filteredGroups} // Sử dụng danh sách đã lọc
          keyExtractor={(item) => item.groupId}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <Text style={{ color: "#fff", textAlign: "center", marginTop: 20 }}>
              {searchQuery && filteredGroups.length === 0
                ? "Không tìm thấy nhóm"
                : "Chưa có nhóm nào"}
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

export default ChatScreen;
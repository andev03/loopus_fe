import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import styles from "../createGroupScreen/CreateGroupScreen.styles";
import { groupService } from "../../../services/groupService";
import { getUser } from "../../../services/storageService";

// Fake contact list
const contacts = [
  {
    id: "1",
    name: "Đặng Lê Anh",
    time: "3 giờ trước",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: "2",
    name: "Thư Đào",
    time: "3 giờ trước",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: "3",
    name: "Ngọc Nhi",
    time: "3 giờ trước",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
  },
];

function CreateGroupScreen() {
  const [groupName, setGroupName] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  // Toggle chọn thành viên
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedIds.includes(item.id);
    return (
      <View style={styles.item}>
        <TouchableOpacity
          style={[
            styles.checkbox,
            { backgroundColor: isSelected ? "#4CAF50" : "#fff" },
          ]}
          onPress={() => toggleSelect(item.id)}
        />
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View style={styles.textContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
      </View>
    );
  };

const handleCreateGroup = async () => {
  const user = await getUser();
  console.log("👉 User lấy từ AsyncStorage:", user);

  if (!user?.userId) {
    console.log("❌ Không tìm thấy userId");
    return;
  }

  const fakeMember1 = "11111111-1111-1111-1111-111111111111";
  const fakeMember2 = "22222222-2222-2222-2222-222222222222";

  const payload = {
    name: groupName || "Nhóm test",
    description: "Group được tạo từ app",
    createdBy: user.userId,
    userMemberIds: [user.userId, fakeMember1, fakeMember2], // ✅ ít nhất 2 thành viên
  };

  const res = await groupService.createGroup(payload);
  console.log("👉 Kết quả tạo group:", res);
};



  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/chat")}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nhóm mới</Text>
      </View>

      {/* Nhập tên nhóm */}
      <View style={styles.groupInput}>
        <Ionicons name="camera-outline" size={28} color="#888" />
        <TextInput
          placeholder="Tên nhóm"
          style={styles.groupNameInput}
          value={groupName}
          onChangeText={setGroupName}
        />
        <Ionicons name="expand-outline" size={22} color="#888" />
      </View>

      {/* Ô tìm kiếm */}
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={18} color="#888" />
        <TextInput
          placeholder="Tìm tên hoặc số điện thoại"
          style={styles.searchInput}
          placeholderTextColor="#aaa"
        />
      </View>

      {/* Danh sách contact */}
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      {/* Nút gửi */}
      <TouchableOpacity style={styles.sendButton} onPress={handleCreateGroup}>
        <Ionicons name="send" size={26} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export default CreateGroupScreen;

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
import { findUserByEmail } from "../../../services/authService";

function CreateGroupScreen() {
  const [groupName, setGroupName] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [contacts, setContacts] = useState([]); // danh sách member tìm được
  const [searchEmail, setSearchEmail] = useState("");

  // Toggle chọn thành viên
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

const handleAddByEmail = async () => {
  if (!searchEmail) return;

  const currentUser = await getUser(); // lấy user hiện tại
  if (currentUser?.username === searchEmail.trim()) {
    Alert.alert("Thông báo", "Không thể tự thêm chính mình");
    return;
  }

  const res = await findUserByEmail(searchEmail.trim());
  if (res.success && res.userId) {
    const exists = contacts.some((c) => c.id === res.userId);
    if (exists) {
      Alert.alert("Thông báo", "Người dùng đã có trong danh sách");
    } else {
      setContacts((prev) => [
        ...prev,
        {
          id: res.userId,
          name: res.name,
          email: res.email,
          avatar: res.avatar,
          time: "Vừa thêm",
        },
      ]);
      setSearchEmail("");
    }
  } else {
    Alert.alert("Thông báo", res.message || "Không tìm thấy user");
  }
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
  if (!user?.userId) {
    Alert.alert("Lỗi", "Không tìm thấy userId");
    return;
  }

  // thêm cả người tạo vào danh sách thành viên
  const userMemberIds = [...selectedIds, user.userId];

  const payload = {
    name: groupName || "Nhóm mới",
    description: "Group được tạo từ app",
    createdBy: user.userId,
    avatarUrl: "https://yourcdn.com/default-avatar.jpg", 
    userMemberIds,
  };

  console.log("📦 Payload gửi lên:", payload);

  const res = await groupService.createGroup(payload);

  if (res?.status === 200) {
    Alert.alert("Thành công", "Tạo nhóm thành công!");
    router.replace("/chat");
  } else {
    Alert.alert("Thất bại", res?.message || "Tạo nhóm thất bại");
  }
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

      {/* Ô tìm kiếm email */}
      <View style={styles.searchBar}>
        <Ionicons name="mail-outline" size={18} color="#888" />
        <TextInput
          placeholder="Nhập email để thêm thành viên"
          style={styles.searchInput}
          placeholderTextColor="#aaa"
          value={searchEmail}
          onChangeText={setSearchEmail}
          onSubmitEditing={handleAddByEmail}
        />
        <TouchableOpacity onPress={handleAddByEmail}>
          <Ionicons name="add-circle-outline" size={24} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      {/* Danh sách contact */}
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id.toString()}
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

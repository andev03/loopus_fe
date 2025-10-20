import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
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
  const [contacts, setContacts] = useState([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [userGroups, setUserGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load user và nhóm
  useEffect(() => {
    const loadData = async () => {
      try {
        const user = await getUser();
        setCurrentUser(user);

        if (user?.userId) {
          const res = await groupService.getGroups(user.userId);
          if (res.success && res.data?.data) {
            const allGroups = res.data.data;
            const createdGroups = allGroups.filter(g => g.createdBy === user.userId);
            setUserGroups(createdGroups);
          }
        }
      } catch (err) {
        console.error("Lỗi load dữ liệu:", err);
        Alert.alert("Lỗi", "Không thể tải dữ liệu nhóm");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleAddByEmail = async () => {
    if (!searchEmail) return;

    if (currentUser?.username === searchEmail.trim()) {
      Alert.alert("Thông báo", "Không thể tự thêm chính mình");
      return;
    }

    const res = await findUserByEmail(searchEmail.trim());

    if (res?.success && res?.userId) {
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
          },
        ]);
        Alert.alert("Thông báo", "Đã thêm thành viên");
        setSearchEmail("");
      }
    } else {
      Alert.alert("Thông báo", res?.message || "Không tìm thấy người này");
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
  if (!currentUser) {
    Alert.alert("Lỗi", "Không tìm thấy thông tin người dùng");
    return;
  }

  // === KIỂM TRA GIỚI HẠN CHO USER ===
  if (currentUser.role === "USER") {
    const totalMembers = selectedIds.length + 1; // +1 là người tạo
    if (totalMembers > 3) {
      Alert.alert(
        "Giới hạn nhóm",
        "Bạn chỉ được tạo nhóm tối đa 3 người. Nâng cấp Premium để thêm nhiều hơn!",
        [
          { text: "Hủy", style: "cancel" },
          {
            text: "Nâng cấp",
            onPress: () => router.push("account/premium"),
          },
        ]
      );
      return;
    }
  }

  if (!selectedIds.length) {
    Alert.alert("Thông báo", "Vui lòng chọn ít nhất 1 thành viên");
    return;
  }

  const userMemberIds = [...selectedIds, currentUser.userId];

  const payload = {
    name: groupName || "Nhóm mới",
    description: "Group được tạo từ app",
    createdBy: currentUser.userId,
    avatarUrl: "https://yourcdn.com/default-avatar.jpg",
    userMemberIds,
  };

  try {
    const res = await groupService.createGroup(payload);
    if (res?.status === 200) {
      Alert.alert("Thành công", "Tạo nhóm thành công!", [
        { text: "OK", onPress: () => router.replace("/chat") }
      ]);
    } else {
      Alert.alert("Thất bại", res?.message || "Tạo nhóm thất bại");
    }
  } catch (err) {
    Alert.alert("Lỗi", "Không thể tạo nhóm");
  }
};

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={{ marginTop: 10 }}>Đang tải dữ liệu...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/chat")}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Nhóm mới</Text>
          <Text style={{ color: "#fff", fontSize: 12, textAlign: "center" }}>
            {currentUser?.role === "USER" 
              ? `Đã tạo: ${userGroups.length}/2 nhóm` 
              : "Thành viên Premium"}
          </Text>
        </View>
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

      <View style={styles.counterContainer}>
  <Text style={styles.counterText}>
    {currentUser?.role === "USER"
      ? `Đã chọn: ${selectedIds.length}/2 thành viên (tối đa 3 người)`
      : `Đã chọn: ${selectedIds.length} thành viên`}
  </Text>
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
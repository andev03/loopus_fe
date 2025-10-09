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
import { router, useLocalSearchParams } from "expo-router";
import styles from "../createGroupScreen/CreateGroupScreen.styles";

import { findUserByEmail } from "../../../services/authService";
import { groupService } from "../../../services/groupService";
import { getUser } from "../../../services/storageService";

export default function AddMemberScreen() {
  const { groupId } = useLocalSearchParams();
  console.log("🔑 GroupId từ params:", groupId);
  const [selectedIds, setSelectedIds] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [searchEmail, setSearchEmail] = useState("");

  // toggle chọn
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

// tìm user bằng API
const handleAddByEmail = async () => {
  if (!searchEmail) return;
  console.log("🔍 Email đang tìm kiếm:", searchEmail);

  const currentUser = await getUser(); // Lấy thông tin người dùng hiện tại
  if (currentUser?.username === searchEmail.trim()) {
    Alert.alert("Thông báo", "Không thể tự thêm chính mình");
    return;
  }

  const res = await findUserByEmail(searchEmail);
  if (res.success && res.userId) {
    // ✅ check với danh sách trong group từ backend
    const membersRes = await groupService.viewMembers(groupId);
    if (membersRes.success) {
      const members = membersRes.data?.data || [];
      const existsInGroup = members.some((m) => m.userId === res.userId);
      if (existsInGroup) {
        Alert.alert("Thông báo", "Người này đã ở trong nhóm");
        setSearchEmail("");
        return;
      }
    }

    const newUser = {
      id: res.userId,
      name: res.name,
      email: res.email,
      avatar: res.avatar,
    };
    // check trùng trong contacts tạm
    if (!contacts.find((c) => c.id === newUser.id)) {
      setContacts((prev) => [...prev, newUser]);
      Alert.alert("Thành công", "Đã tìm thấy thành viên");
    } else {
      Alert.alert("Thông báo", "Người dùng đã có trong danh sách");
    }
  } else {
    Alert.alert("Không tìm thấy", res?.message || "Email không tồn tại");
  }
  setSearchEmail("");
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

 const handleConfirmAdd = async () => {
  if (!selectedIds.length) {
    Alert.alert("Thông báo", "Vui lòng chọn ít nhất 1 thành viên");
    return;
  }

  console.log("📋 Danh sách userId được chọn:", selectedIds);
  console.log("🔑 GroupId sử dụng:", groupId);

  const isValidUuid =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
      groupId
    );
  if (!isValidUuid) {
    Alert.alert("Lỗi", "GroupId không hợp lệ. Vui lòng kiểm tra lại.");
    return;
  }

 try {
  const currentUser = await getUser();
  const senderId = currentUser?.userId;
  if (!senderId) {
    Alert.alert("Lỗi", "Không tìm thấy thông tin người dùng hiện tại");
    return;
  }

  const addedUsers = [];
  const alreadyInGroup = [];
  const failedUsers = [];

  for (const userId of selectedIds) {
    const payload = { senderId, groupId, userId };
    console.log("📦 Payload gửi lên add-members:", JSON.stringify(payload, null, 2));

    const res = await groupService.addMembers(payload);

    if (!res.success) {
      const msg = res.error?.response?.data?.message || res.error?.message || "";
      if (msg.includes("Thành viên đã có trong nhóm")) {
        alreadyInGroup.push(userId);
      } else {
        failedUsers.push({ userId, msg });
      }
      continue;
    }

    addedUsers.push(userId);
  }

  // ✅ Tổng hợp kết quả cuối cùng
  if (addedUsers.length > 0) {
    let message = `✅ Đã thêm ${addedUsers.length} thành viên mới vào nhóm.`;
    if (alreadyInGroup.length > 0)
      message += `\n⚠️ ${alreadyInGroup.length} thành viên đã có sẵn trong nhóm.`;
    if (failedUsers.length > 0)
      message += `\n❌ ${failedUsers.length} thành viên thêm thất bại.`;
    Alert.alert("Kết quả", message);
    router.back();
  } else if (alreadyInGroup.length > 0) {
    Alert.alert("Thông báo", "Tất cả thành viên được chọn đều đã có trong nhóm");
  } else {
    Alert.alert("Lỗi", "Không thể thêm thành viên nào");
  }
} catch (error) {
  console.error("❌ Lỗi thêm member:", {
    status: error.response?.status,
    data: error.response?.data,
    message: error.message,
  });
  Alert.alert("Lỗi", "Không thể thêm thành viên");
}

};



  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thêm thành viên</Text>
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

      {/* Nút xác nhận */}
      <TouchableOpacity style={styles.sendButton} onPress={handleConfirmAdd}>
        <Ionicons name="send" size={26} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

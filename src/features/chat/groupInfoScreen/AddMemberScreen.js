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
    const res = await findUserByEmail(searchEmail);
    if (res.success && res.userId) {
      const newUser = {
        id: res.userId,
        name: res.name,
        email: res.email,
        avatar: res.avatar,
        time: "Vừa thêm",
      };
      // check trùng
      if (!contacts.find((c) => c.id === newUser.id)) {
        setContacts((prev) => [...prev, newUser]);
      } else {
        Alert.alert("Thông báo", "Người dùng đã có trong danh sách");
      }
    } else {
      Alert.alert("Không tìm thấy", res.message || "Email không tồn tại");
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
  console.log("🔑 GroupId sử dụng:", groupId); // Kiểm tra groupId
  // Kiểm tra định dạng UUID cơ bản (có thể cải thiện thêm)
  const isValidUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(groupId);
  if (!isValidUuid) {
    Alert.alert("Lỗi", "GroupId không hợp lệ. Vui lòng kiểm tra lại.");
    return;
  }
  try {
    for (const userId of selectedIds) {
      const payload = { groupId, userId };
      console.log("📦 Payload gửi lên add-members:", JSON.stringify(payload, null, 2));
      const res = await groupService.addMembers(payload);
      if (!res.success) {
        Alert.alert("Lỗi", `Không thể thêm user ${userId}: ${res.error?.message || "Không rõ lý do"}`);
        return;
      }
    }
    Alert.alert("Thành công", "Đã thêm thành viên vào nhóm");
    router.back();
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

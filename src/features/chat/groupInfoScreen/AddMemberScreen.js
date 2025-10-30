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
import { router, useLocalSearchParams } from "expo-router";
import styles from "../createGroupScreen/CreateGroupScreen.styles";
import { findUserByEmail } from "../../../services/authService";
import { groupService } from "../../../services/groupService";
import { getUser } from "../../../services/storageService";

export default function AddMemberScreen() {
  const { groupId } = useLocalSearchParams();
  const [selectedIds, setSelectedIds] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [currentMembers, setCurrentMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load user + thành viên nhóm
  useEffect(() => {
    const loadData = async () => {
      try {
        const user = await getUser();
        setCurrentUser(user);

        const res = await groupService.viewMembers(groupId);
        if (res.success && res.data?.data) {
          setCurrentMembers(res.data.data);
        }
      } catch (err) {
        console.error("Lỗi load dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [groupId]);

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
      const existsInGroup = currentMembers.some((m) => m.userId === res.userId);
      if (existsInGroup) {
        Alert.alert("Thông báo", "Người này đã ở trong nhóm");
        setSearchEmail("");
        return;
      }

      const existsInList = contacts.some((c) => c.id === res.userId);
      if (existsInList) {
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
        Alert.alert("Thành công", "Đã tìm thấy thành viên");
        setSearchEmail("");
      }
    } else {
      Alert.alert("Không tìm thấy", res?.message || "Email không tồn tại");
      setSearchEmail("");
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

  const handleConfirmAdd = async () => {
    if (!selectedIds.length) {
      Alert.alert("Thông báo", "Vui lòng chọn ít nhất 1 thành viên");
      return;
    }

    if (currentUser?.role === "USER") {
      const maxAllowed = 3;
      const currentCount = currentMembers.length;
      if (currentCount >= maxAllowed) {
        Alert.alert(
          "Giới hạn nhóm",
          "Bạn chỉ được có tối đa 3 thành viên trong nhóm. Nâng cấp Premium để thêm nhiều hơn!",
          [
            { text: "Hủy", style: "cancel" },
            { text: "Nâng cấp", onPress: () => router.push("account/premium") },
          ]
        );
        return;
      }
      if (currentCount + selectedIds.length > maxAllowed) {
        Alert.alert(
          "Giới hạn nhóm",
          `Bạn chỉ có thể thêm tối đa ${maxAllowed - currentCount} thành viên nữa.`,
          [
            { text: "Hủy", style: "cancel" },
            { text: "Nâng cấp", onPress: () => router.push("/app/account/premium") },
          ]
        );
        return;
      }
    }

    const addedUsers = [];
    const alreadyInGroup = [];
    const failedUsers = [];

    for (const userId of selectedIds) {
      const payload = { senderId: currentUser.userId, groupId, userId };
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

    let message = "";
    if (addedUsers.length > 0) message += `Đã thêm ${addedUsers.length} thành viên.`;
    if (alreadyInGroup.length > 0) message += `\n${alreadyInGroup.length} thành viên đã có sẵn.`;
    if (failedUsers.length > 0) message += `\n${failedUsers.length} thêm thất bại.`;

    if (addedUsers.length > 0) {
      Alert.alert("Thành công", message, [{ text: "OK", onPress: () => router.back() }]);
    } else {
      Alert.alert("Thông báo", message || "Không thể thêm thành viên nào");
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text>Đang tải...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Thêm thành viên</Text>
          <Text style={{ color: "#fff", fontSize: 12, textAlign: "center" }}>
            {currentUser?.role === "USER"
              ? `Còn thêm: ${3 - currentMembers.length} người`
              : "Thành viên Premium"}
          </Text>
        </View>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="mail-outline" size={18} color="#888" />
        <TextInput
          placeholder="Nhập email để thêm thành viên"
          style={styles.searchInput}
          value={searchEmail}
          onChangeText={setSearchEmail}
          onSubmitEditing={handleAddByEmail}
        />
        <TouchableOpacity onPress={handleAddByEmail}>
          <Ionicons name="add-circle-outline" size={24} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      <TouchableOpacity style={styles.sendButton} onPress={handleConfirmAdd}>
        <Ionicons name="send" size={26} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import { groupService } from "../../../services/groupService";
import { getUser } from "../../../services/storageService";
import styles from "./GroupInfoScreen.styles";
import * as ImagePicker from "expo-image-picker";

export default function GroupInfoScreen() {
  const params = useLocalSearchParams();
  const groupIdParam = params?.groupId || null;
  const groupNameParam = params?.groupName || null;

  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);

  // state cho modal đổi tên
  const [renameVisible, setRenameVisible] = useState(false);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    const fetchGroup = async () => {
      setLoading(true);
      try {
        const user = await getUser();
        if (!user?.userId) {
          console.warn("⚠️ Không tìm thấy userId trong AsyncStorage");
          setLoading(false);
          return;
        }
        const userId = user.userId;

        const result = await groupService.getGroups(userId);
        if (result.success && Array.isArray(result.data?.data)) {
          const groups = result.data.data;
          let selected = null;

          if (groupIdParam) {
            selected = groups.find((g) => g.groupId === groupIdParam);
          }
          if (!selected) {
            selected =
              groups.find((g) => g.name === "group") ||
              groups.find((g) => g.createdBy === userId) ||
              groups[0] ||
              null;
          }
          setGroup(selected);
        } else {
          setGroup(null);
        }
      } catch (error) {
        console.log("❌ Lỗi khi fetchGroups:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroup();
  }, [groupIdParam]);

  // Hàm đổi tên nhóm
  const handleRenameGroup = async () => {
    const maxLength = 30;

    if (!newName.trim()) {
      Alert.alert("Lỗi", "Tên nhóm không được để trống");
      return;
    }
    if (newName.length > maxLength) {
      Alert.alert("Lỗi", `Tên nhóm không được vượt quá ${maxLength} ký tự`);
      return;
    }

    try {
      const payload = {
        groupId: group.groupId,
        groupName: newName,
        description: group.description || "",
      };
      const res = await groupService.updateGroupInfo(payload);
      if (res.success) {
        Alert.alert("Thành công", "Đổi tên nhóm thành công");
        setGroup({ ...group, name: newName });
        setRenameVisible(false);
      } else {
        Alert.alert("Lỗi", res.error?.message || "Không thể đổi tên nhóm");
      }
    } catch (err) {
      Alert.alert("Lỗi", err.message || "Có lỗi xảy ra");
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator
          size="large"
          color="#2ECC71"
          style={{ flex: 1, justifyContent: "center" }}
        />
      </SafeAreaView>
    );
  }

  if (!group) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={{ textAlign: "center", marginTop: 20, color: "#fff" }}>
          Không tìm thấy nhóm
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Tùy chọn</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Group Info */}
        <View style={styles.groupHeader}>
          <Image
            source={{
              uri:
                group.avatarUrl ||
                "https://randomuser.me/api/portraits/women/2.jpg",
            }}
            style={styles.avatar}
          />
          <Text style={styles.groupName}>{group?.name || groupNameParam}</Text>
          <TouchableOpacity
            onPress={() => {
              setNewName(group?.name || "");
              setRenameVisible(true);
            }}
          >
            <Ionicons name="pencil" size={16} color="#2ECC71" />
          </TouchableOpacity>
        </View>

        {/* Action Rows */}
        <View style={styles.actionRow}>
          <View style={styles.actionItem}>
  <TouchableOpacity
    style={styles.iconCircle}
    onPress={() =>
      router.push({
        pathname: "/chat/[id]",
        params: { id: group.groupId, searchMode: true },
      })
    }
  >
    <Ionicons name="search" size={24} color="#444" />
  </TouchableOpacity>
  <Text style={styles.actionText}>Tìm tin nhắn</Text>
</View>


          <View style={styles.actionItem}>
            <TouchableOpacity
              style={styles.iconCircle}
              onPress={() =>
                router.push({
                  pathname: "/chat/add-member",
                  params: { groupId: group.groupId },
                })
              }
            >
              <Ionicons name="person-add" size={24} color="#444" />
            </TouchableOpacity>
            <Text style={styles.actionText}>Thêm thành viên</Text>
          </View>
          <View style={styles.actionItem}>
            <TouchableOpacity
              style={styles.iconCircle}
              onPress={async () => {
                // Mở picker chọn ảnh
                const result = await ImagePicker.launchImageLibraryAsync({
                  mediaTypes: ImagePicker.MediaTypeOptions.Images,
                  allowsEditing: true,
                  aspect: [1, 1],
                  quality: 0.8,
                });

                if (!result.canceled) {
                  const fileUri = result.assets[0].uri;
                  console.log("📷 File URI:", fileUri);

                  try {
                    const res = await groupService.updateGroupAvatar(
                      group.groupId,
                      fileUri
                    );
                    if (res.success) {
                      Alert.alert("Thành công", "Đổi ảnh nhóm thành công");
                      setGroup({ ...group, avatarUrl: fileUri }); // update UI
                    } else {
                      Alert.alert("Lỗi", "Không thể đổi ảnh nhóm");
                    }
                  } catch (err) {
                    Alert.alert(
                      "Lỗi",
                      err.message || "Có lỗi xảy ra khi đổi ảnh nhóm"
                    );
                  }
                }
              }}
            >
              <Ionicons name="image" size={24} color="#444" />
            </TouchableOpacity>
            <Text style={styles.actionText}>Đổi ảnh nhóm</Text>
          </View>
        </View>

        {/* Các option khác */}
        <TouchableOpacity
          style={styles.option}
          onPress={() =>
            router.push({
              pathname: "/chat/view-members",
              params: { groupId: group.groupId },
            })
          }
        >
          <Ionicons name="people" size={20} color="#666" />
          <Text style={styles.optionText}>Xem thành viên</Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color="#ccc"
            style={styles.arrow}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          onPress={() => router.push("/chat/group-qr")}
        >
          <Ionicons name="qr-code" size={20} color="#666" />
          <Text style={styles.optionText}>Mã QR & Link Nhóm</Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color="#ccc"
            style={styles.arrow}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, { marginTop: 20 }]}
          onPress={async () => {
            Alert.alert(
              "Rời khỏi nhóm",
              "Bạn có chắc muốn rời khỏi nhóm này?",
              [
                { text: "Hủy", style: "cancel" },
                {
                  text: "Rời nhóm",
                  style: "destructive",
                  onPress: async () => {
                    try {
                      const user = await getUser();
                      if (!user?.userId || !group?.groupId) return;

                      const res = await groupService.leaveGroup(
                        group.groupId,
                        user.userId
                      );
                      if (res.success) {
                        Alert.alert("Thông báo", "Bạn đã rời nhóm thành công");
                        router.replace("/(tabs)/chat");
                      } else {
                        Alert.alert(
                          "Lỗi",
                          "Không thể rời nhóm, vui lòng thử lại"
                        );
                      }
                    } catch (err) {
                      Alert.alert("Lỗi", err.message || "Có lỗi xảy ra");
                    }
                  },
                },
              ]
            );
          }}
        >
          <Ionicons name="exit" size={20} color="red" />
          <Text style={[styles.optionText, { color: "red" }]}>
            Rời khỏi nhóm
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal đổi tên nhóm */}
      <Modal transparent visible={renameVisible} animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 10,
              width: "100%",
              padding: 20,
            }}
          >
            <Text style={{ fontSize: 16, marginBottom: 10 }}>Đổi tên nhóm</Text>
            <TextInput
              value={newName}
              onChangeText={setNewName}
              placeholder="Nhập tên mới"
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 8,
                padding: 10,
                marginBottom: 15,
              }}
            />
            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <TouchableOpacity
                onPress={() => setRenameVisible(false)}
                style={{ marginRight: 15 }}
              >
                <Text style={{ color: "red" }}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleRenameGroup}>
                <Text style={{ color: "#2ECC71", fontWeight: "bold" }}>
                  Lưu
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

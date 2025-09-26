import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import { groupService } from "../../../services/groupService";
import { getUser } from "../../../services/storageService";
import styles from "./GroupInfoScreen.styles";
import { Alert } from "react-native";

export default function GroupInfoScreen() {
  // Lấy params truyền vào (nếu có)
  const params = useLocalSearchParams();
  const groupIdParam = params?.groupId || null; // param tên groupId
  const groupNameParam = params?.groupName || null; // optional: truyền tên để hiển thị nhanh

  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);

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
        console.log("🔑 UserId từ AsyncStorage:", userId);

        // Gọi API lấy danh sách nhóm (hiện groupService chưa có getById nên lấy list rồi find)
        const result = await groupService.getGroups(userId);
        console.log(
          "📋 Kết quả từ getGroups:",
          JSON.stringify(result, null, 2)
        );

        if (result.success && result.data && Array.isArray(result.data.data)) {
          const groups = result.data.data;
          console.log(
            "📋 Danh sách nhóm:",
            groups.map((g) => ({
              groupId: g.groupId,
              name: g.name,
              createdBy: g.createdBy,
            }))
          );

          // Nếu có param groupId => tìm đúng nhóm đó
          if (groupIdParam) {
            const found = groups.find((g) => g.groupId === groupIdParam);
            if (found) {
              setGroup(found);
              console.log("🔑 GroupId từ params, chọn:", found.groupId);
              setLoading(false);
              return;
            } else {
              console.warn(
                "⚠️ Không tìm thấy groupId trong danh sách, sẽ fallback"
              );
            }
          }

          // Nếu không có params hoặc không tìm thấy => giữ logic cũ (ưu tiên name === "group" hoặc createdBy)
          const currentGroup =
            groups.find((g) => g.name === "group") ||
            groups.find((g) => g.createdBy === userId) ||
            groups[0] ||
            null;

          if (currentGroup) {
            setGroup(currentGroup);
            console.log(
              "🔑 GroupId được chọn (fallback):",
              currentGroup.groupId
            );
          } else {
            console.log("⚠️ Không có nhóm nào trong danh sách");
            setGroup(null);
          }
        } else {
          console.log("❌ Dữ liệu từ API không hợp lệ hoặc không thành công:", {
            success: result.success,
            data: result.data,
            error: result.error,
          });
        }
      } catch (error) {
        console.log("❌ Lỗi khi fetchGroups:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroup();
  }, [groupIdParam]);

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
    // Nếu không có group nhưng có truyền groupNameParam thì hiển thị tạm groupNameParam
    if (groupNameParam) {
      return (
        <SafeAreaView style={styles.safeArea}>
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
            <View style={styles.groupHeader}>
              <Image
                source={{
                  uri: "https://randomuser.me/api/portraits/women/2.jpg",
                }}
                style={styles.avatar}
              />
              <Text style={styles.groupName}>{groupNameParam}</Text>
              <TouchableOpacity>
                <Ionicons name="pencil" size={16} color="#2ECC71" />
              </TouchableOpacity>
            </View>

            <Text style={{ color: "#fff", textAlign: "center", marginTop: 20 }}>
              Không tải được chi tiết nhóm, hiển thị tên tạm thời.
            </Text>
          </ScrollView>
        </SafeAreaView>
      );
    }

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
        <View style={styles.groupHeader}>
          <Image
            source={{
              uri:
                group.avatarUrl ||
                "https://randomuser.me/api/portraits/women/2.jpg",
            }}
            style={styles.avatar}
          />
          {/* Hiển thị group.name nếu có, nếu chưa có dùng tạm groupNameParam */}
          <Text style={styles.groupName}>{group?.name || groupNameParam}</Text>
          <TouchableOpacity>
            <Ionicons name="pencil" size={16} color="#2ECC71" />
          </TouchableOpacity>
        </View>

        <View style={styles.actionRow}>
          <View style={styles.actionItem}>
            <View style={styles.iconCircle}>
              <Ionicons name="search" size={24} color="#444" />
            </View>
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
            <View style={styles.iconCircle}>
              <Ionicons name="image" size={24} color="#444" />
            </View>
            <Text style={styles.actionText}>Đổi hình nền</Text>
          </View>
          <View style={styles.actionItem}>
            <View style={styles.iconCircle}>
              <Ionicons name="notifications-off" size={24} color="#444" />
            </View>
            <Text style={styles.actionText}>Tắt thông báo</Text>
          </View>
        </View>

        <View style={styles.photoBlock}>
          <TouchableOpacity style={styles.photoHeader}>
            <Ionicons name="images" size={20} color="#666" />
            <Text style={styles.optionText}>Ảnh & video</Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color="#ccc"
              style={styles.arrow}
            />
          </TouchableOpacity>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.photoRow}
          >
            <Image
              source={{ uri: "https://picsum.photos/200" }}
              style={styles.photo}
            />
            <Image
              source={{ uri: "https://picsum.photos/201" }}
              style={styles.photo}
            />
            <Image
              source={{ uri: "https://picsum.photos/202" }}
              style={styles.photo}
            />
            <Image
              source={{ uri: "https://picsum.photos/203" }}
              style={styles.photo}
            />
          </ScrollView>
        </View>

        <TouchableOpacity style={styles.option}>
          <Ionicons name="people" size={20} color="#666" />
          <Text style={styles.optionText}>Xem thành viên</Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color="#ccc"
            style={styles.arrow}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Ionicons name="person-add-outline" size={20} color="#666" />
          <Text style={styles.optionText}>Duyệt thành viên mới</Text>
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

        <TouchableOpacity style={styles.option}>
          <Ionicons name="alert-circle" size={20} color="#666" />
          <Text style={styles.optionText}>Báo Cáo</Text>
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
    </SafeAreaView>
  );
}

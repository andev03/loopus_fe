import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView as RNSSafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import AvatarDropdown from "../../components/AvatarDropdown";
import { storyService } from "../../services/storyService"; 
import styles from "./PostScreen.styles";

export default function PostScreen() {
 const { uri, text, groupId, groupName, albumId } = useLocalSearchParams();

  const [loading, setLoading] = useState(false);
  const [posted, setPosted] = useState(false);

  useEffect(() => {
    if (uri && !posted) {
      console.log("📸 [DEBUG] Ảnh URI nhận được từ PreviewScreen:", uri);
      handleCreateStory();
    } else {
      console.log("⚠️ [DEBUG] Không có URI hoặc story đã được đăng");
    }
  }, [uri]);

  const handleCreateStory = async () => {
  try {
    setLoading(true);

    const file = {
      uri,
      type: "image/jpeg",
      name: "story.jpg",
    };

    const visibilityType = groupId ? "group" : "followers";

    console.log("📤 [DEBUG] Dữ liệu gửi đi:", {
      caption: text,
      visibilityType,
      albumId,
      groupId,
      uri,
    });

    const res = await storyService.createStory(
      file,
      text || "",
      visibilityType,
      albumId || "" // ✅ lấy đúng albumId từ PreviewScreen
    );

    console.log("✅ [DEBUG] Story tạo thành công:", res);
    setPosted(true);
    Alert.alert("Thành công", "Story đã được đăng!");
  } catch (error) {
    console.error("❌ [DEBUG] Lỗi đăng story:", error);
    Alert.alert("Lỗi", error.message || "Không thể tạo story");
  } finally {
    setLoading(false);
  }
};

  return (
    <RNSSafeAreaView style={styles.container} edges={["top", "bottom"]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.left}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => router.back()}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="close" size={22} color="#000" />
          </TouchableOpacity>

          <Text style={styles.timeText}>
            {posted ? "Vừa đăng xong" : loading ? "Đang đăng..." : "1 phút trước"}
          </Text>
        </View>

        <View style={styles.right}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="albums-outline" size={22} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="camera-outline" size={22} color="#000" />
          </TouchableOpacity>

          <AvatarDropdown mainAvatar="https://randomuser.me/api/portraits/men/75.jpg" />
        </View>
      </View>

      {/* Nội dung chính */}
      <View style={styles.imageWrap}>
        {uri ? (
          <>
            <Image source={{ uri }} style={styles.image} resizeMode="cover" />

            {loading && (
              <ActivityIndicator
                size="large"
                color="#fff"
                style={{ position: "absolute", alignSelf: "center", top: "50%" }}
              />
            )}

            {text ? (
              <View style={styles.overlay}>
                <Text style={styles.statusText}>{text}</Text>
              </View>
            ) : null}
          </>
        ) : (
          <View style={styles.placeholder}>
            <Text>Không có ảnh</Text>
          </View>
        )}
      </View>
    </RNSSafeAreaView>
  );
}

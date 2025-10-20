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
// import { storyService } from "../../services/storyService";
import { createStory } from "../../services/storyService";
import { getUserId } from "../../services/storageService";
import { getGroup } from "../../services/groupService";
import styles from "./PostScreen.styles";

export default function PostScreen() {
  const { uri, text, groupId, groupName, albumId } = useLocalSearchParams();

  const [loading, setLoading] = useState(false);
  const [posted, setPosted] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [resolvedAlbumId, setResolvedAlbumId] = useState(albumId || null);

  // Get userId from AsyncStorage
  useEffect(() => {
    (async () => {
      const uid = await getUserId();
      setCurrentUserId(uid);
    })();
  }, []);

  // Resolve albumId from group if missing (skip if endpoint 404/500)
  useEffect(() => {
    (async () => {
      if (!resolvedAlbumId && groupId) {
        try {
          const g = await getGroup(groupId); // if this 500s, we just skip
          const aId =
            g?.albumId ||
            g?.album?.id ||
            g?.data?.album?.id ||
            g?.data?.albumId ||
            null;
          if (aId) setResolvedAlbumId(String(aId));
        } catch (e) {
          // Silently skip; albumId is optional for upload when groupId is sent
          console.log("⚠️ Bỏ qua lấy albumId:", e?.message);
        }
      }
    })();
  }, [groupId, resolvedAlbumId]);

  useEffect(() => {
    if (uri && currentUserId && !posted) {
      console.log("📸 [DEBUG] URI:", uri);
      handleCreateStory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uri, currentUserId]);

  const handleCreateStory = async () => {
    try {
      if (!currentUserId) {
        Alert.alert("Thiếu thông tin", "Không tìm thấy userId để tạo story.");
        return;
      }
      if (!uri) {
        Alert.alert("Thiếu ảnh/video", "Vui lòng chọn file hợp lệ.");
        return;
      }

      setLoading(true);

      const file = { uri };
      const visibilityType = groupId ? "group" : "followers";

      const request = {
        userId: String(currentUserId),
        caption: text || "",
        visibilityType,
        albumId: resolvedAlbumId || undefined,
        groupId: groupId ? String(groupId) : undefined,
      };

      console.log("📤 [DEBUG] Payload:", { request });
      console.log("📤 [DEBUG] File:", file);

      const res = await createStory({ request, file });

      console.log("✅ Story tạo thành công:", res);
      setPosted(true);
      Alert.alert("Thành công", "Story đã được đăng!");

      // Navigate back to the group flow (fallback: one step back)
      if (groupId) {
        // Adjust to your route that lists group stories
        // router.replace({ pathname: "/group/story", params: { groupId } })
        router.back();
      } else {
        router.back();
      }
    } catch (error) {
      console.error("❌ Lỗi đăng story:", error?.response?.data || error.message);
      Alert.alert("Lỗi", error?.response?.data?.message || error.message || "Không thể tạo story");
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

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  Alert,
  Modal,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import { useStatusStore } from "../../store/useStatusStore";
import { albumService } from "../../services/albumService";
import { getUserId } from "../../services/storageService";
import styles from "./PreviewScreen.styles";
import { saveAlbumForGroup, getAlbumForGroup } from "../../store/albumStorage";


export default function PreviewScreen() {
  const params = useLocalSearchParams();
  const uri = params?.uri;
  const groupId = params?.groupId;
  const groupName = params?.groupName;

  const [albumId, setAlbumId] = useState(null);
  const [albumName, setAlbumName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingAlbum, setLoadingAlbum] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [text, setText] = useState("");
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (!uri) Alert.alert("Lỗi", "Không có ảnh để hiển thị");
  }, [params]);

  // 🔄 Fetch album from API instead of AsyncStorage
  useEffect(() => {
    const fetchAlbum = async () => {
      if (!groupId) return;

      try {
        setLoadingAlbum(true);
        const res = await albumService.getAlbumsByGroup(groupId);

        if (res.success && res.data) {
          const albums = res.data.data || res.data;
          // Get the first album or most recent one
          if (albums && albums.length > 0) {
            const album = albums[0];
            setAlbumId(album.albumId);
            setAlbumName(album.name);
            console.log("📦 Đã lấy album từ API:", album);
          }
        }
      } catch (error) {
        console.error("❌ Lỗi lấy album:", error);
      } finally {
        setLoadingAlbum(false);
      }
    };

    fetchAlbum();
  }, [groupId]);

  // 🟢 Khi nhấn tạo album
  const handleAlbumPress = async () => {
    if (loadingAlbum) return;
    if (!albumId) {
      setModalVisible(true);
    } else {
      router.push({
        pathname: "/group/album-screen",
        params: { albumId, albumName, groupId },
      });
    }
  };

  // 🟢 Xác nhận tạo album
  const confirmCreateAlbum = async () => {
    try {
      if (!albumName.trim()) {
        Alert.alert("⚠️ Nhập tên album trước khi tạo!");
        return;
      }

      setLoadingAlbum(true);
      setModalVisible(false);

      const userId = await getUserId();
      if (!userId || !groupId) {
        Alert.alert("Lỗi", "Thiếu thông tin user hoặc group");
        return;
      }

      const newAlbum = {
        groupId,
        name: albumName.trim(),
        createdBy: userId,
      };

      const res = await albumService.createAlbum(newAlbum);
      console.log("📦 Kết quả tạo album:", res);

      if (res.success) {
        const createdAlbum = res.data?.data || res.data;
        const newAlbumId = createdAlbum?.albumId;

        if (!newAlbumId) {
          Alert.alert("❌ Lỗi", "Không lấy được albumId từ server!");
          return;
        }

        setAlbumId(newAlbumId);
        setAlbumName(albumName);
        Alert.alert("🎉 Thành công", "Đã tạo album mới!");

        router.push({
          pathname: "/group/album-screen",
          params: { albumId: newAlbumId, albumName, groupId },
        });
      } else {
        Alert.alert("❌ Lỗi", res.error?.message || "Không tạo được album");
      }
    } catch (err) {
      console.error("❌ Lỗi khi tạo album:", err);
      Alert.alert("Lỗi", err.message || "Không thể tạo album");
    } finally {
      setLoadingAlbum(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color="#000" />
        </TouchableOpacity>

        <View style={styles.headerRight}>
          <Text style={{ fontWeight: "bold", marginRight: 10 }}>
            {groupName || "Preview"}
          </Text>

          {/* 🟢 Nút Album */}
          <TouchableOpacity style={styles.iconBtn} onPress={handleAlbumPress}>
            {loadingAlbum ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <Ionicons name="albums-outline" size={24} color="#000" />
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="camera-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Image */}
      <View style={styles.imageWrap}>
        {uri ? (
          <>
            {imageLoading && (
              <ActivityIndicator size="large" color="#fff" style={StyleSheet.absoluteFill} />
            )}
            <Image
              source={{ uri }}
              style={styles.image}
              resizeMode="contain"
              onLoadStart={() => setImageLoading(true)}
              onLoadEnd={() => setImageLoading(false)}
              onError={() => {
                setImageLoading(false);
                setImageError(true);
              }}
            />
            {imageError && (
              <Text style={{ color: "red", position: "absolute" }}>Lỗi load ảnh!</Text>
            )}
          </>
        ) : (
          <View style={styles.placeholder}>
            <Text style={{ color: "#fff" }}>Không có ảnh</Text>
          </View>
        )}

        {text !== "" && !isTyping && <Text style={styles.overlayText}>{text}</Text>}

        {isTyping && (
          <TextInput
            style={styles.input}
            placeholder="Nhập chữ..."
            placeholderTextColor="#ccc"
            value={text}
            onChangeText={setText}
            autoFocus
            multiline
            onSubmitEditing={() => setIsTyping(false)}
          />
        )}
      </View>

      {/* 🟣 Bottom bar — Đăng story */}
      <View style={styles.bottomBar}>
        <View style={styles.leftGroup}>
          <TouchableOpacity
            style={[styles.toolBtn, styles.toolBtnLarge]}
            onPress={() => setIsTyping(true)}
          >
            <Text style={styles.toolText}>Aa</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toolBtn, styles.toolBtnSmall, { marginLeft: 12 }]}
          >
            <Ionicons name="happy-outline" size={22} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toolBtn, styles.toolBtnSmall, { marginLeft: 12 }]}
          >
            <Ionicons name="create-outline" size={22} color="#000" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.sendBtn}
          onPress={() => {
            // 🧠 (Tuỳ chọn) lưu tạm vào Zustand để hiển thị story local
            useStatusStore.getState().addStatus({
              userId: "me",
              id: Date.now().toString(),
              text,
              uri,
              groupId,
            });

            // 📤 Gửi sang PostScreen
            router.push({
              pathname: "/group/post-screen",
              params: {
                uri,
                text,
                groupId,
                groupName,
                albumId: albumId || "", // ✅ thêm dòng này
              },
            });
          }}
        >
          <Ionicons name="arrow-forward" size={24} color="#fff" />
        </TouchableOpacity>

      </View>

      {/* Nhập tên album (modal) */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Đặt tên album</Text>
            <TextInput
              placeholder="Ví dụ: Sinh nhật nhóm 🌸"
              value={albumName}
              onChangeText={setAlbumName}
              style={styles.modalInput}
            />
            <View style={styles.modalRow}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalCancel}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={confirmCreateAlbum}>
                <Text style={styles.modalConfirm}>Tạo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}



import React, { useState, useRef, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet, Text, Image, Alert } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import AvatarDropdown from "../../components/AvatarDropdown";
import { getGroup } from "../../services/groupService"; // ✅ Import to get album info
import { saveAlbumForGroup, getAlbumForGroup } from "../../store/albumStorage";
import { albumService } from "../../services/albumService"; // ✅ Import albumService


export default function GroupCameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState("back");
  const cameraRef = useRef(null);

  // ✅ Add state for album info
  const [albumInfo, setAlbumInfo] = useState(null);
  const [loadingAlbum, setLoadingAlbum] = useState(false);

  const params = useLocalSearchParams();

  useEffect(() => {
    console.log("📥 Nhận params ở /group/camera:", params);
  }, [params]);

  // 🔄 Fetch album from API
  useEffect(() => {
    const fetchGroupAlbum = async () => {
      if (!params.groupId) return;

      try {
        setLoadingAlbum(true);

        const res = await albumService.getAlbumsByGroup(params.groupId);

        if (res.success && res.data) {
          const albums = res.data.data || res.data;
          // Get the first album
          if (albums && albums.length > 0) {
            const album = albums[0];
            setAlbumInfo({
              albumId: album.albumId,
              albumName: album.name
            });
            console.log("📦 Đã lấy album từ API:", album);
          }
        }
      } catch (error) {
        console.error("❌ Error fetching group album:", error);
      } finally {
        setLoadingAlbum(false);
      }
    };

    fetchGroupAlbum();
  }, [params.groupId]);

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text>Ứng dụng cần quyền truy cập camera</Text>
        <TouchableOpacity onPress={requestPermission}>
          <Text style={{ color: "#2ECC71", marginTop: 8 }}>Cấp quyền</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePhoto = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 1,
          base64: false,
          exif: false,
          skipProcessing: false,
        });
        console.log("Ảnh chụp được:", photo.uri);

        router.push({
          pathname: "/group/preview",
          params: {
            uri: photo.uri,
            groupId: params.groupId,
            groupName: params.groupName,
            avatarUrl: params.avatarUrl,
          },
        });
      } catch (err) {
        console.error("Lỗi chụp ảnh:", err);
        Alert.alert("Lỗi", "Không thể chụp ảnh");
      }
    }
  };

  // ✅ Handle view album
  const handleViewAlbum = () => {
    if (!albumInfo?.albumId) {
      Alert.alert("Thông báo", "Nhóm này chưa có album");
      return;
    }

    console.log("🔗 Navigating to album:", albumInfo);

    router.push({
      pathname: "/group/album-screen",
      params: {
        albumId: String(albumInfo.albumId),
        groupId: String(params.groupId || ''),
        albumName: albumInfo.albumName || "Album nhóm",
      },
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#A8F0C4" }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/(tabs)/home")}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>

        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
          {params.groupName || "Camera Nhóm"}
        </Text>

        {/* ✅ Album button on camera (top right, below flash) */}
        {/* {albumInfo && (
          <TouchableOpacity
            style={styles.albumBtn}
            onPress={handleViewAlbum}
          >
            <View style={styles.albumBtnContent}>
              <Ionicons name="images" size={20} color="#fff" />
              <Text style={styles.albumBtnText}>Album</Text>
            </View>
          </TouchableOpacity>
        )} */}

        {/* ✅ Album button */}
        <TouchableOpacity
          onPress={handleViewAlbum}
          disabled={loadingAlbum || !albumInfo}
          style={{ opacity: loadingAlbum || !albumInfo ? 0.5 : 1 }}
        >
          <Ionicons
            name="albums-outline"
            size={26}
            color={albumInfo ? "#000" : "#ccc"}
          />
        </TouchableOpacity>
      </View>

      {/* Camera View */}
      <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
        {/* Flash button góc trên phải */}
        <TouchableOpacity style={styles.flashBtn}>
          <Ionicons name="flash-outline" size={28} color="#fff" />
        </TouchableOpacity>

        {/* 📸 Guide text overlay */}
        <View style={styles.guideContainer}>
          <Text style={styles.guideText}>
            Nhấn nút chụp để bắt đầu đăng Story 📷
          </Text>
        </View>

        {/* Nút thư viện ảnh (góc dưới trái) */}
        <TouchableOpacity style={styles.bottomLeft}>
          <Ionicons name="images-outline" size={36} color="#fff" />
        </TouchableOpacity>

        {/* Nút chụp ảnh ở giữa */}
        <View style={styles.bottomCenter}>
          <TouchableOpacity style={styles.captureBtn} onPress={takePhoto}>
            <View style={styles.innerCircle} />
          </TouchableOpacity>
        </View>

        {/* Nút đổi camera (góc dưới phải) */}
        <TouchableOpacity
          style={styles.bottomRight}
          onPress={() =>
            setFacing((prev) => (prev === "back" ? "front" : "back"))
          }
        >
          <Ionicons name="camera-reverse-outline" size={36} color="#fff" />
        </TouchableOpacity>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 10,
    backgroundColor: "#A8F0C4",
    zIndex: 1,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  camera: {
    flex: 1,
    borderRadius: 20,
    marginHorizontal: 10,
    overflow: "hidden",
  },
  flashBtn: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  // ✅ New album button style
  albumBtn: {
    position: "absolute",
    top: 70,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  albumBtnContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  albumBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  bottomLeft: {
    position: "absolute",
    bottom: 40,
    left: 30,
  },
  bottomCenter: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
  },
  captureBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 6,
    borderColor: "#2ECC71",
    alignItems: "center",
    justifyContent: "center",
  },
  innerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff",
  },
  bottomRight: {
    position: "absolute",
    bottom: 40,
    right: 30,
  },
  plusBtn: {
    alignSelf: "center",
    marginVertical: 10,
    backgroundColor: "#2ECC71",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  guideContainer: {
    position: "absolute",
    top: "45%",
    alignSelf: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    height: 60,
    justifyContent: "center",
  },
  guideText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },

});
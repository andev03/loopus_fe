import React, { useState, useRef } from "react";
import { View, TouchableOpacity, StyleSheet, Text, Image } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import AvatarDropdown from "../../components/AvatarDropdown";

export default function GroupCameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState("back");
  const cameraRef = useRef(null); // 👈 thêm ref

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

  // 👇 hàm chụp và chuyển sang preview
  const takePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      router.push({
        pathname: "/group/preview",
        params: { uri: photo.uri },
      });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#A8F0C4" }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/(tabs)/home")}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>

        {/* AvatarDropdown thay vì Image */}
        <AvatarDropdown mainAvatar="https://randomuser.me/api/portraits/men/1.jpg" />
      </View>

      {/* Camera View */}
      <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
        {/* Flash button góc trên phải */}
        <TouchableOpacity style={styles.flashBtn}>
          <Ionicons name="flash-outline" size={28} color="#fff" />
        </TouchableOpacity>

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

      {/* Nút +2 dưới cùng */}
      <TouchableOpacity style={styles.plusBtn}>
        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "600" }}>
          +2
        </Text>
      </TouchableOpacity>
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
    paddingTop: 40, // để tránh notch
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
});

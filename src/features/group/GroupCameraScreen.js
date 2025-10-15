import React, { useState, useRef, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet, Text, Image } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router"; // 👈 Thêm useLocalSearchParams
import AvatarDropdown from "../../components/AvatarDropdown";

export default function GroupCameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState("back");
  const cameraRef = useRef(null); // 👈 thêm ref

  // 👈 Lấy params từ router
  const params = useLocalSearchParams();
  
  // 👈 Log params khi nhận được (khi màn hình mount hoặc params thay đổi)
  useEffect(() => {
    console.log("📥 Nhận params ở /group/camera:", params);
    // Ví dụ: Nếu cần xử lý params (như fetch data dựa trên groupId), làm ở đây
  }, [params]);

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

  // 👇 hàm chụp và chuyển sang preview (có thể truyền thêm params nếu cần)
const takePhoto = async () => {
  if (cameraRef.current) {
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1, // Chất lượng cao nhất
        base64: false, // Không cần base64, chỉ URI
        exif: false, // Tắt EXIF để nhẹ hơn
        skipProcessing: false, // Đảm bảo xử lý full
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

  return (
    <View style={{ flex: 1, backgroundColor: "#A8F0C4" }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/(tabs)/home")}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>

        {/* Ví dụ sử dụng params: Hiển thị groupName thay vì avatar cứng */}
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
          {params.groupName || "Camera Nhóm"}
        </Text>

        {/* Nếu vẫn muốn AvatarDropdown, truyền avatarUrl từ params nếu có */}
        {/* <AvatarDropdown mainAvatar={params.avatarUrl || "https://randomuser.me/api/portraits/men/1.jpg"} /> */}
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
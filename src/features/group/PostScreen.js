import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView as RNSSafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import AvatarDropdown from "../../components/AvatarDropdown";

export default function PostScreen() {
  const { uri, text } = useLocalSearchParams();

  return (
    <RNSSafeAreaView style={styles.container} edges={["top", "bottom"]}>
      {/* Header: X ở trái + time, 2 icon + avatarDropdown ở phải */}
      <View style={styles.header}>
        <View style={styles.left}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => router.back()}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="close" size={22} color="#000" />
          </TouchableOpacity>

          <Text style={styles.timeText}>1 phút trước</Text>
        </View>

        <View style={styles.right}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="albums-outline" size={22} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="camera-outline" size={22} color="#000" />
          </TouchableOpacity>

          {/* AvatarDropdown nằm trong header */}
          <AvatarDropdown mainAvatar="https://randomuser.me/api/portraits/men/75.jpg" />
        </View>
      </View>

      {/* Ảnh chính */}
      <View style={styles.imageWrap}>
        {uri ? (
          <Image source={{ uri }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.placeholder} />
        )}

        {/* overlay text status */}
        {text ? (
          <View style={styles.overlay}>
            <Text style={styles.statusText}>{text}</Text>
          </View>
        ) : null}
      </View>
    </RNSSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#A8F0C4" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 8,
    zIndex: 10, // để dropdown nổi lên trên
  },

  left: { flexDirection: "row", alignItems: "center" },
  closeBtn: { paddingRight: 10 },
  timeText: { color: "#000", fontSize: 14 },

  right: { flexDirection: "row", alignItems: "center" },
  iconBtn: { paddingHorizontal: 8 },

  imageWrap: {
    flex: 1,
    marginHorizontal: 12,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  image: { width: "100%", height: "100%" },
  placeholder: { flex: 1, backgroundColor: "#000" },

  overlay: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 10,
    borderRadius: 12,
  },
  statusText: { color: "#111", fontSize: 16 },
});

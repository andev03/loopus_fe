// app/components/StatusViewer.js
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView as RNSSafeAreaView } from "react-native-safe-area-context";
import AvatarDropdown from "../../components/AvatarDropdown";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

export default function StatusViewer() {
  const router = useRouter();
  const { uri, text } = useLocalSearchParams();

  // sample comments (thay bằng data thật khi có API)
  const comments = [
    {
      id: "1",
      name: "Bảo Đại",
      text: "Ta nói nó phê....",
      avatar: "https://i.pravatar.cc/100?img=12",
    },
    {
      id: "2",
      name: "Đạt Khổng Chín",
      text: "Đà Lạt toiii iuuu",
      avatar: "https://i.pravatar.cc/100?img=5",
    },
  ];

  const imageUri = uri || "https://i.ibb.co/qmPfx1d/your-image.jpg"; 

  return (
    <RNSSafeAreaView style={styles.container} edges={["top", "bottom"]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.left}>
          <TouchableOpacity
            onPress={() => router.replace("/group/camera")}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={styles.closeBtn}
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

          <AvatarDropdown mainAvatar="https://randomuser.me/api/portraits/men/75.jpg" />
        </View>
      </View>

      {/* Main image card */}
      <View style={styles.imageWrap}>
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* top-left overlay: small avatar + name + short text */}
        <View style={styles.topOverlay}>
          <Image
            source={{ uri: "https://randomuser.me/api/portraits/women/65.jpg" }}
            style={styles.topAvatar}
          />
          <View style={{ marginLeft: 8 }}>
            <Text numberOfLines={1} style={styles.topName}>
              Thu Đào
            </Text>
            <Text numberOfLines={1} style={styles.topSubtitle}>
              {text || "Dạ tụi em tới rồi"}
            </Text>
          </View>
        </View>

        {/* chat overlay (semi-transparent panel) */}
        <View style={styles.chatOverlay}>
          {comments.map((c) => (
            <View key={c.id} style={styles.chatRow}>
              <Image source={{ uri: c.avatar }} style={styles.chatAvatar} />
              <View style={{ marginLeft: 8, flex: 1 }}>
                <Text style={styles.chatName}>{c.name}</Text>
                <Text numberOfLines={1} style={styles.chatMsg}>
                  {c.text}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Input floating at bottom (over the green background) */}
      <View style={styles.inputRow}>
        <TextInput
          placeholder="Gửi tin nhắn"
          placeholderTextColor="#7a7a7a"
          style={styles.input}
        />
        <TouchableOpacity style={styles.plusBtn}>
          <Ionicons name="add-circle-outline" size={28} color="#4b4b4b" />
        </TouchableOpacity>
      </View>
    </RNSSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#A8F0C4", // giống PostScreen pale green
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 8,
    zIndex: 20,
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
    // give a reasonable height on tall screens; on small screens it will expand
    minHeight: SCREEN_H * 0.66,
  },
  image: { width: "100%", height: "100%" },

  topOverlay: {
    position: "absolute",
    top: 14,
    left: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  topAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
  },
  topName: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  topSubtitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 12,
    marginTop: 2,
  },

  chatOverlay: {
    position: "absolute",
    bottom: 22 + 60, // leave space for inputRow
    left: 14,
    right: 14,
    backgroundColor: "rgba(0,0,0,0.45)",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  chatRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  chatAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
  },
  chatName: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  chatMsg: {
    color: "rgba(255,255,255,0.95)",
    fontSize: 13,
    marginTop: 2,
  },

  inputRow: {
    position: "absolute",
    left: 14,
    right: 14,
    bottom: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eef6ef",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 28,
    // slight shadow (iOS + Android)
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 6,
    color: "#000",
  },
  plusBtn: { marginLeft: 8 },
});

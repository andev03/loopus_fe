import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import AvatarDropdown from "../../components/AvatarDropdown";
import { useStatusStore } from "../../store/useStatusStore";

export default function PreviewScreen() {
  const params = useLocalSearchParams();
  const uri = params?.uri;

  const [isTyping, setIsTyping] = useState(false);
  const [text, setText] = useState("");

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerLeft}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={20} color="#000" />
          <Text style={styles.timeText}>1 phút trước</Text>
        </TouchableOpacity>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="albums-outline" size={24} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="camera-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Image */}
      <View style={styles.imageWrap}>
        {uri ? (
          <Image source={{ uri }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.placeholder} />
        )}

        {/* Overlay chữ nếu có */}
        {text !== "" && !isTyping && (
          <Text style={styles.overlayText}>{text}</Text>
        )}

        {/* Nếu đang nhập chữ thì hiển thị TextInput */}
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

      {/* Bottom bar */}
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

        {/* Send */}
        <TouchableOpacity
          style={styles.sendBtn}
          onPress={() => {
            // thêm vào store
            useStatusStore.getState().addStatus({
              userId: "me", 
              id: Date.now().toString(), 
              text,
              uri,
            });

            router.push({
              pathname: "/group/post-screen",
              params: { uri, text },
            });
          }}
        >
          <Ionicons name="arrow-forward" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#A8F0C4" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  timeText: { marginLeft: 8, color: "#000", fontSize: 14 },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBtn: {
    padding: 6,
    marginLeft: 16,
  },

  imageWrap: {
    flex: 1,
    marginHorizontal: 12,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  image: { width: "100%", height: "100%" },
  placeholder: { flex: 1, backgroundColor: "#000" },

  overlayText: {
    position: "absolute",
    top: "45%",
    textAlign: "center",
    color: "#fff",
    fontSize: 22,
    fontWeight: "600",
    paddingHorizontal: 10,
  },
  input: {
    position: "absolute",
    top: "45%",
    width: "80%",
    color: "#fff",
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
  },

  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#A8F0C4",
  },
  leftGroup: { flexDirection: "row", alignItems: "center" },

  toolBtn: {
    backgroundColor: "#fff",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  toolBtnLarge: { width: 56, height: 40, borderRadius: 20 },
  toolBtnSmall: { width: 48, height: 40 },

  toolText: { fontSize: 18, fontWeight: "600" },

  sendBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2ECC71",
    alignItems: "center",
    justifyContent: "center",
  },
});

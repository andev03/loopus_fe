import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import { useStatusStore } from "../../store/useStatusStore";

export default function PreviewScreen() {
  const params = useLocalSearchParams();
  const uri = params?.uri;
  const groupId = params?.groupId;
  const groupName = params?.groupName;

  useEffect(() => {
    console.log("Nhận params ở /group/preview:", params);
    if (!uri) {
      Alert.alert("Lỗi", "Không có ảnh để hiển thị");
    }
  }, [params]);

  const [isTyping, setIsTyping] = useState(false);
  const [text, setText] = useState("");
  const [imageLoading, setImageLoading] = useState(true); // Thêm loading state
  const [imageError, setImageError] = useState(false); // Thêm error state

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
          <Text style={{ fontWeight: 'bold', marginRight: 10 }}>{groupName || "Preview"}</Text>
          
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
          <>
            {imageLoading && (
              <ActivityIndicator 
                size="large" 
                color="#fff" 
                style={StyleSheet.absoluteFill} // Overlay loading
              />
            )}
            <Image 
              source={{ uri }} 
              style={styles.image} 
              resizeMode="contain" // Thay "cover" bằng "contain" để tránh crop đen, test xem
              onLoadStart={() => {
                console.log("Bắt đầu load ảnh từ URI:", uri);
                setImageLoading(true);
                setImageError(false);
              }}
              onLoadEnd={() => {
                console.log("Load ảnh xong");
                setImageLoading(false);
              }}
              onError={(err) => {
                console.error("Lỗi load ảnh:", err.nativeEvent.error);
                setImageLoading(false);
                setImageError(true);
              }}
            />
            {imageError && (
              <Text style={{ color: 'red', position: 'absolute' }}>Lỗi load ảnh!</Text>
            )}
          </>
        ) : (
          <View style={styles.placeholder}>
            <Text style={{ color: '#fff' }}>Không có ảnh</Text>
          </View>
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
            useStatusStore.getState().addStatus({
              userId: "me", 
              id: Date.now().toString(), 
              text,
              uri,
              groupId,
            });

            router.push({
              pathname: "/group/post-screen",
              params: { uri, text, groupId, groupName },
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
    backgroundColor: "#000", // Nền đen: Nếu ảnh không load, bạn thấy đen → bình thường nếu error
    alignItems: "center",
    justifyContent: "center",
    position: 'relative', // Để overlay loading
  },
  image: { 
    flex: 1, // Force full size
    width: '100%', 
    height: '100%',
    backgroundColor: 'transparent', // Tránh đen từ image itself
  },
  placeholder: { 
    flex: 1, 
    width: '100%',
    backgroundColor: "#333", 
    justifyContent: 'center',
    alignItems: 'center',
  },

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
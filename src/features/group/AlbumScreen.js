import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import { storyService } from "../../services/storyService";

export default function AlbumScreen() {
  const params = useLocalSearchParams();
  const { albumId, groupId, albumName } = params;

  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStories();
  }, [albumId]);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const res = await storyService.getStoriesByAlbum(albumId);
      setStories(res.data || res);
    } catch (err) {
      console.error("❌ Lỗi tải stories:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.imageWrapper}
      onPress={() =>
        router.push({
          pathname: "/group/story-detail",
          params: { storyId: item.id, albumId, groupId },
        })
      }
    >
      <Image source={{ uri: item.fileUrl }} style={styles.image} resizeMode="cover" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color="#000" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{albumName || "Album nhóm"}</Text>
        </View>

        <TouchableOpacity onPress={() => router.push("/group/preview")}>
          <Ionicons name="camera-outline" size={26} color="#000" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      ) : stories.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyText}>Album này chưa có ảnh nào 📷</Text>
        </View>
      ) : (
        <FlatList
          data={stories}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          numColumns={3}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.grid}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  headerCenter: { flex: 1, alignItems: "center" },
  imageWrapper: { flex: 1 / 3, margin: 2 },
  image: { width: "100%", aspectRatio: 1, borderRadius: 8 },
  loaderWrap: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyWrap: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { color: "#666", fontSize: 16 },
  grid: { padding: 4 },
});

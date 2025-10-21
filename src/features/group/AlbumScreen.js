import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Alert, // ✅ Add Alert import
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import { getAlbumStories } from "../../services/storyService";

export default function AlbumScreen() {
  const params = useLocalSearchParams();
  const { albumId, groupId, albumName } = params;

  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (albumId) {
      fetchAlbumStories();
    } else {
      console.warn("⚠️ Missing albumId");
      setLoading(false);
    }
  }, [albumId]);

  const fetchAlbumStories = async () => {
    try {
      setLoading(true);
      console.log("📚 Fetching stories for albumId:", albumId);

      const res = await getAlbumStories(albumId);
      console.log("📦 Album stories response:", res);

      // ✅ Handle different response structures
      let storiesData = [];
      if (res?.data?.data) {
        storiesData = res.data.data;
      } else if (res?.data) {
        storiesData = res.data;
      } else if (Array.isArray(res)) {
        storiesData = res;
      }

      console.log("📸 Stories to display:", storiesData);
      console.log("📸 First story detail:", storiesData[0]);

      setStories(storiesData);
    } catch (error) {
      console.error("❌ Lỗi tải stories:", error);
      Alert.alert("Lỗi", "Không thể tải danh sách story");
      setStories([]);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item, index }) => {
    console.log(`📸 Rendering story ${index}:`, {
      storyId: item?.storyId,
      imageUrl: item?.imageUrl,
      caption: item?.caption
    });

    // ✅ Use imageUrl field from API
    const imageUrl =
      item?.imageUrl ||
      item?.fileUrl ||
      item?.thumbnailUrl ||
      `https://via.placeholder.com/150?text=No+Image`;

    return (
      <TouchableOpacity
        style={styles.imageWrapper}
        onPress={() => {
          // ✅ Use storyId instead of id
          if (!item?.storyId) {
            console.warn("⚠️ Story missing ID:", item);
            Alert.alert("Lỗi", "Không thể mở story này");
            return;
          }

          console.log("🔗 Navigating to story:", {
            storyId: item.storyId,
            albumId,
            groupId
          });

          router.push({
            pathname: "/group/story-detail",
            params: {
              storyId: String(item.storyId),
              albumId: String(albumId || ''),
              groupId: String(groupId || '')
            },
          });
        }}
      >
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
          onError={(e) => {
            console.error("❌ Image load error:", e.nativeEvent.error);
            console.log("Failed URL:", imageUrl);
          }}
        // onLoad={() => console.log("✅ Image loaded:", imageUrl)}
        />

        {item?.caption && (
          <View style={styles.captionBadge}>
            <Text style={styles.captionBadgeText} numberOfLines={1}>
              {item.caption}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
     <TouchableOpacity
  onPress={() =>
    router.push({
      pathname: "/group/camera",
      params: {
        groupId,
        groupName: albumName, 
        albumName,
      },
    })
  }
>
  <Ionicons name="chevron-back" size={22} color="#000" />
</TouchableOpacity>


        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{albumName || "Album nhóm"}</Text>
          {stories.length > 0 && (
            <Text style={styles.headerSubtitle}>
              {stories.length} {stories.length === 1 ? 'story' : 'stories'}
            </Text>
          )}
        </View>

        <TouchableOpacity
          onPress={() => {
            router.push({
              pathname: "/group/camera",
              params: { groupId, albumId }
            });
          }}
        >
          <Ionicons name="camera-outline" size={26} color="#000" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={{ marginTop: 12, color: "#666" }}>Đang tải stories...</Text>
        </View>
      ) : stories.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Ionicons name="images-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>Album này chưa có story nào 📷</Text>
          <TouchableOpacity
            style={styles.addFirstBtn}
            onPress={() => {
              router.push({
                pathname: "/group/camera",
                params: { groupId, albumId }
              });
            }}
          >
            <Text style={styles.addFirstBtnText}>Thêm story đầu tiên</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={stories}
          keyExtractor={(item, index) => item?.storyId?.toString() || `story-${index}`}
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
  headerSubtitle: { fontSize: 12, color: "#666", marginTop: 2 },
  headerCenter: { flex: 1, alignItems: "center" },
  imageWrapper: {
    flex: 1 / 3,
    margin: 2,
    position: 'relative',
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 8,
    backgroundColor: '#f0f0f0', // ✅ Placeholder color
  },
  captionBadge: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  captionBadgeText: {
    color: '#fff',
    fontSize: 10,
  },
  loaderWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  emptyWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    color: "#666",
    fontSize: 16,
    marginTop: 16,
  },
  addFirstBtn: {
    marginTop: 20,
    backgroundColor: '#2ECC71',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addFirstBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  grid: { padding: 4 },
});
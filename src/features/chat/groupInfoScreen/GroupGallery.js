import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import { chatService } from "../../../services/chatService";

const numColumns = 3;
const screenWidth = Dimensions.get("window").width;
const imageSize = screenWidth / numColumns;

export default function GroupGalleryScreen() {
  const { groupId } = useLocalSearchParams();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      const res = await chatService.getImagesByGroup(groupId);
      if (res.success) {
        const sorted = [...res.data].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setImages(sorted);
      }
      setLoading(false);
    };
    fetchImages();
  }, [groupId]);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#2ECC71" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 10,
          backgroundColor: "#2ECC71",
        }}
      >
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 10 }}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Ionicons name="image" size={20} color="#fff" />
      </View>

      {/* Grid ảnh */}
      <FlatList
        data={images}
        keyExtractor={(item, index) => index.toString()}
        numColumns={numColumns}
        renderItem={({ item }) => (
          <TouchableOpacity>
            <Image
              source={{ uri: item.imageUrl }}
              style={{
                width: imageSize,
                height: imageSize,
              }}
            />
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

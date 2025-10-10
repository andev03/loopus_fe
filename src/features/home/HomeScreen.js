import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./HomeScreen.styles";
import { useRouter } from "expo-router";
import ChatModal from "../home/ChatModal";
import { notificationService } from "../../services/notificationService";
import { getUserId } from "../../services/storageService";

export default function HomeScreen() {
  const router = useRouter();
  const [chatVisible, setChatVisible] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  // 🌀 Animation cho chuông
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const startShake = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: 1,
          duration: 100,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -1,
          duration: 100,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 100,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
      { iterations: 3 } // lắc 3 lần
    ).start();
  };

  // 📨 Kiểm tra có thông báo chưa đọc để lắc chuông
  useEffect(() => {
    const checkNotifications = async () => {
      try {
        const userId = await getUserId();
        if (!userId) return;
        const res = await notificationService.getNotifications(userId);
        const unread = res.data?.some((n) => !n.isRead);
        setHasUnread(unread);
        if (unread) startShake();
      } catch (err) {
        console.error("❌ Lỗi khi check thông báo:", err);
      }
    };

    checkNotifications();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <SafeAreaView edges={["top"]} style={{ backgroundColor: "#b4f1d3" }}>
          <View style={styles.header}>
            {/* Logo ở giữa */}
            <Text style={styles.logo}>LOOPUS</Text>

            {/* Icon chuông bên phải (có hiệu ứng lắc) */}
            <TouchableOpacity
              onPress={() => router.push("/notification/notifications")}
            >
              <Animated.View
                style={{
                  transform: [
                    {
                      rotate: shakeAnim.interpolate({
                        inputRange: [-1, 1],
                        outputRange: ["-10deg", "10deg"],
                      }),
                    },
                  ],
                }}
              >
                <Ionicons
                  name="notifications-outline"
                  size={24}
                  color={hasUnread ? "#ff4444" : "black"}
                />
              </Animated.View>
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        {/* Phần còn lại giữ nguyên */}
        <View style={styles.groupsSection}>
          <View style={styles.groups}>
            <TouchableOpacity
              style={styles.groupBox}
              onPress={() => router.push("/group/camera")}
            >
              <Image
                source={{ uri: "https://randomuser.me/api/portraits/men/1.jpg" }}
                style={styles.groupImage}
              />
              <Text>Group 1</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.groupBox}
              onPress={() => router.push("/group/camera")}
            >
              <Image
                source={{
                  uri: "https://randomuser.me/api/portraits/women/2.jpg",
                }}
                style={styles.groupImage}
              />
              <Text>Group 2</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.groupBox}
              onPress={() => router.push("/group/camera")}
            >
              <Image
                source={{ uri: "https://picsum.photos/100?random=3" }}
                style={styles.groupImage}
              />
              <Text>Group 3</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.groupBox}
              onPress={() => router.push("/group/camera")}
            >
              <Image
                source={{
                  uri: "https://source.unsplash.com/random/100x100?friends",
                }}
                style={styles.groupImage}
              />
              <Text>Group 4</Text>
            </TouchableOpacity>
          </View>

          {/* Nhắc nợ & Chia tiền */}
          <View style={styles.actionContainer}>
            <TouchableOpacity style={[styles.actionItem, styles.leftItem]}>
              <Ionicons
                name="notifications-circle-outline"
                size={28}
                color="#555"
              />
              <Text style={styles.actionText}>Nhắc nợ</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionItem, styles.rightItem]}>
              <Ionicons name="cash-outline" size={28} color="#555" />
              <Text style={styles.actionText}>Chia tiền</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Các section khác giữ nguyên */}
        <Text style={styles.sectionTitle}>Du lịch</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.dealRow}
        >
          <TouchableOpacity style={styles.travelCard}>
            <Image
              source={{ uri: "https://picsum.photos/300/200?random=11" }}
              style={styles.travelImage}
            />
            <View style={styles.overlay}>
              <Text style={styles.overlayText}>Xem ngay</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.travelCard}>
            <Image
              source={{ uri: "https://picsum.photos/300/200?random=12" }}
              style={styles.travelImage}
            />
            <View style={styles.overlay}>
              <Text style={styles.overlayText}>Xem ngay</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>

        {/* Deal đỉnh */}
        <Text style={styles.sectionTitle}>Deal đỉnh</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.dealRow}
        >
          {[21, 22, 23].map((n) => (
            <TouchableOpacity key={n} style={styles.dealCard}>
              <Image
                source={{ uri: `https://picsum.photos/200/150?random=${n}` }}
                style={styles.dealImageFull}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>

      {/* Floating Action Button cho Chatbot */}
      <TouchableOpacity
        style={styles.chatFAB}
        onPress={() => setChatVisible(true)}
        activeOpacity={0.7}
      >
        <Ionicons name="chatbubble-outline" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Modal Chatbot */}
      <ChatModal visible={chatVisible} onClose={() => setChatVisible(false)} />
    </View>
  );
}

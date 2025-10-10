import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Animated,
  Easing,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import styles from "../notifications/NotificationsScreen.styles";
import { notificationService } from "../../../services/notificationService";
import { getUserId } from "../../../services/storageService";

export default function NotificationsScreen() {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState(null);

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
      { iterations: 3 } // lắc 3 lần mỗi khi có thông báo mới
    ).start();
  };

  useEffect(() => {
    const loadUserAndNotifications = async () => {
      try {
        const id = await getUserId();
        setUserId(id);
        if (!id) {
          Alert.alert("Lỗi", "Không tìm thấy userId");
          setLoading(false);
          return;
        }
        await fetchNotifications(id);
      } catch (err) {
        console.error("❌ Lỗi khi load dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };
    loadUserAndNotifications();
  }, []);

  const fetchNotifications = async (id) => {
    try {
      setLoading(true);
      const res = await notificationService.getNotifications(id);
      console.log("📩 Notifications raw data:", JSON.stringify(res.data, null, 2));

      const data = (res.data || []).map((item) => {
        const senderName = item.sender?.fullName || item.sender?.username || "Người gửi";
        const recipientName = item.user?.fullName || item.user?.username || "Người nhận";
        const groupName = item.group?.name || "Nhóm";

        const isCurrentUserSender = item.sender?.userId === id;
        const isCurrentUserRecipient = item.user?.userId === id;

        let displayTitle = item.title || "";
        let displayMessage = item.message || "";

        // ✅ Tùy chỉnh nội dung theo type
        if (item.type === "PAYMENT_REMINDER") {
          const amountText = item.amount ? `${item.amount.toLocaleString()}₫` : "";

          if (isCurrentUserSender) {
            displayTitle = `Bạn đã nhắc ${recipientName} trả tiền`;
            displayMessage = `Bạn đã nhắc ${recipientName} trả ${amountText} trong nhóm "${groupName}"`;
          } else if (isCurrentUserRecipient) {
            displayTitle = `${senderName} đã nhắc bạn trả tiền`;
            displayMessage = `${senderName} đã nhắc bạn trả ${amountText} trong nhóm "${groupName}"`;
          } else {
            displayTitle = `${senderName} đã nhắc ${recipientName} trả tiền`;
            displayMessage = `${senderName} đã nhắc ${recipientName} trả ${amountText} trong nhóm "${groupName}"`;
          }
        }

        return {
          ...item,
          displayTitle,
          displayMessage,
        };
      });

      setNotifications(data);

      // 🔔 Nếu có thông báo chưa đọc → lắc chuông
      const hasUnread = data.some((n) => !n.isRead);
      if (hasUnread) startShake();
    } catch (err) {
      console.error("❌ Lỗi lấy thông báo:", err);
      Alert.alert("Lỗi", "Không thể tải thông báo");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    if (!userId) return;
    setRefreshing(true);
    await fetchNotifications(userId);
    setRefreshing(false);
  };

  const handleMarkAsRead = async (notificationId) => {
    if (!notificationId) {
      console.warn("⚠️ notificationId bị undefined khi markAsRead");
      return;
    }

    try {
      await notificationService.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) =>
          n.notificationId === notificationId ? { ...n, isRead: true } : n
        )
      );
    } catch (err) {
      console.error("❌ Lỗi mark as read:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!userId) return;
    try {
      await notificationService.markAllAsRead(userId);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("❌ Lỗi mark all as read:", err);
    }
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.container, { justifyContent: "center", alignItems: "center" }]}
      >
        <ActivityIndicator size="large" color="#666" />
        <Text style={{ marginTop: 10 }}>Đang tải thông báo...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back-outline" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Thông báo</Text>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={handleMarkAllAsRead} style={{ marginRight: 15 }}>
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
              <Ionicons name="notifications-outline" size={24} color="#fff" />
            </Animated.View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("notification/notification-setting")}
          >
            <Ionicons name="settings-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {notifications.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 20, color: "#666" }}>
            Không có thông báo nào
          </Text>
        ) : (
          notifications.map((item) => (
            <TouchableOpacity
              key={item.notificationId}
              style={[
                styles.item,
                { backgroundColor: item.isRead ? "#f5f5f5" : "#e8f0fe" },
              ]}
              onPress={() => handleMarkAsRead(item.notificationId)}
            >
              <Ionicons
                name={"notifications-outline"}
                size={22}
                color="#555"
                style={styles.icon}
              />
              <View style={styles.textContainer}>
                <Text style={styles.itemTitle}>{item.displayTitle}</Text>
                <Text style={styles.itemSub}>{item.displayMessage}</Text>

                {item.sender && (
                  <Text style={{ fontSize: 12, color: "#666", marginTop: 3 }}>
                    👤 Người gửi: {item.sender.fullName || item.sender.username}
                  </Text>
                )}

                <Text style={styles.itemTime}>
                  {new Date(item.createdAt).toLocaleString()}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

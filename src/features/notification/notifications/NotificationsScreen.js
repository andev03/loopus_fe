import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import styles from "../notifications/NotificationsScreen.styles";

export default function NotificationsScreen() {
  const navigation = useNavigation();

  const notifications = [
    {
      id: 1,
      icon: "cash-outline",
      title: "Lê Anh đã trả bạn 100.000đ",
      subText: "",
      time: "13/7/2025 - 09:30",
    },
    {
      id: 2,
      icon: "receipt-outline",
      title: "Cơm tấm sườn",
      subText: "Bạn đã trả 90.000VND",
      time: "12/7/2025 - 15:30",
    },
    {
      id: 3,
      icon: "receipt-outline",
      title: "Bún bò",
      subText: "Thư Đào đã trả 150.000VND",
      time: "10/7/2025 - 11:30",
    },
    {
      id: 4,
      icon: "alert-circle-outline",
      title: "Thư Đào nhắc bạn trả tiền",
      subText: "Bạn phải trả 50.000VND",
      time: "9/7/2025 - 11:30",
    },
    {
      id: 5,
      icon: "chatbubble-outline",
      title: "Lê Anh đã bình luận ảnh: vui quá z",
      subText: "Nhóm Cơm Tấm",
      time: "8/7/2025 - 15:38",
    },
    {
      id: 6,
      icon: "receipt-outline",
      title: "Trà sữa",
      subText: "Bạn đã trả 60.000VND",
      time: "8/7/2025 - 11:34",
    },
    {
      id: 7,
      icon: "people-outline",
      title: "Ngọc Hà mời bạn tham gia nhóm",
      subText: "Nhóm Đà Lạt Goo Goo",
      time: "5/7/2025 - 13:11",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* Nút back */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back-outline" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Thông báo</Text>

        {/* Nút setting */}
        <TouchableOpacity onPress={() => navigation.navigate("notification/notification-setting")}>
  <Ionicons name="settings-outline" size={22} color="#fff" />
</TouchableOpacity>
      </View>

      {/* List */}
      <ScrollView contentContainerStyle={styles.list}>
        {notifications.map((item) => (
          <View key={item.id} style={styles.item}>
            <Ionicons name={item.icon} size={22} color="#555" style={styles.icon} />
            <View style={styles.textContainer}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              {item.subText ? <Text style={styles.itemSub}>{item.subText}</Text> : null}
              <Text style={styles.itemTime}>{item.time}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}



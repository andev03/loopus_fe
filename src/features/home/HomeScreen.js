import React, { useState } from "react";
import { Text, View, ScrollView, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./HomeScreen.styles";
import { useRouter } from "expo-router";
import ChatModal from "../home/ChatModal"; 

export default function HomeScreen() {
  const router = useRouter();
  const [chatVisible, setChatVisible] = useState(false); 
  
  return (
    <View style={{ flex: 1 }}> {/* Wrap để FAB absolute */}
      <ScrollView style={styles.container}>
        {/* Header */}
        <SafeAreaView edges={["top"]} style={{ backgroundColor: "#b4f1d3" }}>
          <View style={styles.header}>
            {/* Logo ở giữa */}
            <Text style={styles.logo}>LOOPUS</Text>

            {/* Icon bên phải */}
            <TouchableOpacity onPress={() => router.push("/notification/notifications")}>
              <Ionicons name="notifications-outline" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        <View style={styles.groupsSection}>
          {/* Nhóm bạn bè */}
          <View style={styles.groups}>
            <TouchableOpacity style={styles.groupBox}
            onPress={() => router.push("/group/camera")}>
              <Image
                source={{ uri: "https://randomuser.me/api/portraits/men/1.jpg" }}
                style={styles.groupImage}
              />
              <Text>Group 1</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.groupBox}
            onPress={() => router.push("/group/camera")}>
              <Image
                source={{
                  uri: "https://randomuser.me/api/portraits/women/2.jpg",
                }}
                style={styles.groupImage}
              />
              <Text>Group 2</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.groupBox}
            onPress={() => router.push("/group/camera")}>
              <Image
                source={{ uri: "https://picsum.photos/100?random=3" }}
                style={styles.groupImage}
              />
              <Text>Group 3</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.groupBox}
            onPress={() => router.push("/group/camera")}>
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

        {/* Du lịch Section */}
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
          <TouchableOpacity style={styles.dealCard}>
            <Image
              source={{ uri: "https://picsum.photos/200/150?random=21" }}
              style={styles.dealImageFull}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.dealCard}>
            <Image
              source={{ uri: "https://picsum.photos/200/150?random=22" }}
              style={styles.dealImageFull}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.dealCard}>
            <Image
              source={{ uri: "https://picsum.photos/200/150?random=23" }}
              style={styles.dealImageFull}
            />
          </TouchableOpacity>
        </ScrollView>

        {/* Group Deal Section */}
        <Text style={styles.sectionTitle}>DEAL SỐC CHO NHÓM!</Text>

        {/* Du lịch */}
        <Text style={styles.subTitle}>Du lịch</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.dealRow}
        >
          <TouchableOpacity style={styles.travelCard}>
            <Image
              source={{ uri: "https://picsum.photos/300/200?random=31" }}
              style={styles.travelImage}
            />
            <View style={styles.overlay}>
              <Text style={styles.overlayText}>Xem ngay</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.travelCard}>
            <Image
              source={{ uri: "https://picsum.photos/300/200?random=32" }}
              style={styles.travelImage}
            />
            <View style={styles.overlay}>
              <Text style={styles.overlayText}>Xem ngay</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>

        {/* Ăn uống */}
        <Text style={styles.subTitle}>Ăn uống</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.dealRow}
        >
          <TouchableOpacity style={styles.dealCard}>
            <Image
              source={{ uri: "https://picsum.photos/200/150?random=41" }}
              style={styles.dealImageFull}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.dealCard}>
            <Image
              source={{ uri: "https://picsum.photos/200/150?random=42" }}
              style={styles.dealImageFull}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.dealCard}>
            <Image
              source={{ uri: "https://picsum.photos/200/150?random=43" }}
              style={styles.dealImageFull}
            />
          </TouchableOpacity>
        </ScrollView>

        {/* Dành cho nhóm bạn */}
        <Text style={styles.subTitle}>Dành cho nhóm bạn</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.dealRow}
        >
          <TouchableOpacity style={styles.dealCard}>
            <Image
              source={{ uri: "https://picsum.photos/200/150?random=51" }}
              style={styles.dealImageFull}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.dealCard}>
            <Image
              source={{ uri: "https://picsum.photos/200/150?random=52" }}
              style={styles.dealImageFull}
            />
          </TouchableOpacity>
        </ScrollView>
      </ScrollView>

      {/* Floating Action Button cho Chatbot - Thêm ở đây */}
      <TouchableOpacity 
        style={styles.chatFAB} 
        onPress={() => setChatVisible(true)}
        activeOpacity={0.7}
      >
        <Ionicons name="chatbubble-outline" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Modal Chatbot - Thêm ở đây */}
      <ChatModal visible={chatVisible} onClose={() => setChatVisible(false)} />
    </View>
  );
}
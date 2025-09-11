import React from "react";
import { View, Text, FlatList, Image, TouchableOpacity, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";   
import styles from "./CreateGroupScreen.styles";

const contacts = [
  { id: "1", name: "Đặng Lê Anh", time: "3 giờ trước", avatar: "https://randomuser.me/api/portraits/men/1.jpg" },
  { id: "2", name: "Thư Đào", time: "3 giờ trước", avatar: "https://randomuser.me/api/portraits/women/2.jpg" },
  { id: "3", name: "Ngọc Nhi", time: "3 giờ trước", avatar: "https://randomuser.me/api/portraits/women/3.jpg" },
];

function CreateGroupScreen() {
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <TouchableOpacity style={styles.checkbox} />
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* ❌ Nút đóng → quay lại ChatScreen */}
        <TouchableOpacity onPress={() => router.replace("/chat")}>
  <Ionicons name="close" size={24} color="#fff" />
</TouchableOpacity>
        <Text style={styles.headerTitle}>Nhóm mới</Text>
      </View>

      {/* Tên nhóm */}
      <View style={styles.groupInput}>
        <Ionicons name="camera-outline" size={28} color="#888" />
        <TextInput placeholder="Tên nhóm" style={styles.groupNameInput} />
        <Ionicons name="expand-outline" size={22} color="#888" />
      </View>

      {/* Tìm kiếm */}
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={18} color="#888" />
        <TextInput
          placeholder="Tìm tên hoặc số điện thoại"
          style={styles.searchInput}
          placeholderTextColor="#aaa"
        />
      </View>

      {/* Danh sách bạn bè */}
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      {/* Nút gửi */}
      <TouchableOpacity style={styles.sendButton}>
        <Ionicons name="send" size={26} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export default CreateGroupScreen;

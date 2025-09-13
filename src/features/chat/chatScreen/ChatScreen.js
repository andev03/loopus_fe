import React from "react";
import { View, Text, FlatList, Image, TouchableOpacity, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import styles from "../chatScreen/ChatScreen.styles";
import { router } from "expo-router"; 

const groups = [
  { id: "1", name: "Group 1", lastMessage: "Tin nhắn", time: "1 giờ", avatar: "https://randomuser.me/api/portraits/men/1.jpg" },
  { id: "2", name: "Group 2", lastMessage: "Tin nhắn", time: "1 giờ", avatar: "https://randomuser.me/api/portraits/women/2.jpg" },
  { id: "3", name: "Group 3", lastMessage: "Tin nhắn", time: "1 giờ", avatar: "https://randomuser.me/api/portraits/men/3.jpg" },
  { id: "4", name: "Group 4", lastMessage: "Tin nhắn", time: "1 giờ", avatar: "https://randomuser.me/api/portraits/women/4.jpg" },
];

function ChatScreen() {
  

  const renderItem = ({ item }) => (
  <TouchableOpacity 
    style={styles.item} 
    onPress={() => router.push(`/chat/${item.id}`)} 
  >
    <Image source={{ uri: item.avatar }} style={styles.avatar} />
    <View style={styles.textContainer}>
      <Text style={styles.groupName}>{item.name}</Text>
      <Text style={styles.lastMessage}>{item.lastMessage}</Text>
    </View>
    <Text style={styles.time}>{item.time}</Text>
  </TouchableOpacity>
);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="#fff" style={{ marginLeft: 6 }} />
          <TextInput
            placeholder="Tìm kiếm nhóm"
            placeholderTextColor="#e6e6e6"
            style={styles.searchInput}
          />
        </View>

        <TouchableOpacity
  style={styles.addButton}
  onPress={() => router.push("/create-group")}   
>
  <Ionicons name="add" size={26} color="#fff" />
</TouchableOpacity>
      </View>

      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
}

export default ChatScreen;

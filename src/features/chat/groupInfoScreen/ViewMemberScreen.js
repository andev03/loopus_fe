import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import { groupService } from "../../../services/groupService";

export default function ViewMembersScreen() {
  const { groupId } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      const res = await groupService.viewMembers(groupId);
      if (res.success && res.data?.data) {
        setMembers(Array.isArray(res.data.data) ? res.data.data : []);
      }
      setLoading(false);
    };
    fetchMembers();
  }, [groupId]);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Image
        source={{
          uri:
            item.avatarUrl ||
            "https://cdn-icons-png.flaticon.com/512/149/149071.png",
        }}
        style={styles.avatar}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.fullName || item.username}</Text>
        <Text style={styles.role}>{item.role || "Member"}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Thành viên nhóm</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2ECC71" style={{ marginTop: 40 }} />
      ) : members.length === 0 ? (
        <Text style={styles.empty}>Không có thành viên</Text>
      ) : (
        <FlatList
          data={members}
          keyExtractor={(item) => item.userId}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
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
    padding: 16,
    backgroundColor: "#2ECC71", 
  },
  title: { color: "#fff", fontSize: 18, fontWeight: "600", marginLeft: 10 },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
  },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  name: { color: "#333", fontSize: 16, fontWeight: "500" }, 
  role: { color: "#666", fontSize: 12 },
  empty: { color: "#666", textAlign: "center", marginTop: 40 },
});

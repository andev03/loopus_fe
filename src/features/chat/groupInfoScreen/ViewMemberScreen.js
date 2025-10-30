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

  const roleMap = {
    ADMIN: "Chủ nhóm",
    MEMBER: "Thành viên",
  };

  useEffect(() => {
  const fetchMembers = async () => {
    setLoading(true);
    const res = await groupService.viewMembers(groupId);
    if (res.success && res.data?.data) {
      const membersData = res.data.data;
      const parsed =
        typeof membersData === "string" ? JSON.parse(membersData) : membersData;

      if (Array.isArray(parsed)) {
        const sorted = parsed.sort((a, b) => {
          if (a.role === "ADMIN" && b.role !== "ADMIN") return -1;
          if (a.role !== "ADMIN" && b.role === "ADMIN") return 1;
          return 0;
        });
        setMembers(sorted);
      } else {
        setMembers([]);
      }
    } else {
      setMembers([]);
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
            item.user?.avatarUrl ||
            "https://cdn-icons-png.flaticon.com/512/149/149071.png",
        }}
        style={styles.avatar}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>
          {item.user?.fullName || item.user?.username || "Không tên"}
        </Text>
        <Text style={styles.role}>{roleMap[item.role] || "Không xác định"}</Text>
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
          keyExtractor={(item, index) => item.user?.userId || index.toString()}
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

import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";   // 👈 thêm router
import { useStatusStore } from "../store/useStatusStore";

const mockFriends = [
  { id: "1", username: "Thu Đào", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
  { id: "2", username: "Bảo Đại", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
  { id: "3", username: "Đạt Không Chín", avatar: "https://randomuser.me/api/portraits/men/52.jpg" },
];

export default function AvatarDropdown({ mainAvatar }) {
  const [open, setOpen] = useState(false);
  const { statuses } = useStatusStore();
  const router = useRouter();

  const data = [
    ...statuses.map((s) => ({ ...s, type: "status" })),
    ...mockFriends.map((f) => ({ ...f, type: "friend" })),
  ];

  return (
    <View style={{ alignItems: "flex-end" }}>
      <TouchableOpacity onPress={() => setOpen(!open)} style={styles.avatarWrap}>
        <Image source={{ uri: mainAvatar }} style={styles.avatar} />
      </TouchableOpacity>

      {open && (
        <View style={styles.dropdown}>
          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) =>
              item.type === "status" ? (
                <View style={styles.statusItem}>
                  {item.uri ? (
                    <Image source={{ uri: item.uri }} style={styles.dropdownAvatar} />
                  ) : (
                    <Ionicons name="text" size={28} color="#333" />
                  )}
                  <Text style={{ marginLeft: 8 }}>{item.text}</Text>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    setOpen(false);
                    // 👇 điều hướng sang màn StatusViewer kèm id bạn bè
                    router.push({
                      pathname: "/group/status-viewer",
                      params: { id: item.id },
                    });
                  }}
                >
                  <Image
                    source={{ uri: item.avatar }}
                    style={styles.dropdownAvatar}
                  />
                </TouchableOpacity>
              )
            }
          />
          <TouchableOpacity
            onPress={() => setOpen(false)}
            style={{ alignSelf: "center", marginTop: 4 }}
          >
            <Ionicons name="chevron-up" size={20} color="#333" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  avatarWrap: { padding: 4 },
  avatar: { width: 36, height: 36, borderRadius: 18 },
  dropdown: {
    position: "absolute",
    top: 48,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    maxHeight: 300,
  },
  dropdownAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginVertical: 4,
  },
  statusItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
});

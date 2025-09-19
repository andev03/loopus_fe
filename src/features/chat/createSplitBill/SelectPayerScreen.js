import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const contacts = [
  {
    id: "1",
    name: "Đặng Lê Anh",
    time: "3 giờ trước",
    avatar: "https://i.pravatar.cc/100?img=1",
  },
  {
    id: "2",
    name: "Thư Đào",
    time: "3 giờ trước",
    avatar: "https://i.pravatar.cc/100?img=2",
  },
  {
    id: "3",
    name: "Ngọc Nhi",
    time: "3 giờ trước",
    avatar: "https://i.pravatar.cc/100?img=3",
  },
];

export default function SelectPayerScreen() {
  const [selected, setSelected] = useState([]);

  const toggleSelect = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((x) => x !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const selectAll = () => {
    if (selected.length === contacts.length) {
      setSelected([]); // bỏ chọn tất cả
    } else {
      setSelected(contacts.map((c) => c.id)); // chọn tất cả
    }
  };

  const renderItem = ({ item }) => {
    const checked = selected.includes(item.id);
    return (
      <TouchableOpacity
        style={styles.row}
        onPress={() => toggleSelect(item.id)}
      >
        <View style={styles.avatarBox}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
          {checked && (
            <View style={styles.checkOverlay}>
              <Ionicons name="checkmark" size={14} color="#fff" />
            </View>
          )}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chọn người trả cho khoản phí này</Text>
      </View>

      {/* Search */}
      <View style={styles.searchBox}>
        <Ionicons
          name="search"
          size={18}
          color="#aaa"
          style={{ marginRight: 6 }}
        />
        <TextInput
          placeholder="Tìm tên hoặc số điện thoại"
          style={{ flex: 1 }}
        />
      </View>

      {/* Danh sách */}
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />

      {/* Tất cả */}
      <TouchableOpacity style={styles.allRow} onPress={selectAll}>
        <Ionicons
          name={
            selected.length === contacts.length ? "checkbox" : "square-outline"
          }
          size={20}
          color={selected.length === contacts.length ? "#2ECC71" : "#aaa"}
          style={{ marginRight: 8 }}
        />
        <Text>Tất cả</Text>
      </TouchableOpacity>

      {/* Footer với avatar selected */}
      {selected.length > 0 && (
        <View style={styles.footer}>
          <FlatList
            data={contacts.filter((c) => selected.includes(c.id))}
            horizontal
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.selectedAvatarBox}>
                <Image
                  source={{ uri: item.avatar }}
                  style={styles.selectedAvatar}
                />
                <TouchableOpacity
                  style={styles.removeIcon}
                  onPress={() => toggleSelect(item.id)}
                >
                  <Ionicons name="close" size={14} color="#2ECC71" />
                </TouchableOpacity>
              </View>
            )}
          />

          <TouchableOpacity
            style={styles.nextBtn}
            onPress={() => router.push("/chat/info-split-bill")}
          >
            <Ionicons name="arrow-forward" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#2ECC71",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 12,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    margin: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  avatarBox: { position: "relative", marginRight: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  checkIcon: { position: "absolute", bottom: -2, right: -2 },
  name: { fontSize: 15, fontWeight: "500" },
  time: { fontSize: 12, color: "#777" },
  allRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  selectedAvatarBox: { marginRight: 10 },
  selectedAvatar: { width: 36, height: 36, borderRadius: 18 },
  removeIcon: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 2,
    elevation: 2,
  },
  nextBtn: {
    backgroundColor: "#2ECC71",
    width: 45,
    height: 45,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "auto",
  },
  checkOverlay: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "#2ECC71",
    borderRadius: 10,
    padding: 2,
  },
});

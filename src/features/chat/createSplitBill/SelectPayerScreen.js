import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import styles from "./SelectPayerScreen.styles";
import { findUserByEmail } from "../../../services/authService"; // 

export default function SelectPayerScreen() {
  const { groupId, title, amount } = useLocalSearchParams();
  const [contacts, setContacts] = useState([]); // 🔹 kết quả tìm
  const [searchText, setSearchText] = useState("");
  const [selected, setSelected] = useState([]);
  const [amounts, setAmounts] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchText.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập email để tìm");
      return;
    }

    setLoading(true);
    try {
      const res = await findUserByEmail(searchText.trim());
      if (res.success && res.userId) {
  setContacts((prev) => {
    // 🔎 kiểm tra xem người này đã có trong danh sách chưa
    const exists = prev.some((u) => u.id === res.userId);
    if (exists) return prev; // nếu đã có thì không thêm lại

    // ✅ thêm người mới vào cuối danh sách
    return [
      ...prev,
      {
        id: res.userId,
        name: res.name,
        email: res.email,
        avatar: res.avatar,
        time: "Vừa tìm thấy",
      },
    ];
  });
} else {
  Alert.alert("Không tìm thấy", res.message);
} 
    } catch (err) {
      console.log("Lỗi khi tìm user:", err);
      Alert.alert("Lỗi", "Không thể tìm user");
    } finally {
      setLoading(false);
      setSearchText("");
    }
  };

  const toggleSelect = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((x) => x !== id));
      const updated = { ...amounts };
      delete updated[id];
      setAmounts(updated);
    } else {
      setSelected([...selected, id]);
    }
  };

  const selectAll = () => {
    if (selected.length === contacts.length) {
      setSelected([]);
      setAmounts({});
    } else {
      setSelected(contacts.map((c) => c.id));
    }
  };

  const handleAmountChange = (id, value) => {
    const numericValue = value.replace(/\D/g, "");
    const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    setAmounts({
      ...amounts,
      [id]: formattedValue,
    });
  };

  const renderItem = ({ item }) => {
    const checked = selected.includes(item.id);
    return (
      <TouchableOpacity
        style={styles.row}
        onPress={() => toggleSelect(item.id)}
        activeOpacity={0.9}
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
          <Text style={styles.time}>{item.email}</Text>
        </View>

        {/* Ô nhập số tiền */}
        {checked && (
          <TextInput
            style={[
              styles.amountInput,
              { width: Math.max(80, (amounts[item.id]?.length || 1) * 10) },
            ]}
            keyboardType="numeric"
            placeholder="0"
            value={amounts[item.id] || ""}
            onChangeText={(text) => handleAmountChange(item.id, text)}
            textAlign="right"
          />
        )}
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
        <Ionicons name="search" size={18} color="#aaa" style={{ marginRight: 6 }} />
        <TextInput
          placeholder="Nhập email để tìm"
          value={searchText}
          onChangeText={setSearchText}
          style={{ flex: 1 }}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TouchableOpacity onPress={handleSearch}>
          <Ionicons name="arrow-forward-circle" size={24} color="#2ECC71" />
        </TouchableOpacity>
      </View>

      {/* Danh sách */}
      {loading ? (
        <ActivityIndicator size="large" color="#2ECC71" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={contacts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 20, color: "#888" }}>
              Nhập email để tìm người dùng
            </Text>
          }
        />
      )}

      {/* Chọn tất cả */}
      {contacts.length > 0 && (
        <TouchableOpacity style={styles.allRow} onPress={selectAll}>
          <Ionicons
            name={selected.length === contacts.length ? "checkbox" : "square-outline"}
            size={20}
            color={selected.length === contacts.length ? "#2ECC71" : "#aaa"}
            style={{ marginRight: 8 }}
          />
          <Text>Tất cả</Text>
        </TouchableOpacity>
      )}

      <View style={styles.header}>
  <TouchableOpacity onPress={() => router.back()}>
    <Ionicons name="close" size={24} color="#fff" />
  </TouchableOpacity>
  <View style={{ flex: 1, alignItems: "center" }}>
    <Text style={styles.headerTitle}>Chọn người trả cho khoản phí này</Text>
    {amount && (
      <Text style={{ color: "#eee", marginTop: 4, fontSize: 13 }}>
  Tổng tiền: {Number(amount.replace(/,/g, "")).toLocaleString("vi-VN")} ₫
</Text>
    )}
  </View>
</View>

      {/* 🔹 Nút Chia đều */}
      <TouchableOpacity
        style={styles.splitEvenBtn}
        onPress={() => {
          if (selected.length === 0) {
            alert("Vui lòng chọn ít nhất 1 người để chia đều");
            return;
          }
          const total = parseInt(amount.replace(/,/g, "")) || 0;

          if (total <= 0) {
            alert("Số tiền không hợp lệ");
            return;
          }
          const perPerson = Math.floor(total / selected.length);
          const formatted = perPerson.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          const newAmounts = {};
          selected.forEach((id) => {
            newAmounts[id] = formatted;
          });
          setAmounts(newAmounts);
        }}
      >
        <Ionicons name="swap-horizontal" size={18} color="#2ECC71" />
        <Text style={{ marginLeft: 6 }}>Chia đều</Text>
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
                <Image source={{ uri: item.avatar }} style={styles.selectedAvatar} />
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
            onPress={() => {
  if (selected.length === 0) {
    Alert.alert("Lỗi", "Vui lòng chọn ít nhất 1 người chia tiền");
    return;
  }

  // Tính tổng tiền đã nhập
  const totalEntered = Object.values(amounts)
    .reduce((sum, val) => sum + (parseInt(val.replace(/,/g, "")) || 0), 0);

  const originalAmount = parseInt(amount.replace(/,/g, "")) || 0;

  if (totalEntered !== originalAmount) {
    Alert.alert(
      "Cập nhật tổng tiền?",
      `Tổng tiền bạn nhập là ${totalEntered.toLocaleString("vi-VN")}₫, khác với tổng ban đầu (${originalAmount.toLocaleString("vi-VN")}₫). Bạn có muốn cập nhật tổng tiền không?`,
      [
        {
          text: "Giữ nguyên",
          style: "cancel",
          onPress: () => {
            router.push({
              pathname: "/chat/info-split-bill",
              params: {
                groupId,
                title,
                amount,
                selected,
                amounts: JSON.stringify(amounts),
              },
            });
          },
        },
        {
          text: "Cập nhật",
          onPress: () => {
            router.push({
              pathname: "/chat/info-split-bill",
              params: {
                groupId,
                title,
                amount: totalEntered.toString(),
                selected,
                amounts: JSON.stringify(amounts),
              },
            });
          },
        },
      ]
    );
  } else {
    // Nếu khớp tổng tiền thì chuyển luôn
    router.push({
      pathname: "/chat/info-split-bill",
      params: {
        groupId,
        title,
        amount,
        selected,
        amounts: JSON.stringify(amounts),
      },
    });
  }
}}

          >
            <Ionicons name="arrow-forward" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

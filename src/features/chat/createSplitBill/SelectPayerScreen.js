import { useState, useEffect } from "react";
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
import { groupService } from "../../../services/groupService";
import { getUser } from "../../../services/storageService";
import DefaultAvatar from "../../../assets/images/default-avatar.jpg";

export default function SelectPayerScreen() {
  const { groupId, title, amount, payerId } = useLocalSearchParams();
  const [members, setMembers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [amounts, setAmounts] = useState({});
  const [loading, setLoading] = useState(false);
  const [excludeId, setExcludeId] = useState(null);

  // 🔹 Xác định excludeId (người trả bởi)
  useEffect(() => {
    const determineExcludeId = async () => {
      if (payerId === "me") {
        const me = await getUser();
        setExcludeId(me?.userId || null);
      } else {
        setExcludeId(payerId || null);
      }
    };
    determineExcludeId();
  }, [payerId]);

  // 🔹 Lấy danh sách thành viên
  useEffect(() => {
    const fetchMembers = async () => {
      if (!groupId) return;
      setLoading(true);
      const res = await groupService.viewMembers(groupId);
      setLoading(false);
      if (res.success && res.data?.data) {
        let data = res.data.data;
        if (excludeId) {
          data = data.filter((m) => m.user?.userId !== excludeId);
        }
        setMembers(data);
      } else {
        Alert.alert("Lỗi", "Không lấy được danh sách thành viên");
      }
    };
    fetchMembers();
  }, [groupId, excludeId]);

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
    if (selected.length === members.length) {
      setSelected([]);
      setAmounts({});
    } else {
      setSelected(members.map((m) => m.user?.userId));
    }
  };

  const handleAmountChange = (id, value) => {
  const numericValue = value.replace(/\D/g, "");
  const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");  // Đổi , thành .
  setAmounts({
    ...amounts,
    [id]: formattedValue,
  });
};

  const renderItem = ({ item }) => {
    const u = item.user || {};
    const id = u.userId;
    const checked = selected.includes(id);

    return (
      <TouchableOpacity
        style={styles.row}
        onPress={() => toggleSelect(id)}
        activeOpacity={0.9}
      >
        <View style={styles.avatarBox}>
          <Image
            source={u.avatarUrl ? { uri: u.avatarUrl } : DefaultAvatar}
            style={styles.avatar}
          />
          {checked && (
            <View style={styles.checkOverlay}>
              <Ionicons name="checkmark" size={14} color="#fff" />
            </View>
          )}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{u.fullName || u.username || "Không tên"}</Text>
          <Text style={styles.time}>{u.email || ""}</Text>
        </View>

        {checked && (
          <TextInput
            style={[
              styles.amountInput,
              { width: Math.max(80, (amounts[id]?.length || 1) * 10) },
            ]}
            keyboardType="numeric"
            placeholder="0"
            value={amounts[id] || ""}
            onChangeText={(text) => handleAmountChange(id, text)}
            textAlign="right"
          />
        )}
      </TouchableOpacity>
    );
  };

  const handleSplitEven = () => {
  if (selected.length === 0) {
    alert("Vui lòng chọn ít nhất 1 người để chia đều");
    return;
  }
  const total = parseInt(amount.replace(/\./g, "")) || 0;  // Đổi , thành .
  if (total <= 0) {
    alert("Số tiền không hợp lệ");
    return;
  }
  const perPerson = Math.floor(total / selected.length);
  const formatted = perPerson.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");  // Đổi , thành .
  const newAmounts = {};
  selected.forEach((id) => {
    newAmounts[id] = formatted;
  });
  setAmounts(newAmounts);
};

  const handleDone = () => {
  if (selected.length === 0) {
    Alert.alert("Lỗi", "Vui lòng chọn ít nhất 1 người chia tiền");
    return;
  }

  // Tính tổng tiền đã nhập (cập nhật parse)
  const totalEntered = Object.values(amounts).reduce(
    (sum, val) => sum + (parseInt(val.replace(/\./g, "")) || 0),  // Đổi , thành .
    0
  );

  const originalAmount = parseInt(amount.replace(/\./g, "")) || 0;  // Đổi , thành .

  if (totalEntered !== originalAmount) {
    Alert.alert(
      "Cập nhật tổng tiền?",
      `Tổng tiền bạn nhập là ${totalEntered.toLocaleString("vi-VN")}₫, khác với tổng ban đầu (${originalAmount.toLocaleString("vi-VN")}₫). Bạn có muốn cập nhật tổng tiền không?`,
      [
        {
          text: "Hủy",
          style: "cancel",
          onPress: () => {
            // Không làm gì, ở lại màn hiện tại
          },
        },
        {
          text: "Cập nhật",
          onPress: () => {
            router.push({
              pathname: "/chat/create-split-bill",
              params: {
                groupId,
                title,
                amount: totalEntered.toLocaleString("vi-VN"),  // Định dạng lại với locale (dấu chấm)
                selected: JSON.stringify(selected),
                amounts: JSON.stringify(amounts),
                payerId,  // Pass payerId back
              },
            });
          },
        },
      ]
    );
  } else {
    router.push({
      pathname: "/chat/create-split-bill",
      params: {
        groupId,
        title,
        amount,  // Giữ nguyên
        selected: JSON.stringify(selected),
        amounts: JSON.stringify(amounts),
        payerId,  // Pass payerId back
      },
    });
  }
};

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={styles.headerTitle}>Chọn người trả</Text>
          {amount && (
            <Text style={{ color: "#eee", marginTop: 4, fontSize: 13 }}>
  Tổng tiền: {Number(amount.replace(/\./g, "")).toLocaleString("vi-VN")} ₫  
</Text>
          )}
        </View>
      </View>

      {/* Danh sách thành viên */}
      {loading ? (
        <ActivityIndicator size="large" color="#2ECC71" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={members}
          keyExtractor={(item) => item.user?.userId?.toString()}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 20, color: "#888" }}>
              Không có thành viên trong nhóm
            </Text>
          }
        />
      )}

      {members.length > 0 && (
        <TouchableOpacity style={styles.allRow} onPress={selectAll}>
          <Ionicons
            name={selected.length === members.length ? "checkbox" : "square-outline"}
            size={20}
            color={selected.length === members.length ? "#2ECC71" : "#aaa"}
            style={{ marginRight: 8 }}
          />
          <Text>Tất cả</Text>
        </TouchableOpacity>
      )}

      {/* Nút chia đều */}
      <TouchableOpacity style={styles.splitEvenBtn} onPress={handleSplitEven}>
        <Ionicons name="swap-horizontal" size={18} color="#2ECC71" />
        <Text style={{ marginLeft: 6 }}>Chia đều</Text>
      </TouchableOpacity>

      {/* Footer */}
      {selected.length > 0 && (
        <View style={styles.footer}>
          <FlatList
            data={members.filter((m) => selected.includes(m.user?.userId))}
            horizontal
            keyExtractor={(item) => item.user?.userId?.toString()}
            renderItem={({ item }) => {
              const u = item.user || {};
              return (
                <View style={styles.selectedAvatarBox}>
                  <Image
                    source={u.avatarUrl ? { uri: u.avatarUrl } : DefaultAvatar}
                    style={styles.selectedAvatar}
                  />
                  <TouchableOpacity
                    style={styles.removeIcon}
                    onPress={() => toggleSelect(u.userId)}
                  >
                    <Ionicons name="close" size={14} color="#2ECC71" />
                  </TouchableOpacity>
                </View>
              );
            }}
          />

          <TouchableOpacity style={styles.nextBtn} onPress={handleDone}>
            <Ionicons name="arrow-forward" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
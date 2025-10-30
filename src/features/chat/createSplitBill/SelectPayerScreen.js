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

  // 🔹 Xác định excludeId (người trả)
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

  // 🔹 Lấy danh sách thành viên và loại bỏ người trả
  useEffect(() => {
    const fetchMembers = async () => {
      if (!groupId) return;
      setLoading(true);
      try {
        const res = await groupService.viewMembers(groupId);
        if (res.success && res.data?.data) {
          let data = res.data.data;
          // ✅ Loại bỏ người trả (excludeId)
          if (excludeId) {
            data = data.filter((m) => m.user?.userId !== excludeId);
          }
          setMembers(data);
        } else {
          Alert.alert("Lỗi", "Không lấy được danh sách thành viên");
        }
      } catch (error) {
        console.error("❌ Lỗi khi lấy thành viên:", error);
        Alert.alert("Lỗi", "Không thể tải danh sách thành viên");
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, [groupId, excludeId]);

  // 🔹 Toggle chọn người chia (không cho chọn người trả)
  const toggleSelect = (id) => {
    if (id === excludeId) return; // ❌ Không cho chọn người đã trả
    if (selected.includes(id)) {
      setSelected(selected.filter((x) => x !== id));
      const updated = { ...amounts };
      delete updated[id];
      setAmounts(updated);
    } else {
      setSelected([...selected, id]);
    }
  };

  // 🔹 Chọn tất cả (trừ người trả)
  const selectAll = () => {
    if (selected.length === members.length) {
      setSelected([]);
      setAmounts({});
    } else {
      const selectable = members
        .map((m) => m.user?.userId)
        .filter((id) => id !== excludeId);
      setSelected(selectable);
    }
  };

  // 🔹 Nhập tiền cho từng người
  const handleAmountChange = (id, value) => {
    const numericValue = value.replace(/\D/g, "");
    const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    setAmounts({
      ...amounts,
      [id]: formattedValue,
    });
  };

  // 🔹 Render từng thành viên
  const renderItem = ({ item }) => {
    const u = item.user || {};
    const id = u.userId;
    const checked = selected.includes(id);

    return (
      <TouchableOpacity
        style={[
          styles.row,
          id === excludeId && { opacity: 0.4 }, // làm mờ người trả
        ]}
        onPress={() => toggleSelect(id)}
        activeOpacity={0.9}
        disabled={id === excludeId} // ❌ Không cho chọn người trả
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

  // 🔹 Chia đều số tiền
  const handleSplitEven = () => {
    if (selected.length === 0) {
      alert("Vui lòng chọn ít nhất 1 người để chia đều");
      return;
    }
    const total = parseInt(amount.replace(/\./g, "")) || 0;
    if (total <= 0) {
      alert("Số tiền không hợp lệ");
      return;
    }
    const perPerson = Math.floor(total / selected.length);
    const formatted = perPerson.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    const newAmounts = {};
    selected.forEach((id) => {
      newAmounts[id] = formatted;
    });
    setAmounts(newAmounts);
  };

  // 🔹 Khi hoàn tất chọn người chia
  // 🔹 Khi hoàn tất chọn người chia
const handleDone = () => {
  if (selected.length === 0) {
    Alert.alert("Lỗi", "Vui lòng chọn ít nhất 1 người chia tiền");
    return;
  }

  const values = Object.values(amounts).map((v) => parseInt(v.replace(/\./g, "")) || 0);
  const allEqual = values.every((val) => val === values[0]);
  const type = allEqual ? "equal" : "exact";

  const totalEntered = values.reduce((sum, val) => sum + val, 0);
  const originalAmount = parseInt(amount.replace(/\./g, "")) || 0;

  const pushParams = {
    pathname: "/chat/create-split-bill",
    params: {
      groupId,
      title,
      amount, // ✅ Giữ nguyên amount=100k ở base
      selected: JSON.stringify(selected),
      amounts: JSON.stringify(amounts),
      payerId,
      type,
    },
  };

 if (totalEntered !== originalAmount) {
  Alert.alert(
    "Cập nhật tổng tiền?",
    `Tổng tiền bạn nhập là ${totalEntered.toLocaleString("vi-VN")}₫, khác với tổng ban đầu (${originalAmount.toLocaleString("vi-VN")}₫). Bạn có muốn cập nhật tổng tiền không?`,
    [
      { text: "Hủy", style: "cancel" },
      {
        text: "Cập nhật",
        onPress: () =>
          router.push({
            ...pushParams,
            params: { ...pushParams.params, amount: totalEntered.toLocaleString("vi-VN") },
          }),
      },
    ]
  );
} else {
  // ✅ Nếu bằng nhau, không cần hỏi, đi thẳng
  router.push(pushParams);
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
          <Text style={styles.headerTitle}>Chọn người chia</Text>
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

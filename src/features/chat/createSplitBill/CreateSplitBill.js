import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  FlatList,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import styles from "./CreateSplitBill.styles";
import { groupService } from "../../../services/groupService";
import { getUser } from "../../../services/storageService";
import DefaultAvatar from "../../../assets/images/default-avatar.jpg";

export default function CreateSplitBillScreen() {
  const { groupId, selected, title: paramTitle, amount: paramAmount, amounts: paramAmounts, locked, payerId: paramPayerId } = useLocalSearchParams();
  const [title, setTitle] = useState(paramTitle || "");
  const [amount, setAmount] = useState(paramAmount || "");
  const [payer, setPayer] = useState({ name: "Tôi", avatarUrl: null, id: null });
  const [target, setTarget] = useState("Cả nhóm");
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isLocked, setIsLocked] = useState(false);

  // set default payer = current user (Nếu có)
  useEffect(() => {
    const loadCurrentUser = async () => {
      const me = await getUser();
      if (me) {
        setPayer({
          name: me.fullName || "Tôi",
          avatarUrl: me.avatarUrl || null,
          id: me.userId || null,
        });
      }
    };
    loadCurrentUser();
  }, []);

  // Lấy danh sách thành viên group
  useEffect(() => {
    const fetchMembers = async () => {
      if (!groupId) return;
      const res = await groupService.viewMembers(groupId);
      if (res.success && res.data?.data) {
        setMembers(res.data.data);
      } else {
        console.log("❌ Không lấy được danh sách thành viên");
      }
    };
    fetchMembers();
  }, [groupId]);

  // Handle params from select-payer
  useEffect(() => {
    if (members.length > 0) {
      if (selected) {
        try {
          const parsedSelected = JSON.parse(selected);
          setSelectedIds(parsedSelected);
          setIsLocked(true);
        } catch (e) {
          console.log("parse selected error", e);
        }
      }
      if (paramTitle) setTitle(paramTitle);
      if (paramAmount) setAmount(paramAmount);
      if (paramPayerId) {
        const payerUser = members.find(m => (m.user?.userId || m.user?.id) === paramPayerId)?.user || null;
        if (payerUser) {
          setPayer({
            name: payerUser.fullName || payerUser.username || "Không tên",
            avatarUrl: payerUser.avatarUrl || null,
            id: payerUser.userId || payerUser.id || null,
          });
        } else if (paramPayerId === "me") {
          // Fallback to current user if "me"
          const me = getUser(); // Assuming async, but for simplicity
          if (me) {
            setPayer({
              name: me.fullName || "Tôi",
              avatarUrl: me.avatarUrl || null,
              id: me.userId || null,
            });
          }
        }
      }
    }
  }, [selected, paramTitle, paramAmount, paramPayerId, members]);

  const selectedUsers = useMemo(() => {
    return members
      .filter((m) => selectedIds.includes(m.user?.userId))
      .map((m) => m.user || {});
  }, [selectedIds, members]);

  const handleCreateSplitBill = () => {
    if (!title.trim() || parseFloat(amount.replace(/\./g, "")) <= 0) {
      Alert.alert("Lỗi", "Vui lòng nhập tên khoản phí và số tiền hợp lệ");
      return;
    }
    if (!groupId) {
      Alert.alert("Lỗi", "Không tìm thấy nhóm chat");
      return;
    }

    if (isLocked) {
      // TODO: Call API to create split bill with payer, title, amount, selectedIds, amounts
      // For now, simulate
      console.log("Creating split bill:", { payer, title, amount, selected: selectedIds });
      Alert.alert("Thành công", "Đã tạo chia tiền!");
      router.push(`/chat/${groupId}`);
    } else {
      router.push({
        pathname: "/chat/select-payer",
        params: {
          groupId,
          title: title.trim(),
          amount: amount.trim(),
          payerId: payer?.id || "me",
        },
      });
    }
  };

  // Lưu thông tin payer theo cấu trúc API (avatarUrl, userId)
  const handleSelectPayer = (user) => {
    setPayer({
      name: user.fullName || user.username || "Không tên",
      avatarUrl: user.avatarUrl || null,
      id: user.userId || user.id || null,
    });
    setModalVisible(false);
  };

  const handleNavigateToSelectPayer = () => {
    if (!title.trim() || parseFloat(amount.replace(/\./g, "")) <= 0) {
      Alert.alert("Lỗi", "Vui lòng nhập tên khoản phí và số tiền hợp lệ");
      return;
    }
    router.push({
      pathname: "/chat/select-payer",
      params: {
        groupId,
        title,
        amount,
        payerId: payer?.id || "me",
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            if (groupId) {
              router.push(`/chat/${groupId}`);
            } else {
              router.back();
            }
          }}
        >
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chia tiền</Text>
      </View>

      {/* Body */}
      <View style={styles.body}>
        <Ionicons
          name="cash-outline"
          size={64}
          color="#2ECC71"
          style={{ marginBottom: 16 }}
        />

        <View style={styles.card}>
          <TextInput
            placeholder="Tên khoản phí..."
            placeholderTextColor="#999"
            value={title}
            onChangeText={!isLocked ? setTitle : undefined}
            editable={!isLocked}
            style={styles.input}
          />

          <TextInput
            placeholder="Số tiền (VND)"
            placeholderTextColor="#999"
            value={amount}
            onChangeText={!isLocked ? (text) => {
              const numeric = text.replace(/\D/g, "");
              const formatted = numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
              setAmount(formatted);
            } : undefined}
            editable={!isLocked}
            keyboardType="numeric"
            style={[styles.input, { textAlign: "right" }]}
          />

          {/* Trả bởi */}
          <View style={styles.row}>
            <Text style={styles.label}>Trả bởi</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setModalVisible(true)}
            >
              <Image
                source={payer.avatarUrl ? { uri: payer.avatarUrl } : DefaultAvatar}
                style={{ width: 24, height: 24, borderRadius: 12, marginRight: 8 }}
              />
              <Text style={styles.dropdownText}>{payer.name}</Text>
              <Ionicons name="chevron-down" size={18} color="#2ECC71" />
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>{isLocked ? "Người trả:" : "Chọn người trả"}</Text>
            {isLocked ? (
              <FlatList
                data={selectedUsers}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.userId?.toString() || Math.random().toString()}
                renderItem={({ item }) => (
                  <View style={{ flexDirection: "row", alignItems: "center", marginRight: 12 }}>
                    <Image
                      source={item.avatarUrl ? { uri: item.avatarUrl } : DefaultAvatar}
                      style={{ width: 24, height: 24, borderRadius: 12, marginRight: 4 }}
                    />
                    <Text style={[styles.dropdownText, { fontSize: 12 }]}>
                      {item.fullName || item.username || "Không tên"}
                    </Text>
                  </View>
                )}
                style={{ flex: 1 }}
              />
            ) : (
              <TouchableOpacity style={styles.dropdown} onPress={handleNavigateToSelectPayer}>
                <Text style={styles.dropdownText}>Chọn người trả</Text>
                <Ionicons name="chevron-forward" size={18} color="#2ECC71" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* Button */}
      <TouchableOpacity
        style={[styles.createButton, loading && { opacity: 0.7 }]}
        onPress={handleCreateSplitBill}
        disabled={loading}
      >
        <Text style={styles.createButtonText}>
          {loading ? "Đang tạo..." : "Chia tiền"}
        </Text>
      </TouchableOpacity>

      {/* Modal chọn người trả */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.container}>
          <View style={styles.modalBox}>
            <Text style={styles.title}>Chọn người trả</Text>

            <FlatList
              data={members}
              keyExtractor={(item) => (item.user?.userId || item.user?.id || Math.random()).toString()}
              renderItem={({ item }) => {
                const u = item.user || {};
                return (
                  <TouchableOpacity
                    style={styles.memberItem}
                    onPress={() => handleSelectPayer(u)}
                  >
                    <Image
                      source={u.avatarUrl ? { uri: u.avatarUrl } : DefaultAvatar}
                      style={styles.avatar}
                    />
                    <Text style={styles.memberName}>
                      {u.fullName || u.username || "Không tên"}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />

            <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
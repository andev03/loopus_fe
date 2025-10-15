// src/features/chat/groupReminder/PaymentScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";

import { transferMoney } from "../../../services/walletService";
import { getUser } from "../../../services/storageService";
import { expenseService } from "../../../services/expenseService";
import styles from "./PaymentScreen.styles";

export default function PaymentScreen() {
  const { payerId, groupId, payerName, payerAvatar } = useLocalSearchParams();

  const [amount, setAmount] = useState("");
  const [user, setUser] = useState(null);
  const [debts, setDebts] = useState([]);
  const [selectedDebts, setSelectedDebts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingDebts, setLoadingDebts] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const u = await getUser();
        setUser(u);
      } catch (err) {
        console.error("Error loading user:", err);
      }
    })();
  }, []);

  useEffect(() => {
    if (!user || !payerId) return;
    fetchMyDebtsToThem();
  }, [user, payerId]);

  const fetchMyDebtsToThem = async () => {
    try {
      setLoadingDebts(true);
      const currentUserId = user?.userId;
      if (!currentUserId || !payerId) {
        console.log("❌ Missing userId or payerId:", { currentUserId, payerId });
        return;
      }

      console.log("🔍 Fetching MY DEBTS TO THEM:", { creditor: payerId, debtor: currentUserId });
      const res = await expenseService.getDebtReminder(payerId, currentUserId);
      console.log("📥 MY DEBTS RESPONSE:", JSON.stringify(res, null, 2));

      const list = res?.data || [];
      console.log("📝 Processed debts list:", list.length);

      setDebts(list.map((item) => ({
        id: item.id,
        expenseId: item.expenseDto?.expenseId,
        title: item.expenseDto?.description || `Khoản nợ #${item.expenseDto?.expenseId?.slice(-6)}`,
        amount: item.shareAmount || 0,
        date: item.expenseDto?.createdAt 
          ? new Date(item.expenseDto.createdAt).toLocaleString('vi-VN', { 
              year: 'numeric', 
              month: '2-digit', 
              day: '2-digit' 
            })
          : "Chưa có ngày",
        paid: item.paid || false,
        selected: false,
      })));
    } catch (error) {
      console.error("❌ Lỗi khi lấy khoản nợ tôi nợ họ:", error);
      Alert.alert("Lỗi", "Không thể tải danh sách khoản nợ");
    } finally {
      setLoadingDebts(false);
    }
  };

  const toggleDebtSelection = (debtId) => {
    setDebts(prev => prev.map(d => 
      d.id === debtId ? { ...d, selected: !d.selected } : d
    ));
  };

  const getSelectedTotal = () => {
    return selectedDebts.reduce((sum, debt) => sum + debt.amount, 0);
  };

  useEffect(() => {
    const selected = debts.filter(d => d.selected);
    setSelectedDebts(selected);
  }, [debts]);

  // ✅ Không cần mark manually nữa vì backend tự update paid sau transfer
  const markDebtsAsPaid = async (selectedDebts) => {
    // Backend đã handle: transfer với expenseId sẽ set paid: true cho share
    console.log("✅ Backend tự động cập nhật paid: true sau transfer");
  };

  const handleTransfer = async () => {
    const selectedTotal = getSelectedTotal();
    if (selectedTotal <= 0 && !amount) {
      Alert.alert("Lỗi", "Vui lòng chọn ít nhất một khoản nợ hoặc nhập số tiền.");
      return;
    }

    const num = selectedTotal > 0 ? selectedTotal : Number(amount.toString().replace(/[, ]+/g, ""));
    if (isNaN(num) || num <= 0) {
      Alert.alert("Lỗi", "Số tiền không hợp lệ.");
      return;
    }
    if (!payerId) {
      Alert.alert("Lỗi", "Không có thông tin người nhận.");
      return;
    }

    try {
      setLoading(true);
      let allSuccess = true;
      let transferResults = [];

      if (selectedTotal > 0) {
        // Chuyển từng khoản riêng biệt (backend sẽ update paid cho từng share)
        for (const debt of selectedDebts) {
          const res = await transferMoney(
            payerId,
            debt.amount, // Amount chính xác của debt
            groupId || "",
            debt.expenseId || "",
            "GROUP_EXPENSE"
          );
          transferResults.push(res);
          if (!res.success) {
            allSuccess = false;
            break;
          }
        }
      } else {
        // Manual transfer (không liên quan expense, không update paid)
        const res = await transferMoney(
          payerId,
          num,
          groupId || "",
          "",
          "INDIVIDUAL_TRANSFER"
        );
        transferResults.push(res);
        allSuccess = res.success;
      }

      if (allSuccess) {
        // Gọi mark (chỉ log, backend đã done)
        if (selectedTotal > 0) {
          await markDebtsAsPaid(selectedDebts);
        }

        Alert.alert("Thành công", transferResults[0]?.message || "Chuyển tiền thành công", [
          {
            text: "OK",
            onPress: async () => {
              await fetchMyDebtsToThem(); // Refresh: debts với paid=true sẽ không show (filter !paid)
            },
          },
        ]);
      } else {
        const errorMsg = transferResults.find(r => !r.success)?.message || "Không thể chuyển tiền";
        Alert.alert("Thất bại", errorMsg);
      }
    } catch (err) {
      console.error("transfer error:", err);
      Alert.alert("Lỗi", "Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  if (!user || loadingDebts) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#2ECC71" />
        <Text style={{ marginTop: 8 }}>Đang tải thông tin...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Thanh toán</Text>

        <View style={{ width: 40 }} />
      </View>

      {/* Transfer info */}
      <View style={styles.transferBox}>
        <Image
          source={{
            uri: user?.avatarUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
          }}
          style={styles.avatar}
        />

        <View style={styles.iconRow}>
          <Ionicons name="cash-outline" size={28} color="#2ECC71" />
          <Ionicons
            name="arrow-forward-outline"
            size={24}
            color="#2ECC71"
            style={{ marginLeft: 6 }}
          />
        </View>

        <Image
          source={{
            uri: payerAvatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
          }}
          style={styles.avatar}
        />
      </View>

      <View style={styles.nameRow}>
        <Text style={styles.name}>Bạn</Text>
        <Text style={styles.name}>{payerName || "Người nhận"}</Text>
      </View>

      {/* Danh sách khoản nợ */}
      <View style={{ flex: 1, padding: 16 }}>
        <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 12 }}>Chọn khoản nợ để trả:</Text>
        {debts.length === 0 ? (
          <Text style={{ textAlign: "center", color: "#888", marginTop: 20 }}>Không có khoản nợ nào</Text>
        ) : (
          <FlatList
            data={debts.filter(d => !d.paid)}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.debtItem,
                  item.selected && { backgroundColor: "#e8f5e8" }
                ]}
                onPress={() => toggleDebtSelection(item.id)}
                activeOpacity={0.7}
                disabled={item.paid}
              >
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() => toggleDebtSelection(item.id)}
                  disabled={item.paid}
                >
                  <Ionicons
                    name={item.selected ? "checkmark-circle" : "ellipse-outline"}
                    size={20}
                    color={item.selected ? "#2ECC71" : "#ccc"}
                  />
                </TouchableOpacity>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.debtTitle}>{item.title}</Text>
                  <Text style={styles.debtInfo}>
                    {`Số tiền: ${item.amount.toLocaleString()} VND - Ngày: ${item.date}`}
                    {item.paid && <Text style={{ color: "#2ECC71", fontWeight: "bold" }}> (Đã trả)</Text>}
                  </Text>
                </View>
                <Text style={[styles.debtAmount, item.paid && { color: "#ccc", textDecorationLine: "line-through" }]}>
                  {item.amount.toLocaleString()} VND
                </Text>
              </TouchableOpacity>
            )}
            scrollEnabled={true}
          />
        )}

        {getSelectedTotal() > 0 && (
          <View style={styles.totalBox}>
            <Text style={styles.totalLabel}>Tổng chọn:</Text>
            <Text style={styles.totalAmount}>{getSelectedTotal().toLocaleString()} VND</Text>
          </View>
        )}

        {!getSelectedTotal() && (
          <View style={styles.amountBox}>
            <Text style={styles.currency}>VND</Text>
            <TextInput
              value={amount}
              onChangeText={(text) => {
                const numeric = text.replace(/\D/g, "");
                const formatted = numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                setAmount(formatted);
              }}
              placeholder="Nhập số tiền ..."
              keyboardType="numeric"
              style={styles.amountInput}
            />
          </View>
        )}
      </View>

      {/* Pay button */}
      <TouchableOpacity
        style={[styles.payBtn, loading && { opacity: 0.7 }]}
        onPress={handleTransfer}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.payText}>
            Chuyển {getSelectedTotal() > 0 ? getSelectedTotal().toLocaleString() : amount} VND
          </Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}
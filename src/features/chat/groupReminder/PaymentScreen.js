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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";

import { transferMoney } from "../../../services/walletService";
import { getUser } from "../../../services/storageService";
import styles from "./PaymentScreen.styles";

export default function PaymentScreen() {
  const { payerId, groupId, payerName, payerAvatar  } = useLocalSearchParams();

  const [amount, setAmount] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const handleTransfer = async () => {
    const num = Number(amount.toString().replace(/[, ]+/g, ""));
    if (!amount || isNaN(num) || num <= 0) {
      Alert.alert("Lỗi", "Vui lòng nhập số tiền hợp lệ.");
      return;
    }
    if (!payerId) {
      Alert.alert("Lỗi", "Không có thông tin người nhận.");
      return;
    }

    try {
      setLoading(true);
      const res = await transferMoney(payerId, num, groupId || "");

      if (res.success) {
        Alert.alert("Thành công", res.message || "Chuyển tiền thành công", [
          {
            text: "OK",
            onPress: async () => {
              // Optional: Refresh user/wallet sau transfer
              try {
                const u = await getUser();
                setUser(u);
              } catch (err) {
                console.error("Error refreshing user:", err);
              }
              router.replace({
                pathname: "/chat/member-debt-detail",
                params: { payerId, groupId },
              });
            },
          },
        ]);
      } else {
        Alert.alert("Thất bại", res.message || "Không thể chuyển tiền");
      }
    } catch (err) {
      console.error("transfer error:", err);
      Alert.alert("Lỗi", "Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
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
    uri: payerAvatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
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
            uri: user?.avatarUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
          }}
          style={styles.avatar}
        />
      </View>

      <View style={styles.nameRow}>
        <Text style={styles.name}>Bạn</Text>
  <Text style={styles.name}>
    {payerName || "Người nợ"}
  </Text>
</View>

      {/* Amount input */}
      <View style={styles.amountBox}>
        <Text style={styles.currency}>VND</Text>
        <TextInput
  value={amount}
  onChangeText={(text) => {
    // ✅ Loại bỏ ký tự không phải số
    const numeric = text.replace(/\D/g, "");

    // ✅ Format thành dạng 10.000
    const formatted = numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    setAmount(formatted);
  }}
  placeholder="Nhập số tiền..."
  keyboardType="numeric"
  style={styles.amountInput}
/>

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
          <Text style={styles.payText}>Chuyển tiền</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}


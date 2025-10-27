import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { depositMoney } from "../../../services/walletService";

export default function DepositScreen() {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  // 🧮 Định dạng tiền Việt Nam (VD: 1.000)
  const formatCurrency = (value) => {
    if (!value) return "";
    const numericValue = value.replace(/\D/g, ""); // bỏ ký tự không phải số
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleChange = (text) => {
    const formatted = formatCurrency(text);
    setAmount(formatted);
  };

  const handleDeposit = async () => {
    const numericAmount = Number(amount.replace(/\./g, ""));
    if (!numericAmount || isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert("Lỗi", "Vui lòng nhập số tiền hợp lệ");
      return;
    }

    try {
      setLoading(true);
      const res = await depositMoney(numericAmount);
      console.log("💰 Kết quả nạp tiền:", res);

      if (res.success && res.data?.checkoutUrl) {
        // ✅ Mở trang thanh toán PayOS
        Linking.openURL(res.data.checkoutUrl);
      } else {
        Alert.alert("❌ Lỗi", res.message || "Không thể tạo link thanh toán");
      }
    } catch (error) {
      console.error("❌ Lỗi khi nạp tiền:", error);
      Alert.alert("Lỗi", "Không thể thực hiện giao dịch");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
     <TouchableOpacity
  onPress={() => router.push("/account/my-wallet")} // hoặc router.replace("/account/my-wallet")
  style={{ marginBottom: 20 }}
>
  <Ionicons name="arrow-back" size={24} color="#333" />
</TouchableOpacity>

      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 20 }}>
        Nạp tiền vào ví
      </Text>

      <TextInput
        value={amount}
        onChangeText={handleChange}
        placeholder="Nhập số tiền (VND)"
        keyboardType="numeric"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 15,
          borderRadius: 8,
          marginBottom: 20,
          fontSize: 18,
        }}
      />

      <TouchableOpacity
        disabled={loading}
        onPress={handleDeposit}
        style={{
          backgroundColor: loading ? "#95a5a6" : "#2ECC71",
          padding: 15,
          borderRadius: 8,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
          {loading ? "Đang xử lý..." : "Xác nhận nạp tiền"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

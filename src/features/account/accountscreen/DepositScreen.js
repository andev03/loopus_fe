import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { depositMoney } from "../../../services/walletService"; // ✅ đã tạo ở trên

export default function DepositScreen() {
  const [amount, setAmount] = useState("");

  const handleDeposit = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      Alert.alert("Lỗi", "Vui lòng nhập số tiền hợp lệ");
      return;
    }

    const res = await depositMoney(Number(amount));
    if (res.success) {
      Alert.alert("✅ Thành công", "Nạp tiền thành công!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } else {
      Alert.alert("❌ Thất bại", res.message || "Không thể nạp tiền");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 20 }}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 20 }}>
        Nạp tiền vào ví
      </Text>

      <TextInput
        value={amount}
        onChangeText={setAmount}
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
        onPress={handleDeposit}
        style={{
          backgroundColor: "#2ECC71",
          padding: 15,
          borderRadius: 8,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
          Xác nhận nạp tiền
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { getUser } from "../../../services/storageService";
import { createPayout } from "../../../services/payoutService";
import { getAllBanks } from "../../../services/bankService";
import { getWalletByUserId } from "../../../services/walletService"; // ✅ Thêm dòng này
import styles from "./Payout.styles";

export default function PayoutScreen() {
  const [user, setUser] = useState(null);
  const [amount, setAmount] = useState("");
  const [banks, setBanks] = useState([]);
  const [balance, setBalance] = useState(0); // ✅ Thêm state lưu số dư ví
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const u = await getUser();
      setUser(u);

      const bankRes = await getAllBanks();
      if (bankRes.success) setBanks(bankRes.data);

      // ✅ Lấy số dư ví
      const walletRes = await getWalletByUserId();
      if (walletRes.success) {
        setBalance(walletRes.data.balance || 0);
      }
    };
    loadData();
  }, []);

  const selectedBank = user
    ? banks.find((b) => b.bankId === user.bankId)
    : null;

  // ✅ Hàm định dạng số tiền khi nhập
  const handleAmountChange = (text) => {
    const numeric = text.replace(/\D/g, ""); // loại bỏ ký tự không phải số
    if (!numeric) {
      setAmount("");
      return;
    }
    const formatted = Number(numeric).toLocaleString("vi-VN");
    setAmount(formatted);
  };

  const handlePayout = async () => {
    const rawAmount = Number(amount.replace(/\./g, "")); // bỏ dấu chấm để lấy giá trị thật

    if (!rawAmount || isNaN(rawAmount) || rawAmount <= 0) {
      Alert.alert("Lỗi", "Vui lòng nhập số tiền hợp lệ để rút.");
      return;
    }

    // ✅ Kiểm tra đủ tiền
    if (rawAmount > balance) {
      Alert.alert(
        "Không đủ số dư",
        `Số dư ví của bạn hiện là ${balance.toLocaleString("vi-VN")}₫.\nBạn không thể rút ${rawAmount.toLocaleString("vi-VN")}₫.`
      );
      return;
    }

    if (!user?.bankId || !user?.bankNumber) {
      Alert.alert(
        "Thiếu thông tin ngân hàng",
        "Vui lòng cập nhật thông tin ngân hàng trước khi rút tiền.",
        [
          { text: "Hủy", style: "cancel" },
          {
            text: "Cập nhật ngay",
            onPress: () => router.push("/account/edit-profile"),
          },
        ]
      );
      return;
    }

    if (!selectedBank) {
      Alert.alert("Lỗi", "Không tìm thấy thông tin ngân hàng hợp lệ.");
      return;
    }

    // ⚠️ Thêm bước xác nhận thông tin trước khi gửi payout
    Alert.alert(
      "Xác nhận thông tin ngân hàng",
      `Vui lòng kiểm tra lại trước khi rút tiền:\n\n` +
        `Ngân hàng: ${selectedBank.bankName}\n` +
        `Số tài khoản: ${user.bankNumber}\n` +
        `Chủ tài khoản: ${user.fullName}\n` +
        `Số tiền: ${rawAmount.toLocaleString("vi-VN")}₫\n\n` +
        `⚠️ Bạn có chắc thông tin trên là chính xác không?\nChúng tôi sẽ không chịu trách nhiệm nếu thông tin sai.`,
      [
        { text: "Kiểm tra lại", style: "cancel" },
        {
          text: "Xác nhận rút tiền",
          onPress: async () => {
            const payload = {
              referenceId: "payout_" + Math.floor(Date.now() / 1000),
              amount: rawAmount,
              description: `Rút ${rawAmount.toLocaleString("vi-VN")}₫`,
              toBin: selectedBank.binCode,
              toAccountNumber: user.bankNumber,
              category: ["TRANSFER"],
            };

            try {
              setLoading(true);
              console.log("📤 Gửi yêu cầu payout:", payload);

              const res = await createPayout(user.userId, payload);
              console.log("📥 Kết quả payout:", res);

              if (res?.error === 0) {
                Alert.alert("✅ Thành công", "Yêu cầu rút tiền đã được gửi.", [
                  { text: "OK", onPress: () => router.replace("/account/my-wallet") },
                ]);
              } else {
                Alert.alert("❌ Lỗi", res?.message || "Không thể rút tiền.");
              }
            } catch (err) {
              console.error("❌ Lỗi payout:", err);
              Alert.alert("Lỗi", err.message || "Không thể tạo yêu cầu rút tiền.");
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  if (!user) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#3498DB" />
        <Text style={{ marginTop: 10 }}>Đang tải thông tin người dùng...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={styles.title}>Rút tiền về tài khoản</Text>

        {/* Hiển thị số dư ví */}
        <View style={{ marginBottom: 10 }}>
          <Text style={{ fontSize: 14, color: "#555" }}>Số dư ví hiện tại:</Text>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "#2ECC71" }}>
            {balance.toLocaleString("vi-VN")}₫
          </Text>
        </View>

        <Text style={styles.label}>Số tiền muốn rút</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Nhập số tiền (VND)"
          value={amount}
          onChangeText={handleAmountChange}
        />

        {/* Thông tin ngân hàng */}
        <View
          style={{
            marginTop: 15,
            padding: 15,
            backgroundColor: "#f7faff",
            borderRadius: 10,
          }}
        >
          <Text style={styles.bankInfoLabel}>
            Ngân hàng: {selectedBank?.bankName || "Không rõ"}
          </Text>
          <Text style={styles.bankInfoLabel}>
            Mã BIN: {selectedBank?.binCode || "N/A"}
          </Text>
          <Text style={styles.bankInfoLabel}>
            Số tài khoản: {user.bankNumber}
          </Text>
          <Text style={styles.bankInfoLabel}>Chủ tài khoản: {user.fullName}</Text>
        </View>

        <TouchableOpacity
          style={[
            styles.depositButton,
            { backgroundColor: loading ? "#ccc" : "#E74C3C", marginTop: 25 },
          ]}
          onPress={handlePayout}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="cash-outline" size={20} color="#fff" />
              <Text style={styles.depositText}>Xác nhận rút tiền</Text>
            </>
          )}
        </TouchableOpacity>

<TouchableOpacity
  style={[styles.backButton, { marginTop: 15 }]}
  onPress={() => router.push("/account/my-wallet")}
>
  <Ionicons name="arrow-back" size={20} color="#fff" />
  <Text style={styles.backText}>Quay lại</Text>
</TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

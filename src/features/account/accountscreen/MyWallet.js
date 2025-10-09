import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import styles from "./MyWallet.styles";
import { getWalletByUserId } from "../../../services/walletService";

export default function MyWalletScreen() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchWallet = async () => {
    try {
      const wallet = await getWalletByUserId();
      if (wallet.success) {
        console.log("💳 Ví người dùng:", wallet.data);
        setBalance(wallet.data.balance || 0);
        setTransactions(wallet.data.transactions || []);
      } else {
        console.warn("⚠️ Không lấy được ví:", wallet.message);
      }
    } catch (error) {
      console.error("❌ Lỗi fetchWallet:", error);
    } finally {
      setLoading(false); // ✅ luôn tắt trạng thái loading
    }
  };
  fetchWallet();
}, []);


  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Đang tải ví...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ví của tôi</Text>
      </View>

      {/* Số dư */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Số dư hiện tại</Text>
        <Text style={styles.balanceAmount}>
          {balance.toLocaleString("vi-VN")} VND
        </Text>
      </View>

      {/* Nút hành động */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="swap-horizontal" size={20} color="#2ECC71" />
          <Text style={styles.actionText}>Chuyển tiền</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="time-outline" size={20} color="#2ECC71" />
          <Text style={styles.actionText}>Lịch sử</Text>
        </TouchableOpacity>
      </View>

      {/* Danh sách giao dịch */}
      <Text style={styles.sectionTitle}>Giao dịch gần đây</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item, index) => item.id || index.toString()}
        contentContainerStyle={styles.transactionList}
        renderItem={({ item }) => (
          <View style={styles.transactionItem}>
            <View>
              <Text style={styles.transactionType}>{item.type}</Text>
              <Text style={styles.transactionDate}>{item.date}</Text>
            </View>
            <Text
              style={[
                styles.transactionAmount,
                { color: item.amount > 0 ? "#2ECC71" : "#E74C3C" },
              ]}
            >
              {item.amount > 0 ? "+" : ""}
              {item.amount.toLocaleString("vi-VN")}₫
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 10, color: "#888" }}>
            Chưa có giao dịch nào
          </Text>
        }
      />

      {/* Nút quay lại */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={20} color="#fff" />
        <Text style={styles.backText}>Quay lại</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

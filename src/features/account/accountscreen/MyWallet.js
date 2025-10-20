import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import styles from "./MyWallet.styles";
import { getWalletByUserId, getTransactionsByWalletId } from "../../../services/walletService"; // ✅ Thêm import full transactions

export default function MyWalletScreen() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [walletId, setWalletId] = useState(null); // ✅ State để lưu walletId

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const wallet = await getWalletByUserId();
        if (wallet.success) {
          console.log("💳 Ví người dùng:", wallet.data);
          setBalance(wallet.data.balance || 0);
          setWalletId(wallet.data.walletId || wallet.data.id); // ✅ Lưu walletId để fetch full txns
          
          // ✅ Nếu transactions từ wallet chỉ là recent/basic, fetch full list với details
          if (wallet.data.walletId) {
            const fullTxns = await getTransactionsByWalletId(wallet.data.walletId);
            if (fullTxns.success) {
              console.log("📜 Full transactions:", fullTxns.data);
              // ✅ Sort descending (giao dịch mới nhất ở trên đầu)
              const sortedTransactions = [...(fullTxns.data || [])].sort((a, b) => 
                new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0)
              );
              setTransactions(sortedTransactions);
            } else {
              // Fallback dùng wallet.transactions nếu full fail
              const fallbackTxns = wallet.data.transactions || [];
              const sortedFallback = [...fallbackTxns].sort((a, b) => 
                new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0)
              );
              setTransactions(sortedFallback);
            }
          } else {
            const fallbackTxns = wallet.data.transactions || [];
            const sortedFallback = [...fallbackTxns].sort((a, b) => 
              new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0)
            );
            setTransactions(sortedFallback);
          }
        } else {
          console.warn("⚠️ Không lấy được ví:", wallet.message);
        }
      } catch (error) {
        console.error("❌ Lỗi fetchWallet:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWallet();
  }, []);

  // ✅ Hàm chuyển type sang tiếng Việt (case-insensitive)
  const getTypeText = (type) => {
    const lowerType = (type || '').toLowerCase();
    switch (lowerType) {
      case 'transfer in':
      case 'transferin':
      case 'transfer_in':
        return 'Nhận tiền';
      case 'transfer out':
      case 'transferout':
      case 'transfer_out':
        return 'Chuyển tiền';
      default:
        return type || 'Giao dịch';
    }
  };

  // ✅ Hàm lấy icon và màu dựa trên type
  const getTransactionIcon = (type, amount) => {
    const lowerType = (type || '').toLowerCase();
    const isIn = lowerType.includes('in');
    const color = amount > 0 ? "#2ECC71" : "#E74C3C";
    return {
      name: isIn ? "arrow-down" : "arrow-up",
      color: color
    };
  };

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

      {/* Nút nạp tiền */}
<TouchableOpacity
  style={styles.depositButton}
  onPress={() => router.push("/account/deposit")} 
>
  <Ionicons name="add-circle-outline" size={20} color="#fff" />
  <Text style={styles.depositText}>Nạp tiền</Text>
</TouchableOpacity>

      {/* Danh sách giao dịch */}
      <Text style={styles.sectionTitle}>Giao dịch gần đây</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item, index) => item.id || item.walletTransactionId || index.toString()}
        contentContainerStyle={styles.transactionList}
        renderItem={({ item }) => {
          const iconInfo = getTransactionIcon(item.type, item.amount);
          return (
            <View style={styles.transactionItem}>
              <View style={{ flex: 1 }}>
                {/* ✅ Icon dựa trên type */}
                <Ionicons 
                  name={iconInfo.name} 
                  size={16} 
                  color={iconInfo.color} 
                />
                
                {/* ✅ Type + Chi tiết (description/otherUser nếu có) */}
                <Text style={styles.transactionType}>
                  {getTypeText(item.type)}
                  {item.otherUserName && ` từ ${item.otherUserName}`} {/* Nếu có otherUser */}
                </Text>
                
                {/* ✅ Description/Note nếu có */}
                {item.description && (
                  <Text style={[styles.transactionDate, { fontSize: 12, color: '#888' }]}>
                    {item.description}
                  </Text>
                )}
                
                {/* Date */}
                <Text style={styles.transactionDate}>
                  {item.date || new Date(item.createdAt).toLocaleDateString('vi-VN')}
                </Text>
              </View>
              
              {/* Amount */}
              <Text
                style={[
                  styles.transactionAmount,
                  { color: iconInfo.color },
                ]}
              >
                {item.amount > 0 ? "+" : ""}
                {Math.abs(item.amount).toLocaleString("vi-VN")}₫
              </Text>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', padding: 20 }}>
            <Ionicons name="wallet-outline" size={48} color="#ccc" />
            <Text style={{ textAlign: "center", marginTop: 10, color: "#888" }}>
              Chưa có giao dịch nào
            </Text>
            <Text style={{ textAlign: "center", color: "#999", fontSize: 12, marginTop: 4 }}>
              Bắt đầu chuyển tiền để xem lịch sử
            </Text>
          </View>
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
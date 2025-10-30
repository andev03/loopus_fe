import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router, useFocusEffect } from "expo-router";
import { useState, useCallback } from "react";
import { expenseService } from "../../../services/expenseService"; 
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "./MemberDebtDetailScreen.styles";
import { getUser } from "../../../services/storageService";

export default function MemberDebtDetailScreen() {
  const { payerId, groupId, payerName: paramName, payerAvatar: paramAvatar } = useLocalSearchParams(); 
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);


  // ✅ Lấy userId từ AsyncStorage
  const fetchUserId = async () => {
    try {
      const userInfo = await AsyncStorage.getItem("userInfo");
      if (userInfo) {
        const parsed = JSON.parse(userInfo);
        setUserId(parsed.userId); // ✅ đổi từ parsed.id → parsed.userId
        return parsed.userId;
      }
      return null;
    } catch (error) {
      console.error("❌ Lỗi khi đọc userInfo:", error);
      return null;
    }
  };

  const fetchDebtReminder = async () => {
  try {
    setLoading(true);
    const id = await fetchUserId();
    if (!id) {
      Alert.alert("Lỗi", "Không tìm thấy thông tin người dùng");
      return;
    }

    const res = await expenseService.getDebtReminder(id, payerId);
    
    console.log("🔍 LOG RES: ", JSON.stringify(res, null, 2));
    console.log("📥 Debt reminder data:", res);

    const list = res?.data || [];
    
    console.log("📝 EXPENSE IDS TRONG REMINDER: ", list.map(item => item.expenseDto?.expenseId));

    if (list.length === 0) {
      setMember({
        name: paramName || "Người dùng",
        avatar: paramAvatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
        total: 0,
        details: [],
      });
      return;
    }

    // ✅ FILTER CHỈ UNPAID DEBTS (loại bỏ paid: true)
    const unpaidList = list.filter(item => !item.paid); // ← Thêm filter này
    console.log("📝 UNPAID DEBTS ONLY:", unpaidList.length); // Log để debug

    if (unpaidList.length === 0) {
      // Nếu tất cả đã paid, set total=0
      setMember({
        name: list[0].user?.fullName || paramName || "Người nợ",
        avatar: list[0].user?.avatarUrl || paramAvatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
        total: 0,
        details: [],
      });
      return;
    }

    const payer = unpaidList[0]; // Dùng unpaid đầu tiên cho name/avatar
    const totalDebt = unpaidList.reduce((sum, item) => sum + (item.shareAmount || 0), 0); // Sum chỉ unpaid

    setMember({
      name: payer.user?.fullName || paramName || "Người nợ",
      avatar: payer.user?.avatarUrl || paramAvatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      total: totalDebt,
      details: unpaidList.map((item) => ({ // Map chỉ unpaid
        title: item.expenseDto?.description || `Khoản nợ #${item.expenseDto?.expenseId?.slice(-6)}`,
        amount: item.shareAmount,
        date: item.expenseDto?.createdAt 
          ? new Date(item.expenseDto.createdAt).toLocaleString('vi-VN', { 
              year: 'numeric', 
              month: '2-digit', 
              day: '2-digit', 
              hour: '2-digit', 
              minute: '2-digit' 
            })
          : "Chưa có ngày",
        paid: item.paid || false, // Vẫn giữ để UI biết (dù đã filter)
      })),
    });
  } catch (error) {
    console.error("❌ Lỗi khi lấy nhắc nợ:", error);
    Alert.alert("Lỗi", "Không thể tải thông tin nhắc nợ");
  } finally {
    setLoading(false);
  }
};

  useFocusEffect(
    useCallback(() => {
      fetchDebtReminder();
    }, [payerId])
  );

  const handleCreateReminder = async () => {
  try {
    if (!userId || !payerId) {
      Alert.alert("Lỗi", "Thiếu thông tin người dùng hoặc người trả nợ");
      return;
    }

    const payload = { userId, payerId };
    console.log("📦 Reminder payload:", payload);

    await expenseService.createDebtReminder(payload);

    // ✅ Hiển thị giao diện thành công
    setShowSuccess(true);

    // ✅ Ẩn sau 1.5 giây
    setTimeout(() => setShowSuccess(false), 1500);

  } catch (error) {
    console.error("❌ Lỗi khi tạo nhắc nợ:", error);
    Alert.alert("Lỗi", "Không thể gửi nhắc nợ");
  }
};


  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ textAlign: "center", marginTop: 20 }}>Đang tải...</Text>
      </SafeAreaView>
    );
  }

  // ✅ Luôn show UI, ngay cả khi total = 0
  const hasDebt = member.total > 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={{ width: 40 }} /> 
      </View>

      {/* Avatar + Tổng nợ */}
      <View style={styles.profileBox}>
        <Image source={{ uri: member.avatar }} style={styles.avatarLarge} />

        {/* ✅ Hiển thị tên người nợ */}
        <Text style={styles.memberName}>{member.name}</Text>

        {/* ✅ Hiển thị tổng tiền bên dưới */}
        <Text style={styles.subText}>
          Sẽ trả bạn{" "}
          <Text style={[styles.totalAmount, !hasDebt && { color: "#999" }]}>
            {member.total.toLocaleString()} VND
          </Text>
          { !hasDebt && <Text style={{ fontSize: 14, color: "#999", marginTop: 4 }}> (Chưa có khoản nợ)</Text> }
        </Text>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => router.push({
  pathname: "/chat/member-payment",
   params: { 
        payerId, 
        groupId, 
        payerName: member.name,     
        payerAvatar: member.avatar, 
      },
})}
          >
            <Text style={styles.actionText}>Thanh toán</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={handleCreateReminder} disabled={!hasDebt}>
            <Text style={[styles.actionText, !hasDebt && { color: "#ccc" }]}>Nhắc nợ</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Lịch sử nợ */}
      <View style={styles.history}>
        <Text style={styles.historyTitle}>Chi tiết nợ</Text>

        {member.details.length === 0 ? (
          <View style={{ alignItems: "center", padding: 20 }}>
            <Ionicons name="document-outline" size={48} color="#ccc" />
            <Text style={{ textAlign: "center", color: "#888", marginTop: 10 }}>
              Chưa có giao dịch nào
            </Text>
            <Text style={{ textAlign: "center", color: "#999", fontSize: 12, marginTop: 4 }}>
              Bạn có thể tạo chi tiêu chung để theo dõi nợ
            </Text>
          </View>
        ) : (
          member.details.map((d, idx) => (
            <View key={idx} style={styles.historyRow}>
              <Ionicons name="document-text-outline" size={20} color="#555" />
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.historyName}>{d.title}</Text>
                <Text style={styles.historyInfo}>
                  {`Họ nợ bạn ${d.amount?.toLocaleString()} VND\nNgày: ${d.date}`}
                </Text>
              </View>
              <Text style={styles.historyAmount}>
                {d.amount?.toLocaleString()} VND
              </Text>
            </View>
          ))
        )}
      </View>
      {showSuccess && (
  <View style={styles.successOverlay}>
    <View style={styles.successBox}>
      <Ionicons name="checkmark-circle" size={64} color="#4CD964" />
      <Text style={styles.successText}>Đã nhắc thành công</Text>
    </View>
  </View>
)}
    </SafeAreaView>
  );
}
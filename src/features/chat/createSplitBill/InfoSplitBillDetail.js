import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { expenseService } from "../../../services/expenseService";
import { groupService } from "../../../services/groupService";
import { getUser } from "../../../services/storageService";
import DefaultAvatar from "../../../assets/images/default-avatar.jpg";
import styles from "./InfoSplitBillDetail.styles";

export default function InfoSplitBillDetailScreen() {
  const { expenseId, groupId } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [expense, setExpense] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const me = await getUser();
        setCurrentUser(me);

        // 1. Lấy chi tiết expense
        const expenseRes = await expenseService.getExpenseDetail(expenseId);
        if (!expenseRes || !expenseRes.data) {
          Alert.alert("Thông báo", "Không tìm thấy thông tin khoản chi tiêu.");
          return;
        }

        let expenseData = expenseRes.data;

        // 2. Lấy danh sách thành viên nhóm để map tên (nếu cần)
        const memberRes = await groupService.viewMembers(groupId);
        const members = memberRes?.success ? memberRes.data.data || [] : [];

        // 3. Làm sạch participants (vì API trả về user bên trong)
        const enrichedParticipants = expenseData.participants.map((p) => {
          const u = p.user; // 👈 lấy ra user từ participant
          const memberInfo = members.find((m) => m.userId === u.userId);

          return {
            ...p,
            userId: u.userId,
            fullName: memberInfo?.fullName || u.fullName || "Không tên",
            avatar: memberInfo?.avatarUrl || u.avatarUrl || null,
            shareAmount: p.shareAmount || 0,
          };
        });

        expenseData = { ...expenseData, participants: enrichedParticipants };

        setExpense(expenseData);
      } catch (err) {
        console.error("❌ Lỗi khi tải chi tiết:", err);
        Alert.alert("Lỗi", err.message || "Không thể tải chi tiết chia tiền.");
      } finally {
        setLoading(false);
      }
    };

    if (expenseId && groupId) fetchData();
  }, [expenseId, groupId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#2ECC71" style={{ marginTop: 50 }} />
      </SafeAreaView>
    );
  }

  if (!expense) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ marginTop: 50, alignItems: "center" }}>
          <Text style={{ color: "#777" }}>Không có dữ liệu khoản chi tiêu</Text>
        </View>
      </SafeAreaView>
    );
  }

  const { description, amount, paidBy, createdAt, participants } = expense;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết chia tiền</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Tiêu đề */}
        <View style={styles.section}>
          <Text style={styles.title}>{description || "Không có mô tả"}</Text>
          <Text style={styles.amount}>{(amount || 0).toLocaleString()} VND</Text>
          <Text style={styles.subText}>
            {paidBy?.fullName || "Ai đó"} đã trả lúc{" "}
            {createdAt ? new Date(createdAt).toLocaleString("vi-VN") : "N/A"}
          </Text>
        </View>

        {/* Người tham gia */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Người tham gia</Text>
          {participants && participants.length > 0 ? (
            participants.map((p, index) => {
              const isPayer = paidBy?.userId === p.userId;
              const isPaid = p.paid || false; // ✅ Lấy trạng thái paid từ API
              const shareAmount = p.shareAmount || 0;
              const subText = isPayer 
                ? "Người trả" 
                : isPaid 
                  ? `Đã trả ${(shareAmount).toLocaleString()} VND`  // ✅ Nếu đã trả
                  : `Phải trả ${(shareAmount).toLocaleString()} VND`;  // ✅ Nếu chưa trả

              return (
                <View
                  key={p.userId || `participant-${index}`}
                  style={styles.participantRow}
                >
                  <Image
                    source={
                      p.avatar
                        ? { uri: p.avatar }
                        : { uri: `https://api.dicebear.com/7.x/identicon/png?seed=${p.userId || index}` }
                    }
                    style={styles.participantAvatar}
                    defaultSource={DefaultAvatar}
                  />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.participantName}>{p.fullName}</Text>
                    <Text 
                      style={[
                        styles.participantSub,
                        isPaid && { color: "#2ECC71" }  // ✅ Màu xanh nếu đã trả
                      ]}
                    >
                      {subText}
                    </Text>
                  </View>
                  {!isPayer && (
                    <Text 
                      style={[
                        styles.participantAmount,
                        isPaid && { color: "#2ECC71", textDecorationLine: "line-through" }  // ✅ Gạch ngang nếu đã trả
                      ]}
                    >
                      {shareAmount.toLocaleString()} VND
                    </Text>
                  )}
                </View>
              );
            })
          ) : (
            <Text style={{ color: "#777" }}>Không có người tham gia</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
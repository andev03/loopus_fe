import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { expenseService } from "../../../services/expenseService";
import { groupService } from "../../../services/groupService";
import { getUser } from "../../../services/storageService";
import styles from "./InfoSplitBill.styles";
import DefaultAvatar from "../../../assets/images/default-avatar.jpg";

export default function InfoSplitBillScreen() {
  const { groupId, expenseId, amount: paramAmount } = useLocalSearchParams();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [groupName, setGroupName] = useState("");
  const [groupLoading, setGroupLoading] = useState(true);
  const [groupInfo, setGroupInfo] = useState(null);
  const [activeTab, setActiveTab] = useState("payment"); 

  const originalAmount = parseInt(paramAmount?.replace(/\./g, "") || "0");

  useEffect(() => {
    const loadCurrentUser = async () => {
      const me = await getUser();
      setCurrentUser(me);
      console.log("👤 Current user:", me?.userId);
    };
    loadCurrentUser();
  }, []);

  useEffect(() => {
    const fetchGroupInfo = async () => {
      if (!groupId || !currentUser?.userId) {
        setGroupName(`Nhóm ${groupId?.slice(0, 6) || "Unknown"}`);
        setGroupLoading(false);
        return;
      }
      try {
        const res = await groupService.getGroups(currentUser.userId);
        if (res.success && res.data && Array.isArray(res.data.data)) {
          const targetGroup = res.data.data.find(
            (g) => g.id === groupId || g.groupId === groupId
          );
          if (targetGroup) {
            const name =
              targetGroup.groupName ||
              targetGroup.name ||
              targetGroup.title ||
              targetGroup.group_name;
            setGroupInfo(targetGroup);
            setGroupName(name || `Nhóm ${groupId.slice(0, 6)}`);
          } else {
            setGroupName(`Nhóm ${groupId.slice(0, 6)}`);
          }
        } else {
          setGroupName(`Nhóm ${groupId.slice(0, 6)}`);
        }
      } catch (error) {
        console.error("❌ Lỗi fetch groups info:", error);
        setGroupName(`Nhóm ${groupId.slice(0, 6)}`);
      } finally {
        setGroupLoading(false);
      }
    };
    fetchGroupInfo();
  }, [groupId, currentUser?.userId]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        if (!groupId) return;
        const res = await expenseService.getExpensesByGroup(groupId);
        if (Array.isArray(res.data)) {
          const sorted = [...res.data].sort((a, b) => {
            const timeA = new Date(a.createdAt || 0).getTime();
            const timeB = new Date(b.createdAt || 0).getTime();
            return timeB - timeA;
          });
          setExpenses(sorted);
        } else {
          setExpenses([]);
        }
      } catch (error) {
        console.error("❌ Lỗi khi load expense:", error);
        setExpenses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, [groupId, expenseId, originalAmount]);

  const getNetAmount = (exp) => {
    if (!currentUser) return 0;
    const expAmount = exp.amount || 0;
    const participants = exp.participants || [];
    const paidByUserId = exp.paidBy?.userId;
    const currentUserId = currentUser.userId;
    const expType = exp.type || "equal";

    if (expType === "equal") {
      const numParts = participants.length;
      if (numParts === 0) return 0;
      const share = Math.floor(expAmount / numParts);
      if (paidByUserId === currentUserId) {
        return expAmount;
      } else {
        const isParticipant = participants.some(
          (p) => p.userId === currentUserId
        );
        return isParticipant ? -share : 0;
      }
    } else {
      const userParticipant = participants.find(
        (p) => p.userId === currentUserId
      );
      const userShare = userParticipant ? userParticipant.shareAmount || 0 : 0;
      if (paidByUserId === currentUserId) {
        return participants.reduce(
          (sum, p) => sum + (p.shareAmount || 0),
          0
        );
      } else {
        return -userShare;
      }
    }
  };

  const getDisplayAmount = (exp) => {
    if (exp.expenseId === expenseId && originalAmount > 0) {
      return originalAmount;
    }
    return exp.amount || 0;
  };

  const totalReceive = expenses.reduce(
    (sum, e) => sum + Math.max(getNetAmount(e), 0),
    0
  );

  const handleDeleteExpense = async (expenseId) => {
    try {
      Alert.alert("Xác nhận xóa", "Bạn có chắc muốn xóa khoản chi tiêu này không?", [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              const res = await expenseService.deleteExpense(expenseId);
              console.log("🗑️ Xóa thành công:", res);
              setExpenses((prev) =>
                prev.filter((e) => e.expenseId !== expenseId)
              );
              Alert.alert("Thành công", "Đã xóa khoản chi tiêu!");
            } catch (err) {
              console.error("❌ Lỗi khi xóa:", err);
              Alert.alert("Lỗi", err.message || "Không thể xóa chia tiền");
            }
          },
        },
      ]);
    } catch (error) {
      console.error("❌ Lỗi khi xác nhận xóa:", error);
    }
  };

  if (loading || groupLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#2ECC71" style={{ marginTop: 50 }} />
      </SafeAreaView>
    );
  }

  const displayGroupName = groupName || `Nhóm ${groupId?.slice(0, 6) || "Unknown"}`;
  const avatarCandidate =
    groupInfo?.avatarUrl || groupInfo?.avatar || groupInfo?.avatar_url || null;
  const avatarSource =
    avatarCandidate && avatarCandidate.trim() !== ""
      ? { uri: avatarCandidate }
      : groupId
      ? { uri: `https://api.dicebear.com/7.x/identicon/png?seed=${groupId}` }
      : DefaultAvatar;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Avatar + Group name */}
      <View style={styles.avatarBox}>
        <Image source={avatarSource} style={styles.avatar} />
        <Text style={styles.groupName} numberOfLines={1}>
          {displayGroupName}
        </Text>
      </View>

      {/* Tổng cộng */}
      <Text style={styles.totalText}>
        Tổng cộng bạn sẽ nhận được{" "}
        <Text style={{ fontWeight: "bold", color: "#2ECC71" }}>
          {(totalReceive || 0).toLocaleString()} VND
        </Text>
      </Text>

      {/* Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "payment" && styles.tabActive]}
          onPress={() => setActiveTab("payment")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "payment" && styles.tabTextActive,
            ]}
          >
            Thanh toán
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "reminder" && styles.tabActive]}
          onPress={() => setActiveTab("reminder")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "reminder" && styles.tabTextActive,
            ]}
          >
            Nhắc nợ
          </Text>
        </TouchableOpacity>
      </View>

      {/* Nội dung tab */}
      <ScrollView style={styles.history}>
        {activeTab === "payment" ? (
          expenses.length === 0 ? (
            <Text style={{ textAlign: "center", marginTop: 20, color: "#777" }}>
              Chưa có khoản chi tiêu nào
            </Text>
          ) : (
            expenses.map((exp, index) => {
              const net = getNetAmount(exp);
              const paidByName = exp.paidBy?.fullName || "Ai đó";
              const paidText =
                exp.paidBy?.userId === currentUser?.userId
                  ? "Bạn"
                  : paidByName;
              const receiveText =
                net > 0
                  ? `Bạn sẽ nhận ${net.toLocaleString()} VND`
                  : net < 0
                  ? `Bạn phải trả ${Math.abs(net).toLocaleString()} VND`
                  : "0 VND";
              return (
                <TouchableOpacity
                  key={exp.expenseId || index}
                  onLongPress={() => handleDeleteExpense(exp.expenseId)}
                  delayLongPress={600}
                  style={styles.paymentRow}
                >
                  <Ionicons name="cash-outline" size={22} color="#000" />
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={styles.paymentTitle}>
                      {exp.description || "Không có mô tả"}
                    </Text>
                    <Text style={styles.paymentSub}>
                      {paidText} đã trả{" "}
                      {(getDisplayAmount(exp) || 0).toLocaleString()} VND
                    </Text>
                    <Text style={styles.paymentSub}>
                      Lúc{" "}
                      {exp.createdAt
                        ? new Date(exp.createdAt).toLocaleString("vi-VN")
                        : "N/A"}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.paymentReceive,
                      net < 0 ? { color: "#E74C3C" } : {},
                    ]}
                  >
                    {receiveText}
                  </Text>
                </TouchableOpacity>
              );
            })
          )
        ) : (
          <View style={{ padding: 16 }}>
            <Text style={{ textAlign: "center", color: "#555" }}>
              💬 Tính năng “Nhắc nợ” đang được phát triển.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

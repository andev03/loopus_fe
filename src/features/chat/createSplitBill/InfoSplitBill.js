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
  const [reminderSuccess, setReminderSuccess] = useState(false);
  const [reminding, setReminding] = useState(false);

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

    console.log(`[NET-${exp.expenseId}] 📊 BẮT ĐẦU TÍNH TOÁN:`, {
      expenseId: exp.expenseId,
      description: exp.description,
      amount: expAmount,
      paidByUserId,
      currentUserId,
      participants,
      type: expType,
    });

    const userParticipant = participants.find(
      (p) => String(p.user?.userId || p.userId) === String(currentUserId)
    );

    const isParticipant = !!userParticipant;

    console.log(`[NET-${exp.expenseId}] 👤 KIỂM TRA NGƯỜI DÙNG:`, {
      isParticipant,
      shareAmount: userParticipant?.shareAmount,
      userParticipant,
    });

    // 🧮 Logic tính toán
    if (paidByUserId === currentUserId) {
      // ✅ Người trả
      const totalShare = participants.reduce(
        (sum, p) => sum + (p.shareAmount || 0),
        0
      );
      console.log(
        `[NET-${exp.expenseId}] 💰 Bạn là NGƯỜI TRẢ — nhận lại toàn bộ:`,
        totalShare
      );
      return totalShare;
    }

    if (!isParticipant) {
      // 🚫 Không liên quan
      console.log(`[NET-${exp.expenseId}] 🚫 Bạn KHÔNG LIÊN QUAN — 0 VND`);
      return 0;
    }

    // 🧾 Người tham gia (không phải người trả)
    const userShare =
      userParticipant?.shareAmount ??
      (expType === "equal"
        ? Math.floor(expAmount / Math.max(participants.length, 1))
        : 0);

    const result = -userShare;
    console.log(
      `[NET-${exp.expenseId}] 💸 Bạn là NGƯỜI THAM GIA — phải trả:`,
      result
    );
    return result;
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

  // 🔸 Trả về debtDetails chi tiết (cho remind per expense)
  const getDebtors = () => {
    if (!currentUser) return [];

    const debtDetails = [];  // Array chi tiết {debtorId, fullName, amount, expenseId}

    expenses.forEach((exp) => {
      if (exp.paidBy?.userId === currentUser.userId) {
        exp.participants?.forEach((p) => {
          const userId = p.user?.userId || p.userId;
          if (userId === currentUser.userId) return;  // Bỏ chính bạn

          const amount = p.shareAmount || 0;
          if (amount > 0) {
            debtDetails.push({
              debtorId: userId,
              fullName: p.user?.fullName || "Người dùng",
              amount,
              expenseId: exp.expenseId,  // Lưu expenseId cho debt này
            });
          }
        });
      }
    });

    console.log("🔍 DEBUG DEBTORS:", debtDetails);  // Debug log
    return debtDetails;
  };

  const debtDetails = getDebtors();

  // 🔸 Gộp amount per debtor cho UI display (tổng nợ)
  const getGroupedDebtors = () => {
    const grouped = {};
    debtDetails.forEach((d) => {
      if (!grouped[d.debtorId]) {
        grouped[d.debtorId] = { 
          debtorId: d.debtorId,
          fullName: d.fullName,
          amount: 0,
        };
      }
      grouped[d.debtorId].amount += d.amount;
    });
    return Object.values(grouped);
  };

  const groupedDebtors = getGroupedDebtors();

  const handleRemindAll = async () => {
    console.log("🚀 BẮT ĐẦU NHẮC TẤT CẢ – expenseId (params):", expenseId, "debtDetails.length:", debtDetails.length);
    if (debtDetails.length === 0) {
      console.log("⚠️ Không có debt nào để nhắc.");
      return;
    }

    console.log("🧾 Tổng số debt details cần nhắc:", debtDetails.length);

    try {
      setReminding(true);
      let successCount = 0;
      const errors = [];

      for (const d of debtDetails) {
  console.log("➡️ Gọi API createDebtReminderGroup với:", {
    expenseId: d.expenseId,
    debtorName: d.fullName,
  });

  if (!d.expenseId) {
    console.warn("⚠️ Bỏ qua debt vì thiếu expenseId:", d);
    continue;
  }

  try {
    // ✅ chỉ truyền expenseId + currentUser.userId
    await expenseService.createDebtReminderGroup(d.expenseId, currentUser.userId);
    successCount++;
    console.log(`✅ Remind thành công cho ${d.fullName} (expense ${d.expenseId})`);
  } catch (singleErr) {
    console.error(`❌ Lỗi remind cho ${d.fullName} (expense ${d.expenseId}):`, singleErr);
    errors.push(singleErr.message || "Lỗi không rõ");
  }
}

      console.log(`🎉 Kết thúc: ${successCount}/${debtDetails.length} thành công`);
      if (successCount > 0) {
        setReminderSuccess(true);
        Alert.alert("Thành công", `Đã nhắc ${successCount} khoản nợ!`);
      } else if (errors.length > 0) {
        throw new Error(errors.join(', '));
      } else {
        throw new Error("Không có khoản nợ nào để nhắc");
      }
    } catch (err) {
      console.error("❌ Lỗi tổng khi nhắc tất cả:", err);
      Alert.alert("Lỗi", err.message || "Không thể nhắc nợ");
    } finally {
      setReminding(false);
    }
  };

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
        <TouchableOpacity
          onPress={() =>
            router.replace({
              pathname: `/chat/${groupId}`, 
            })
          }
          style={styles.headerBtn}
        >
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
          // ✅ TAB THANH TOÁN
          expenses.length === 0 ? (
            <Text style={{ textAlign: "center", marginTop: 20, color: "#777" }}>
              Chưa có khoản chi tiêu nào
            </Text>
          ) : (
            expenses.map((exp, index) => {
              const net = getNetAmount(exp);
              const paidByName = exp.paidBy?.fullName || "Ai đó";
              const paidText =
                exp.paidBy?.userId === currentUser?.userId ? "Bạn" : paidByName;
              const receiveText =
                net > 0
                  ? `Bạn sẽ nhận ${net.toLocaleString()} VND`
                  : net < 0
                  ? `Bạn phải trả ${Math.abs(net).toLocaleString()} VND`
                  : "0 VND";
              return (
                <TouchableOpacity
                  key={exp.expenseId || index}
                  onPress={() =>
                    router.push({
                      pathname: "/chat/info-split-bill-detail",
                      params: { expenseId: exp.expenseId, groupId: groupId },
                    })
                  }
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
          // ✅ TAB NHẮC NỢ
          <View style={{ padding: 16 }}>
            {reminderSuccess ? (
              // Sau khi nhắc thành công
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 80,
                }}
              >
                <View
                  style={{
                    borderWidth: 4,
                    borderColor: "#2ECC71",
                    borderRadius: 100,
                    padding: 20,
                    marginBottom: 20,
                  }}
                >
                  <Ionicons name="checkmark" size={64} color="#2ECC71" />
                </View>

                <Text
                  style={{ fontSize: 22, color: "#2ECC71", fontWeight: "bold" }}
                >
                  Đã nhắc thành công
                </Text>

                <TouchableOpacity
                  onPress={() => setReminderSuccess(false)}
                  style={{
                    marginTop: 24,
                    backgroundColor: "#2ECC71",
                    borderRadius: 10,
                    paddingVertical: 10,
                    paddingHorizontal: 24,
                  }}
                >
                  <Text style={{ color: "#fff", fontSize: 16 }}>Quay lại</Text>
                </TouchableOpacity>
              </View>
            ) : groupedDebtors.length === 0 ? (
              <Text style={{ textAlign: "center", color: "#555" }}>
                ✅ Hiện tại không có ai đang nợ bạn
              </Text>
            ) : (
              <>
                {groupedDebtors.map((d) => (
                  <View
                    key={d.debtorId}
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingVertical: 12,
                      borderBottomWidth: 1,
                      borderColor: "#eee",
                    }}
                  >
                    <Text style={{ fontSize: 16 }}>{d.fullName}</Text>
                    <View style={{ alignItems: "flex-end" }}>
                      <Text style={{ fontSize: 13, color: "#2ECC71" }}>
                        Phải trả bạn
                      </Text>
                      <Text
                        style={{
                          fontWeight: "bold",
                          color: "#2ECC71",
                          fontSize: 16,
                        }}
                      >
                        {d.amount.toLocaleString()} VND
                      </Text>
                    </View>
                  </View>
                ))}

                {/* ✅ Nút Nhắc tất cả */}
                <TouchableOpacity
                  onPress={handleRemindAll}
                  disabled={reminding}
                  style={{
                    backgroundColor: reminding ? "#aaa" : "#2ECC71",
                    borderRadius: 12,
                    paddingVertical: 14,
                    marginTop: 24,
                    alignItems: "center",
                  }}
                >
                  {reminding ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text
                      style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}
                    >
                      Nhắc tất cả
                    </Text>
                  )}
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
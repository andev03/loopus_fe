import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator } from "react-native";
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
  const [groupInfo, setGroupInfo] = useState(null); // <-- Added: store full group object
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
        console.log("⚠️ Skip fetch group: missing groupId or userId", { groupId, userId: currentUser?.userId });
        setGroupName(`Nhóm ${groupId?.slice(0, 6) || 'Unknown'}`); 
        setGroupLoading(false);
        return;
      }
      try {
        console.log("🔄 Fetching all groups for user:", currentUser.userId);
        const res = await groupService.getGroups(currentUser.userId);
        console.log("📦 All groups từ API:", res);
        if (res.success && res.data && Array.isArray(res.data.data)) {
          const targetGroup = res.data.data.find(g => g.id === groupId || g.groupId === groupId);
          if (targetGroup) {
            const name = targetGroup.groupName || targetGroup.name || targetGroup.title || targetGroup.group_name;
            setGroupInfo(targetGroup); // <-- store whole object
            if (name) {
              setGroupName(name);
              console.log("✅ Set group name:", name);
            } else {
              console.log("⚠️ No name field in targetGroup:", targetGroup);
              setGroupName(`Nhóm ${groupId.slice(0, 6)}`);
            }
          } else {
            console.log("⚠️ No group found with ID:", groupId);
            setGroupName(`Nhóm ${groupId.slice(0, 6)}`);
          }
        } else {
          console.log("⚠️ API fail or no data, fallback name");
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
        console.log("📦 Dữ liệu expense từ API:", res);
        console.log("🔍 Original amount từ param:", originalAmount);
        console.log("🔍 API amount cho expenseId", expenseId, ":", res.data?.find(e => e.expenseId === expenseId)?.amount);
        setExpenses(Array.isArray(res.data) ? res.data : []); 
      } catch (error) {
        console.error("❌ Lỗi khi load expense:", error);
        setExpenses([]); 
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, [groupId, expenseId, originalAmount]);

  const getReceiveAmount = (exp) => {
    if (!currentUser || !exp.paidBy || exp.paidBy.userId !== currentUser.userId) {
      return 0;
    }
    return (exp.participants || []).reduce((sum, p) => sum + (p.shareAmount || 0), 0); 
  };

  const getDisplayAmount = (exp) => {
    if (exp.expenseId === expenseId && originalAmount > 0) {
      return originalAmount;
    }
    return (exp.amount || 0); 
  };

  const totalReceive = expenses.reduce((sum, e) => sum + getReceiveAmount(e), 0);

  if (loading || groupLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#2ECC71" style={{ marginTop: 50 }} />
      </SafeAreaView>
    );
  }

  const displayGroupName = groupName || `Nhóm ${groupId?.slice(0, 6) || 'Unknown'}`; 

  // --- compute avatar source: ưu tiên groupInfo.avatarUrl (thử nhiều tên), fallback dicebear, fallback default
  const avatarCandidate =
    groupInfo?.avatarUrl ||
    groupInfo?.avatar ||
    groupInfo?.avatar_url ||
    null;

  const avatarSource = avatarCandidate && avatarCandidate.trim() !== ""
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
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.avatarBox}>
        <Image
          source={avatarSource}
          style={styles.avatar}
          // onError optional: fallback to DefaultAvatar if remote fails
          onError={() => { /* could set local state to fallback image if needed */ }}
        />
        <Text style={styles.groupName} numberOfLines={1}>
          {displayGroupName}
        </Text>
      </View>

      <Text style={styles.totalText}>
        Tổng cộng bạn sẽ nhận được{" "}
        <Text style={{ fontWeight: "bold", color: "#2ECC71" }}>
          {(totalReceive || 0).toLocaleString()} VND 
        </Text>
      </Text>

      <View style={styles.tabRow}>
        <Text style={[styles.tab, styles.tabActive]}>Thanh toán</Text>
        <Text style={styles.tab}>Nhắc nợ</Text>
      </View>

      <ScrollView style={styles.history}>
        {expenses.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 20, color: "#777" }}>
            Chưa có khoản chi tiêu nào
          </Text>
        ) : (
          expenses.map((exp, index) => ( 
            <View key={exp.expenseId || index} style={styles.paymentRow}> 
              <Ionicons name="cash-outline" size={22} color="#000" />
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.paymentTitle}>
                  {exp.description || "Không có mô tả"} 
                </Text>
                <Text style={styles.paymentSub}>
                  Bạn đã trả {(getDisplayAmount(exp) || 0).toLocaleString()} VND 
                </Text>
                <Text style={styles.paymentSub}>
                  Lúc {exp.createdAt ? new Date(exp.createdAt).toLocaleString("vi-VN") : "N/A"} 
                </Text>
              </View>
              <Text style={styles.paymentReceive}>
                Bạn sẽ nhận {(getReceiveAmount(exp) || 0).toLocaleString()} VND 
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

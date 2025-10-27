import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
  Modal,
  FlatList,
  ActivityIndicator,
  TextInput,
  Alert,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./HomeScreen.styles";
import { useRouter } from "expo-router";
import ChatModal from "../home/ChatModal";
import { notificationService } from "../../services/notificationService";
import { getUserId, getUser } from "../../services/storageService";
import { groupService } from "../../services/groupService";
import { expenseService } from "../../services/expenseService";
import { Link } from "expo-router";

const { width: screenWidth } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();
  const [chatVisible, setChatVisible] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  // ✅ States cho modal Thanh toán
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]); // ✅ Filtered cho search
  const [searchQuery, setSearchQuery] = useState(""); // ✅ Search query
  const [members, setMembers] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [debtModalVisible, setDebtModalVisible] = useState(false);
  const [debtList, setDebtList] = useState([]);
  const [filteredDebtList, setFilteredDebtList] = useState([]); // ✅ Filtered cho search debt
  const [searchDebtQuery, setSearchDebtQuery] = useState(""); // ✅ Search query debt
  const [loadingDebt, setLoadingDebt] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [loadingRemindAll, setLoadingRemindAll] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // ✅ NEW: States cho groups thật ở home
  const [recentGroups, setRecentGroups] = useState([]);
  const [filteredRecentGroups, setFilteredRecentGroups] = useState([]); // ✅ Filtered cho search groups home
  const [searchGroupsQuery, setSearchGroupsQuery] = useState(""); // ✅ Search query cho groups home
  const [loadingRecentGroups, setLoadingRecentGroups] = useState(false);

  // 🌀 Animation cho chuông
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const startShake = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: 1,
          duration: 100,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -1,
          duration: 100,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 100,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
      { iterations: 3 } // lắc 3 lần
    ).start();
  };

  useEffect(() => {
  const loadUser = async () => {
    try {
      const user = await getUser();
      setCurrentUser(user);
      setCurrentUserId(user?.userId);
    } catch (err) {
      console.error("Lỗi load user:", err);
    }
  };
  loadUser();
}, []);

  // 📨 Kiểm tra có thông báo chưa đọc để lắc chuông
  useEffect(() => {
    const checkNotifications = async () => {
      try {
        const userId = await getUserId();
        setCurrentUserId(userId); // ✅ Set current user ID
        if (!userId) return;
        const res = await notificationService.getNotifications(userId);
        const unread = res.data?.some((n) => !n.isRead);
        setHasUnread(unread);
        if (unread) startShake();
      } catch (err) {
        console.error("❌ Lỗi khi check thông báo:", err);
      }
    };

    checkNotifications();
  }, []);

  // ✅ Fetch recent groups thật cho home section (tất cả groups, không slice)
  useEffect(() => {
    const fetchRecentGroups = async () => {
      try {
        setLoadingRecentGroups(true);
        const userId = await getUserId();
        if (!userId) return;
        const res = await groupService.getGroups(userId);
        if (res.success && res.data?.data) {
          const allGroups = res.data.data;
          setRecentGroups(allGroups); // Lấy tất cả groups
          setFilteredRecentGroups(allGroups); // Set filtered ban đầu
        } else {
          setRecentGroups([]);
          setFilteredRecentGroups([]);
        }
      } catch (err) {
        console.error("❌ Lỗi khi fetch recent groups:", err);
        setRecentGroups([]);
        setFilteredRecentGroups([]);
      } finally {
        setLoadingRecentGroups(false);
      }
    };

    fetchRecentGroups();
  }, []);

  // ✅ Filter groups theo search (cho modal thanh toán)
  useEffect(() => {
    if (searchQuery === "") {
      setFilteredGroups(groups);
    } else {
      const filtered = groups.filter((group) =>
        (group.groupName || group.name || "").toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredGroups(filtered);
    }
  }, [searchQuery, groups]);

  // ✅ Filter debt theo search
  useEffect(() => {
    if (searchDebtQuery === "") {
      setFilteredDebtList(debtList);
    } else {
      const filtered = debtList.filter((debt) =>
        (debt.debtorName || "").toLowerCase().includes(searchDebtQuery.toLowerCase())
      );
      setFilteredDebtList(filtered);
    }
  }, [searchDebtQuery, debtList]);

  // ✅ Filter recent groups theo search home
  useEffect(() => {
    if (searchGroupsQuery === "") {
      setFilteredRecentGroups(recentGroups);
    } else {
      const filtered = recentGroups.filter((group) =>
        (group.groupName || group.name || "").toLowerCase().includes(searchGroupsQuery.toLowerCase())
      );
      setFilteredRecentGroups(filtered);
    }
  }, [searchGroupsQuery, recentGroups]);

  // ✅ Fetch groups khi mở modal
  const fetchGroups = async () => {
    try {
      setLoadingGroups(true);
      const userId = await getUserId();
      if (!userId) return;
      const res = await groupService.getGroups(userId);
      if (res.success && res.data?.data) {
        setGroups(res.data.data);
        setFilteredGroups(res.data.data);
      } else {
        console.log("❌ Không lấy được danh sách nhóm");
      }
    } catch (err) {
      console.error("❌ Lỗi khi fetch groups:", err);
    } finally {
      setLoadingGroups(false);
    }
  };

  // ✅ Fetch members khi chọn nhóm
  const fetchMembers = async (groupId) => {
  try {
    setLoadingMembers(true);
    const currentUserId = await getUserId();
    if (!currentUserId) return;

    // 1. Lấy danh sách thành viên nhóm
    const membersRes = await groupService.viewMembers(groupId);
    if (!membersRes.success || !membersRes.data?.data) {
      setMembers([]);
      return;
    }

    const rawMembers = membersRes.data.data;
    const membersWithDebt = [];

    // 2. Duyệt từng thành viên → lấy số tiền BẠN NỢ HỌ
    for (const member of rawMembers) {
      const user = member.user || member;
      const memberId = user.userId || user.id;

      // Bỏ qua chính mình
      if (memberId === currentUserId) continue;

      let debtAmount = 0;
      try {
        // API: getDebtReminder(creditorId, debtorId)
        // Ở đây: memberId là chủ nợ, currentUserId là con nợ → "bạn nợ member"
        const debtRes = await expenseService.getDebtReminder(memberId, currentUserId);

        if (debtRes?.data && Array.isArray(debtRes.data)) {
          const unpaid = debtRes.data.filter(d => !d.paid);
          debtAmount = unpaid.reduce((sum, d) => sum + (d.shareAmount || 0), 0);
        }
      } catch (err) {
        console.warn(`Không lấy được nợ với ${memberId}:`, err);
        debtAmount = 0;
      }

      membersWithDebt.push({
        ...user,
        userId: memberId,
        fullName: user.fullName || user.username,
        avatarUrl: user.avatarUrl,
        debtAmount, // Số tiền bạn nợ họ
      });
    }

    setMembers(membersWithDebt);
  } catch (err) {
    console.error("Lỗi khi fetch members + debt:", err);
    setMembers([]);
  } finally {
    setLoadingMembers(false);
  }
};

  // ✅ Xử lý chọn nhóm
  const handleSelectGroup = (group) => {
    // Nếu nhóm đang được chọn lại chính là nhóm đang mở → đóng lại
    if (selectedGroup && (selectedGroup.id || selectedGroup.groupId) === (group.id || group.groupId)) {
      setSelectedGroup(null);
      setMembers([]); // Ẩn danh sách thành viên
      return;
    }

    // Ngược lại → chọn nhóm mới và load member
    setSelectedGroup(group);
    fetchMembers(group.id || group.groupId);
  };

  const handleChatPress = () => {
  if (currentUser?.role === "MEMBER") {
    // MEMBER: mở chatbot
    setChatVisible(true);
  } else {
    // USER: hỏi mua premium
    Alert.alert(
      "Tính năng dành cho thành viên",
      "Chức năng Chat AI chỉ dành cho thành viên Loopus Premium. Bạn có muốn nâng cấp không?",
      [
        { text: "Không", style: "cancel" },
        {
          text: "Mua ngay",
          onPress: () => {
            router.push("account/premium");
          },
        },
      ]
    );
  }
};

  // ✅ Xử lý chọn thành viên để thanh toán
  const handleSelectMember = (member) => {
    const user = member.user || member; // Fallback nếu cấu trúc khác
    router.push({
      pathname: "/chat/member-debt-detail",
      params: {
        payerId: user.userId,
        groupId: selectedGroup.id || selectedGroup.groupId,
        payerName: user.fullName || user.username,
        payerAvatar: user.avatarUrl,
      },
    });
    closePaymentModal();
  };

  // ✅ Đóng modal thanh toán
  const closePaymentModal = () => {
    setPaymentModalVisible(false);
    setSelectedGroup(null);
    setMembers([]);
    setSearchQuery(""); // ✅ Clear search khi đóng
  };

  // ✅ Đóng modal nhắc nợ
  const closeDebtModal = () => {
    setDebtModalVisible(false);
    setFilteredDebtList([]);
    setSearchDebtQuery(""); // ✅ Clear search khi đóng
  };

  // ✅ Render item nhóm (cho modal)
  const renderGroupItem = ({ item }) => (
    <TouchableOpacity
      style={styles.groupModalItem}
      onPress={() => handleSelectGroup(item)}
    >
      <Image
        source={{
          uri: item.avatarUrl || `https://api.dicebear.com/7.x/identicon/png?seed=${item.id}`,
        }}
        style={styles.groupModalAvatar}
      />
      <Text style={styles.groupModalName}>{item.groupName || item.name || "Nhóm không tên"}</Text>
      {selectedGroup && (selectedGroup.id === item.id || selectedGroup.groupId === item.groupId) ? (
        <Ionicons name="chevron-up" size={20} color="#2ECC71" />
      ) : (
        <Ionicons name="chevron-down" size={20} color="#999" />
      )}
    </TouchableOpacity>
  );

  // ✅ Render item thành viên (ẩn current user)
  const renderMemberItem = ({ item }) => {
  if (item.userId === currentUserId) return null;

  const hasDebt = item.debtAmount > 0;

  return (
    <TouchableOpacity
      style={styles.memberModalItem}
      onPress={() => handleSelectMember(item)}
    >
      <Image
        source={{
          uri: item.avatarUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
        }}
        style={styles.memberModalAvatar}
      />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.memberModalName}>
          {item.fullName || "Không tên"}
        </Text>
        {hasDebt ? (
          <Text style={{ color: "#E74C3C", fontSize: 13, fontWeight: "600" }}>
            Bạn nợ: {item.debtAmount.toLocaleString()}₫
          </Text>
        ) : (
          <Text style={{ color: "#aaa", fontSize: 12 }}>Bạn không nợ</Text>
        )}
      </View>
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );
};

  const renderRecentGroupItem = ({ item }) => {
    const params = {
      groupId: item.id || item.groupId,
      groupName: item.groupName || item.name,
      avatarUrl: item.avatarUrl,
    };

    // 👈 Thêm log params truyền đi
    console.log("📤 Truyền params đến /group/camera:", params);

    return (
      <TouchableOpacity
        style={[styles.groupBox, { width: (screenWidth - 48) / 4 }]} // ✅ Fixed width để hiển thị đúng 4 nhóm (paddingHorizontal 16*2=32 + margin giữa items ~16)
        onPress={() => router.push({
          pathname: "/group/camera",
          params, // Sử dụng biến để dễ log
        })}
      >
        <Image
          source={{
            uri: item.avatarUrl || `https://api.dicebear.com/7.x/identicon/png?seed=${item.id}`,
          }}
          style={styles.groupImage}
        />
        <Text style={{ textAlign: 'center', marginTop: 8 }}>{item.groupName || item.name || "Nhóm không tên"}</Text>
      </TouchableOpacity>
    );
  };

  const fetchAllDebtReminders = async () => {
    try {
      setLoadingDebt(true);
      const userId = await getUserId();
      if (!userId) return;

      const res = await expenseService.getAllDebtReminders(userId);
      console.log("✅ Danh sách nhắc nợ:", res);

      let rawData;
      if (res?.data && Array.isArray(res.data)) {
        rawData = res.data;
      } else if (res?.data?.data) {
        rawData = res.data.data;
      } else {
        rawData = [];
      }

      // ✅ Filter chỉ lấy những người còn nợ (totalOwedAmount > 0 và allPaid === false)
      const filteredData = rawData.filter(item => (item.totalOwedAmount || 0) > 0 && !item.allPaid);

      setDebtList(filteredData);
      setFilteredDebtList(filteredData); // ✅ Set filtered
    } catch (error) {
      console.error("❌ Lỗi khi lấy danh sách nhắc nợ:", error);
      setDebtList([]);
      setFilteredDebtList([]);
    } finally {
      setLoadingDebt(false);
    }
  };

  const handleRemindAll = async () => {
    try {
      setLoadingRemindAll(true);
      const userId = await getUserId();
      if (!userId) return;

      const res = await expenseService.createAllDebtReminders(userId);
      console.log("✅ Nhắc tất cả thành công:", res);

      // Hiện popup thành công
      setSuccessVisible(true);
      // Tự tắt sau 2 giây
      setTimeout(() => setSuccessVisible(false), 2000);
    } catch (error) {
      console.error("❌ Lỗi khi nhắc tất cả:", error);
      Alert.alert("Lỗi", error.message || "Không thể nhắc tất cả");
    } finally {
      setLoadingRemindAll(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <SafeAreaView edges={["top"]} style={{ backgroundColor: "#b4f1d3" }}>
          <View style={styles.header}>
            {/* Logo ở giữa */}
            <Text style={styles.logo}>LOOPUS</Text>

            {/* Icon chuông bên phải (có hiệu ứng lắc) */}
            <TouchableOpacity
              onPress={() => router.push("/notification/notifications")}
            >
              <Animated.View
                style={{
                  transform: [
                    {
                      rotate: shakeAnim.interpolate({
                        inputRange: [-1, 1],
                        outputRange: ["-10deg", "10deg"],
                      }),
                    },
                  ],
                }}
              >
                <Ionicons
                  name="notifications-outline"
                  size={24}
                  color={hasUnread ? "#ff4444" : "black"}
                />
              </Animated.View>
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        {/* Groups sections */}
        <View style={styles.groupsSection}>
          <View style={styles.groups}>
            {loadingRecentGroups ? (
              <ActivityIndicator size="large" color="#2ECC71" style={{ margin: 20 }} />
            ) : recentGroups.length > 0 ? (
              <View>
                {/* ✅ Thanh search nếu có ít nhất 1 nhóm */}
                <TextInput
                  style={styles.searchInput}
                  placeholder="Tìm nhóm..."
                  value={searchGroupsQuery}
                  onChangeText={setSearchGroupsQuery}
                  placeholderTextColor="#999"
                />
                <FlatList
                  data={filteredRecentGroups}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item) => item.id?.toString() || item.groupId?.toString()}
                  ItemSeparatorComponent={() => <View style={{ width: 16 }} />} // ✅ Thêm margin giữa các item để spacing đẹp
                  renderItem={renderRecentGroupItem}
                />
              </View>
            ) : (
              <Text style={{ textAlign: 'center', color: '#888' }}>Chưa có nhóm nào</Text>
            )}
          </View>

      

          {/* Nhắc nợ & Chia tiền */}
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={[styles.actionItem, styles.leftItem]}
              onPress={() => {
                fetchAllDebtReminders();
                setDebtModalVisible(true);
              }}
            >
              <Ionicons name="notifications-circle-outline" size={28} color="#555" />
              <Text style={styles.actionText}>Nhắc nợ</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionItem, styles.rightItem]}
              onPress={() => {
                fetchGroups(); // Fetch groups khi mở modal
                setPaymentModalVisible(true);
              }}
            >
              <Ionicons name="cash-outline" size={28} color="#555" />
              <Text style={styles.actionText}>Thanh toán</Text>
            </TouchableOpacity>
          </View>
        </View>



        {/* Các section khác giữ nguyên */}
        <Text style={styles.sectionTitle}>Du lịch</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.dealRow}
        >
          <ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  style={styles.dealRow}
>
  <TouchableOpacity style={styles.travelCard}>
    <Image
      source={require('../../assets/images/dulich1.jpg')}
      style={styles.travelImage}
    />
    <View style={styles.overlay}>
      <Text style={styles.overlayText}>Xem ngay</Text>
    </View>
  </TouchableOpacity>

  <TouchableOpacity style={styles.travelCard}>
    <Image
      source={require('../../assets/images/dulich2.jpg')}
      style={styles.travelImage}
    />
    <View style={styles.overlay}>
      <Text style={styles.overlayText}>Xem ngay</Text>
    </View>
  </TouchableOpacity>
</ScrollView>
        </ScrollView>

        <Text style={styles.sectionTitle}>Deal đỉnh</Text>
<ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  style={styles.dealRow}
>
  <TouchableOpacity key="dealh1" style={styles.dealCard}>
    <Image
      source={require('../../assets/images/dealdinh1.jpg')}
      style={styles.dealImageFull}
    />
  </TouchableOpacity>
  <TouchableOpacity key="dealh2" style={styles.dealCard}>
    <Image
      source={require('../../assets/images/dealdinh2.jpg')}
      style={styles.dealImageFull}
    />
  </TouchableOpacity>
  <TouchableOpacity key="dealh3" style={styles.dealCard}>
    <Image
      source={require('../../assets/images/dealdinh3.jpg')}
      style={styles.dealImageFull}
    />
  </TouchableOpacity>
</ScrollView>
      </ScrollView>

      {/* FAB Chatbot - luôn hiện, nhưng USER bị chặn */}
<TouchableOpacity
  style={styles.chatFAB}
  onPress={handleChatPress}
  activeOpacity={0.7}
>
  <Ionicons name="chatbubble-outline" size={24} color="#fff" />
</TouchableOpacity> 

      {/* Modal Chatbot - chỉ hiện khi MEMBER mở */}
{currentUser?.role === "MEMBER" && (
  <ChatModal visible={chatVisible} onClose={() => setChatVisible(false)} />
)}

      {/* ✅ Modal Thanh toán */}
      <Modal
        visible={paymentModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closePaymentModal}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
          {/* Header modal với search */}
          <View style={{ padding: 16, borderBottomWidth: 1, borderColor: "#eee" }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12 }}>Thanh toán</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm nhóm..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#999"
            />
            <TouchableOpacity onPress={closePaymentModal} style={{ alignSelf: "flex-end", marginTop: 8 }}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={{ flex: 1 }}>
            {loadingGroups ? (
              <ActivityIndicator size="large" color="#2ECC71" style={{ marginTop: 50 }} />
            ) : (
              <FlatList
                data={filteredGroups}
                keyExtractor={(item) => item.id?.toString() || item.groupId?.toString()}
                renderItem={renderGroupItem}
                style={{ padding: 16 }}
                ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 50, color: "#888" }}>Không có nhóm nào phù hợp</Text>}
              />
            )}
            {selectedGroup && (
              <View style={{ padding: 16, borderTopWidth: 1, borderColor: "#eee" }}>
                <TouchableOpacity
                  style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}
                  onPress={() => setSelectedGroup(null)}
                >
                  <Ionicons name="chevron-up" size={20} color="#2ECC71" />
                  <Text style={{ marginLeft: 8, fontSize: 16, fontWeight: "500" }}>
                    {selectedGroup.groupName || selectedGroup.name} ({members.filter(m => (m.user?.userId || m.userId) !== currentUserId).length} thành viên)
                  </Text>
                </TouchableOpacity>
                {loadingMembers ? (
                  <View style={{ height: 180, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="small" color="#2ECC71" />
                  </View>
                ) : (
                  <FlatList
                    data={members.filter(m => (m.user?.userId || m.userId) !== currentUserId)} // ✅ Filter ẩn current user
                    keyExtractor={(item) => (item.user?.userId || item.userId)?.toString()}
                    ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                    renderItem={renderMemberItem}
                    style={{ height: 180 }}
                    ListEmptyComponent={<Text style={{ textAlign: "center", color: "#888", marginTop: 70 }}>Không có thành viên</Text>}
                  />
                )}
              </View>
            )}
          </View>
        </SafeAreaView>
      </Modal>
      <Modal
        visible={debtModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeDebtModal}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
          <View style={{ padding: 16, borderBottomWidth: 1, borderColor: "#eee" }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12 }}>Nhắc nợ</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm người nợ..."
              value={searchDebtQuery}
              onChangeText={setSearchDebtQuery}
              placeholderTextColor="#999"
            />
            <TouchableOpacity onPress={closeDebtModal} style={{ alignSelf: "flex-end", marginTop: 8 }}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={{ flex: 1 }}>
            {loadingDebt ? (
              <ActivityIndicator size="large" color="#2ECC71" style={{ marginTop: 50 }} />
            ) : (
              <FlatList
                data={filteredDebtList}
                keyExtractor={(item, index) => item.debtorId || index.toString()}
                renderItem={({ item }) => (
                  <View style={styles.memberModalItem}>
                    <Image
                      source={{
                        uri: item.avatarUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
                      }}
                      style={styles.memberModalAvatar}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.memberModalName}>{item.debtorName}</Text>
                      <Text style={{ color: "#555", fontSize: 14 }}>Nợ: {item.totalOwedAmount?.toLocaleString("vi-VN") || 0}₫</Text>
                    </View>
                  </View>
                )}
                style={{ padding: 16 }}
                ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 50, color: "#888" }}>Không có ai đang nợ bạn</Text>}
              />
            )}
          </View>

          <View
            style={{
              padding: 16,
              borderTopWidth: 1,
              borderColor: "#eee",
              backgroundColor: "#fff",
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "#2ECC71",
                paddingVertical: 12,
                borderRadius: 10,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
              }}
              onPress={handleRemindAll}
              disabled={loadingRemindAll}
            >
              {loadingRemindAll ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="notifications-outline" size={20} color="#fff" />
                  <Text style={{ color: "#fff", fontWeight: "bold", marginLeft: 8 }}>
                    Nhắc tất cả
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          <Modal
            visible={successVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setSuccessVisible(false)}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.3)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 16,
                  padding: 24,
                  alignItems: "center",
                  width: 160,
                }}
              >
                <View
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: 35,
                    backgroundColor: "#b2f1c9",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 12,
                  }}
                >
                  <Ionicons name="checkmark" size={40} color="#2ECC71" />
                </View>
                <Text style={{ color: "#2ECC71", fontWeight: "bold", textAlign: "center" }}>
                  Đã nhắc thành công
                </Text>
              </View>
            </View>
          </Modal>
        </SafeAreaView>
      </Modal>
    </View>
  );
}
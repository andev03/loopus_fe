import {View,Text,TouchableOpacity, FlatList, TextInput, KeyboardAvoidingView, Platform, Image, Alert,} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect, useCallback, useRef } from "react";  // ✅ Thêm useRef
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "./ChatDetailScreen.styles";
import * as ImagePicker from "expo-image-picker";
import { chatService } from "../../../services/chatService";
import { getUser } from "../../../services/storageService";
import { Modal } from "react-native";
import { eventService } from "../../../services/eventService";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { pollService } from "../../../services/pollService";

export default function ChatDetailScreen() {
  const { id: groupId, newReminder, poll: newPoll, searchMode } = useLocalSearchParams();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [voteModalVisible, setVoteModalVisible] = useState(false);
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [newOption, setNewOption] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(searchMode || false);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventModalVisible, setEventModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [longPressedEvent, setLongPressedEvent] = useState(null);
  const [eventStatuses, setEventStatuses] = useState({});
  const flatListRef = useRef(null);  // ✅ Ref cho FlatList
  
  // ✅ STATE MỚI CHO PARTICIPANTS MODAL
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [participants, setParticipants] = useState({
    accepted: [],
    declined: [],
    pending: []
  });
  const [loadingParticipants, setLoadingParticipants] = useState(false);

 useEffect(() => {
  const fetchChats = async () => {
    try {
      const u = await getUser();
      setUser(u);
      if (!groupId || groupId.length < 20) {
        console.log("❌ groupId không hợp lệ:", groupId);
        setLoading(false);
        return;
      }
      console.log("✅ Received groupId:", groupId, "userId:", u.userId);
      
      const cachedMessages = await AsyncStorage.getItem(`messages_${groupId}`);
      if (cachedMessages) {
        const parsed = JSON.parse(cachedMessages);
        const normalized = parsed.map((msg) => {
          if (msg.type === "poll") {
            return {
              ...msg,
              options: (msg.options || []).map((o) => ({
                optionId: o.optionId || o.id || o._id,
                text: o.optionText || o.text || o.name || "Không tên",
                votes: Array.isArray(o.votes) ? o.votes : [],
              })),
            };
          }
          return msg;
        });
        setMessages(normalized);
      }
      
      const res = await chatService.getChatsByGroup(groupId, u.userId);
      if (res.success) {
        if (res.data.length > 0) {
          const mapped = res.data.map((m) => ({ ...m, isCurrentUser: m.sender === "Bạn" }));
          setMessages((prev) => {
            const merged = [...mapped, ...prev].reduce((acc, msg) => {
              if (!acc.some((m) => m.id === msg.id)) acc.push(msg);
              return acc;
            }, []);
            return merged;
          });
        } else {
          console.log("Không tìm thấy tin nhắn, giữ nguyên tin nhắn hiện tại");
        }
      } else {
        console.log("Lỗi API:", res.message);
      }
    } catch (err) {
      console.log("❌ Lỗi fetch chats:", err);
    } finally {
      setLoading(false);
    }
  };
  fetchChats();
}, [groupId]);

  useEffect(() => {
    if (newReminder) {
      try {
        const reminder = JSON.parse(newReminder);
        setMessages((prev) => {
          if (prev.some((msg) => msg.id === reminder.id)) {
            return prev;
          }
          const updated = [...prev, reminder];
          AsyncStorage.setItem(`messages_${groupId}`, JSON.stringify(updated));
          return updated;
        });
        // ✅ REFETCH EVENTS SAU KHI ADD MỚI ĐỂ SYNC NGAY LẬP TỨC
        fetchEvents();
      } catch (err) {
        console.log("❌ Parse reminder error:", err);
      }
    }
  }, [newReminder, groupId]);  // Giữ nguyên dependency

  useEffect(() => {
    if (newPoll) {
      const poll = JSON.parse(newPoll);
      poll.id = String(poll.id || poll.pollId);
      poll.type = "poll";
      poll.title = poll.name || poll.title || poll.question || poll.content || poll.pollName || "Cuộc bình chọn";
      if (poll.options && Array.isArray(poll.options)) {
  poll.options = (poll.options || []).map((o, i) => {
  console.log("🧩 [NEW POLL] Option raw:", o);
  return {
    optionId: o.optionId || o.id || o._id || o.option?.optionId || `temp-${i}`,
    text: o.optionText || o.text || o.name || "Không tên",
    votes: Array.isArray(o.votes) ? o.votes : [],
  };
});
}
      poll.sender = poll.createdBy?.fullName || poll.creator?.fullName || "Thành viên";
      poll.senderId = poll.createdBy?.userId || poll.creator?.userId;
      poll.avatarUrl = poll.createdBy?.avatarUrl || poll.creator?.avatarUrl || "https://via.placeholder.com/150";
      poll.time = new Date(poll.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      poll.isCurrentUser = user?.userId === (poll.createdBy?.userId || poll.creator?.userId);
      setMessages((prev) => {
        if (prev.some((msg) => String(msg.id) === poll.id)) return prev;
        const updated = [...prev, poll];
        AsyncStorage.setItem(`messages_${groupId}`, JSON.stringify(updated));
        return updated;
      });
    }
  }, [newPoll, groupId]);

  // ✅ EXTRACT fetchEvents THÀNH HÀM RIÊNG ĐỂ GỌI TỪ NHIỀU NƠI
  const fetchEvents = useCallback(async () => {
    if (!groupId) return;
    try {
      const res = await eventService.getGroupEvents(groupId);
      if (res.success && res.data.length > 0) {
        const events = res.data.map((e) => ({
          id: e.eventId,
          type: "reminder",
          content: e.title,
          date: `${e.eventDate}T${e.eventTime}`,
          repeat: e.repeatType,
          sender: e.creator?.fullName || "Thành viên",
          senderId: e.creator?.userId,
          avatarUrl: e.creator?.avatarUrl || "https://via.placeholder.com/150",
          time: e.eventTime,
          isCurrentUser: user?.userId === e.creator?.userId,
        }));
        setMessages((prev) => {
          const merged = [...prev, ...events].reduce((acc, msg) => {
            if (!acc.some((m) => m.id === msg.id)) acc.push(msg);
            return acc;
          }, []);
          return merged;
        });
      }
    } catch (err) {
      console.log("❌ Lỗi load nhắc hẹn:", err);
    }
  }, [groupId, user?.userId]);  // Dependency cho userId để check isCurrentUser

  // ✅ useEffect CHO fetchEvents, DÙNG fetchEvents LÀM DEPENDENCY
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

useEffect(() => {
  const fetchPolls = async () => {
    if (!groupId || !user) return;
    
    try {
      const cachedMessages = await AsyncStorage.getItem(`messages_${groupId}`);
      if (cachedMessages) {
        const parsed = JSON.parse(cachedMessages);
        const withoutPolls = parsed.filter(m => m.type !== "poll");
        await AsyncStorage.setItem(`messages_${groupId}`, JSON.stringify(withoutPolls));
        setMessages(withoutPolls);
      }
      
      const res = await pollService.getPolls(groupId);
      console.log("📥 Polls API response:", res);

      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        const polls = res.data.map((p) => {
          console.log("🔎 Raw poll:", p);

          return {
            id: String(p.id || p.pollId),
            type: "poll",
            title: p.name || p.title || p.question || p.content || p.pollName || "Cuộc bình chọn",
            options: (p.options || []).map((o, index) => {
              console.log(`   🔎 Raw option ${index}:`, o);
              
              const optionId = o.optionId || o.id || o._id;
              if (!optionId) {
                console.error(`❌ Option ${index} không có optionId!`, o);
              }
              
              return {
                optionId: optionId,
                text: o.optionText || o.text || o.name || "Không tên",
                votes: Array.isArray(o.votes) ? o.votes : [],
              };
            }),
            sender: p.createdBy?.fullName || p.creator?.fullName || "Thành viên",
            senderId: p.createdBy?.userId || p.creator?.userId,
            avatarUrl: p.createdBy?.avatarUrl || p.creator?.avatarUrl || "https://via.placeholder.com/150",
            time: new Date(p.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            isCurrentUser: user?.userId === (p.createdBy?.userId || p.creator?.userId),
          };
        });

        setMessages((prev) => {
          const withoutPolls = prev.filter(m => m.type !== "poll");
          const merged = [...withoutPolls, ...polls];
          AsyncStorage.setItem(`messages_${groupId}`, JSON.stringify(merged));
          return merged;
        });
      }
    } catch (err) {
      console.log("❌ Lỗi load polls:", err);
    }
  };
  
  fetchPolls();
}, [groupId, user]);

  // ✅ useEffect để scroll xuống dưới cùng khi có tin nhắn mới (chỉ khi không search và không loading)
  useEffect(() => {
    if (!loading && !isSearchMode && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length, loading, isSearchMode]);

  // ✅ HÀM FETCH PARTICIPANTS (giữ nguyên)
  const fetchEventParticipants = async (eventId) => {
    setLoadingParticipants(true);
    try {
      const allRes = await eventService.getEventParticipants(eventId, null);
      const acceptedRes = await eventService.getEventParticipants(eventId, "ACCEPTED");
      const declinedRes = await eventService.getEventParticipants(eventId, "DECLINED");

      console.log("📊 All participants:", allRes);
      console.log("✅ Accepted:", acceptedRes);
      console.log("❌ Declined:", declinedRes);

      let acceptedUsers = acceptedRes.success ? acceptedRes.data : [];
      let declinedUsers = declinedRes.success ? declinedRes.data : [];
      let allUsers = allRes.success ? allRes.data : [];

      // ✅ DEDUPLICATE ARRAYS BY USER ID
      const getUserId = (u) => u.userId || u.user?.userId;
      
      const uniqueAccepted = acceptedUsers.filter((user, index, self) => 
        index === self.findIndex(u => getUserId(u) === getUserId(user))
      );
      
      const uniqueDeclined = declinedUsers.filter((user, index, self) => 
        index === self.findIndex(u => getUserId(u) === getUserId(user))
      );
      
      const uniqueAll = allUsers.filter((user, index, self) => 
        index === self.findIndex(u => getUserId(u) === getUserId(user))
      );

      const acceptedIds = uniqueAccepted.map(getUserId);
      const declinedIds = uniqueDeclined.map(getUserId);
      const pendingUsers = uniqueAll.filter(u => {
        const userId = getUserId(u);
        return !acceptedIds.includes(userId) && !declinedIds.includes(userId);
      });

      setParticipants({
        accepted: uniqueAccepted,
        declined: uniqueDeclined,
        pending: pendingUsers
      });
    } catch (err) {
      console.log("❌ Lỗi fetch participants:", err);
      Alert.alert("Lỗi", "Không thể lấy danh sách người tham gia");
    } finally {
      setLoadingParticipants(false);
    }
  };

  // ✅ COMPONENT PARTICIPANTS LIST (giữ nguyên)
  const ParticipantsList = () => {
    if (loadingParticipants) {
      return <Text style={styles.eventModalText}>Đang tải...</Text>;
    }

    return (
      <View style={{ marginVertical: 15 }}>
        {/* Đã chấp nhận */}
        <View style={{ marginBottom: 15 }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
            <Ionicons name="checkmark-circle" size={20} color="#2ECC71" />
            <Text style={[styles.eventModalText, { fontWeight: "bold", marginLeft: 5 }]}>
              Tham gia ({participants.accepted.length})
            </Text>
          </View>
          {participants.accepted.length === 0 ? (
            <Text style={[styles.eventModalText, { color: "#999", fontSize: 14 }]}>
              Chưa có ai chấp nhận
            </Text>
          ) : (
            participants.accepted.map((user, idx) => {
              const userId = user.userId || user.user?.userId;
              return (
                <View key={userId || idx} style={styles.participantRow}>
                  <Image
                    source={
                      user.avatarUrl || user.user?.avatarUrl
                        ? { uri: user.avatarUrl || user.user?.avatarUrl }
                        : require("../../../assets/images/default-avatar.jpg")
                    }
                    style={styles.participantAvatar}
                  />
                  <Text style={styles.participantName}>
                    {user.fullName || user.user?.fullName || "Không rõ tên"}
                  </Text>
                </View>
              );
            })
          )}
        </View>

        {/* Đã từ chối */}
        <View style={{ marginBottom: 15 }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
            <Ionicons name="close-circle" size={20} color="#E74C3C" />
            <Text style={[styles.eventModalText, { fontWeight: "bold", marginLeft: 5 }]}>
              Từ chối ({participants.declined.length})
            </Text>
          </View>
          {participants.declined.length === 0 ? (
            <Text style={[styles.eventModalText, { color: "#999", fontSize: 14 }]}>
              Chưa có ai từ chối
            </Text>
          ) : (
            participants.declined.map((user, idx) => {
              const userId = user.userId || user.user?.userId;
              return (
                <View key={userId || idx} style={styles.participantRow}>
                  <Image
                    source={
                      user.avatarUrl || user.user?.avatarUrl
                        ? { uri: user.avatarUrl || user.user?.avatarUrl }
                        : require("../../../assets/images/default-avatar.jpg")
                    }
                    style={styles.participantAvatar}
                  />
                  <Text style={styles.participantName}>
                    {user.fullName || user.user?.fullName || "Không rõ tên"}
                  </Text>
                </View>
              );
            })
          )}
        </View>

        {/* Chưa phản hồi */}
        <View>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
            <Ionicons name="help-circle" size={20} color="#95A5A6" />
            <Text style={[styles.eventModalText, { fontWeight: "bold", marginLeft: 5 }]}>
              Chưa phản hồi ({participants.pending.length})
            </Text>
          </View>
          {participants.pending.length === 0 ? (
            <Text style={[styles.eventModalText, { color: "#999", fontSize: 14 }]}>
              Tất cả đã phản hồi
            </Text>
          ) : (
            participants.pending.map((user, idx) => {
              const userId = user.userId || user.user?.userId;
              return (
                <View key={userId || idx} style={styles.participantRow}>
                  <Image
                    source={
                      user.avatarUrl || user.user?.avatarUrl
                        ? { uri: user.avatarUrl || user.user?.avatarUrl }
                        : require("../../../assets/images/default-avatar.jpg")
                    }
                    style={styles.participantAvatar}
                  />
                  <Text style={styles.participantName}>
                    {user.fullName || user.user?.fullName || "Không rõ tên"}
                  </Text>
                </View>
              );
            })
          )}
        </View>
      </View>
    );
  };

  const handleSearch = async (keyword) => {
    if (!keyword.trim()) {
      setSearchResults([]);
      return;
    }
    const res = await chatService.searchChats(groupId, keyword);
    if (res.success) {
      const lowerKeyword = keyword.toLowerCase();
      const filtered = res.data.filter((msg) => (msg.text || msg.message || "").toLowerCase().includes(lowerKeyword));
      setSearchResults(filtered);
    }
  };

  const handleSendImage = async (image) => {
    if (!image || !user) return;
    const result = await chatService.sendImageMessage(groupId, user.userId, image);
    if (result.success) {
      const m = result.data;
      const newMsg = {
        id: m.chatId,
        sender: m.senderName || "Bạn",
        text: m.message,
        avatar: m.avatarUrl || "https://via.placeholder.com/150",
        time: new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        imageUrl: m.imageUrl,
        type: m.type?.toLowerCase() || "image",
        isCurrentUser: true,
      };
      setMessages((prev) => [newMsg, ...prev]);
      setSelectedImage(null);
    } else {
      Alert.alert("Lỗi gửi ảnh", result.error?.message || "Không gửi được ảnh");
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 1 });
    if (!result.canceled) {
      const image = result.assets[0];
      setSelectedImage(image);
      handleSendImage(image);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim() || !user || !groupId) return;
    const text = inputText.trim();
    const res = await chatService.sendMessage(groupId, user.userId, text);
    if (res.success && res.data) {
      const newMsg = { ...res.data, isCurrentUser: true };
      setMessages((prev) => {
        const updated = [...prev, newMsg];
        AsyncStorage.setItem(`messages_${groupId}`, JSON.stringify(updated));
        return updated;
      });
      setInputText("");
    }
  };

  const handleDeleteEvent = async (eventId) => {
    Alert.alert("Xóa nhắc hẹn", "Bạn có chắc chắn muốn xóa sự kiện này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            const res = await eventService.deleteEvent(eventId);
            if (res.success) {
              setMessages((prev) => prev.filter((m) => m.id !== eventId));
              await AsyncStorage.setItem(`messages_${groupId}`, JSON.stringify(messages.filter((m) => m.id !== eventId)));
              setEventStatuses(prev => {
                const newStatuses = { ...prev };
                delete newStatuses[eventId];
                return newStatuses;
              });
              // ✅ REFETCH SAU KHI XÓA ĐỂ SYNC
              fetchEvents();
              Alert.alert("Thành công", "Đã xóa nhắc hẹn");
              setLongPressedEvent(null);
            } else {
              Alert.alert("Lỗi", res.message);
            }
          } catch (err) {
            console.log("🔥 Lỗi khi xóa sự kiện:", err);
            Alert.alert("Lỗi", "Không thể xóa sự kiện");
          }
        },
      },
    ]);
  };

  const handleDeletePoll = async (pollId) => {
  Alert.alert("Xóa bình chọn", "Bạn có chắc chắn muốn xóa poll này?", [
    { text: "Hủy", style: "cancel" },
    {
      text: "Xóa",
      style: "destructive",
      onPress: async () => {
        try {
          const res = await pollService.deletePoll(pollId);
          if (res.success) {
            setMessages((prev) => prev.filter((m) => String(m.id) !== String(pollId)));
            await AsyncStorage.setItem(
              `messages_${groupId}`,
              JSON.stringify(messages.filter((m) => String(m.id) !== String(pollId)))
            );
            Alert.alert("Thành công", "Đã xóa poll");
          } else {
            Alert.alert("Lỗi", res.message);
          }
        } catch (err) {
          console.log("🔥 Lỗi khi xóa poll:", err);
          Alert.alert("Lỗi", "Không thể xóa poll");
        }
      },
    },
  ]);
};

  const renderMessage = ({ item }) => {
    if (item.type === "reminder") {
      const eventDate = new Date(item.date);
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={async () => {
            const localEvent = messages.find((m) => String(m.id) === String(item.id));
            if (localEvent) {
              setSelectedEvent({
                eventId: localEvent.id,
                title: localEvent.content,
                eventDate: localEvent.date.split("T")[0],
                eventTime: localEvent.date.split("T")[1],
                repeatType: localEvent.repeat,
                creator: { fullName: localEvent.sender, userId: localEvent.senderId },
              });
              setEventModalVisible(true);
              return;
            }
            try {
              const res = await eventService.getEventDetail(item.id);
              if (res.success) {
                setSelectedEvent(res.data);
                setEventModalVisible(true);
              } else {
                alert(res.message);
              }
            } catch (err) {
              console.log("❌ Lỗi lấy chi tiết sự kiện:", err);
              alert("Không thể lấy chi tiết sự kiện");
            }
          }}
          onLongPress={() => { setLongPressedEvent(item.id); }}
        >
          <View style={styles.eventCard}>
            {longPressedEvent === item.id && (<TouchableOpacity style={{ position: "absolute", top: 10, right: 10 }} onPress={() => handleDeleteEvent(item.id)}><Ionicons name="trash" size={22} color="red" /></TouchableOpacity>)}
            <View style={styles.pollHeaderRow}>
              <Image source={item.avatarUrl ? { uri: item.avatarUrl } : require("../../../assets/images/default-avatar.jpg")} style={styles.avatar} />
              <Text style={styles.pollHeader}>{item.sender || "Bạn"} đã tạo một cuộc hẹn</Text>
            </View>
            <View style={styles.eventBody}>
              <View style={styles.eventDate}>
                <Text style={styles.eventDay}>THG {eventDate.getMonth() + 1}</Text>
                <Text style={styles.eventDateNumber}>{eventDate.getDate()}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.eventTitle}>{item.content}</Text>
                <Text style={styles.eventTime}>{eventDate.toLocaleDateString("vi-VN", { weekday: "short", day: "numeric", month: "numeric" })}</Text>
                <Text style={styles.eventTime}>Lúc {eventDate.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    }

  if (item.type === "poll") {
  const safeOptions = Array.isArray(item.options) ? item.options : [];
  const totalVotes = safeOptions.reduce((sum, o) => sum + (o.votes?.length || 0), 0);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onLongPress={() => handleDeletePoll(item.id)}
    >
      <View style={styles.pollCard}>
        <Text style={styles.pollTitle}>{item.title}</Text>

        {safeOptions.map((opt, idx) => {
          const percent = totalVotes > 0 ? (opt.votes?.length || 0) / totalVotes * 100 : 0;

          return (
            <View key={idx} style={styles.pollOption}>
              <View style={styles.pollOptionRow}>
                <Text style={styles.pollOptionText}>{opt.text}</Text>
                <View style={styles.pollAvatars}>
                  {(opt.votes || []).slice(0, 2).map((u, i) => (
                    <Image key={i} source={{ uri: u.avatarUrl }} style={styles.pollAvatar} />
                  ))}
                  {opt.votes?.length > 2 && (
                    <Text style={styles.pollMore}>+{opt.votes.length - 2}</Text>
                  )}
                </View>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${percent}%` }]} />
              </View>
            </View>
          );
        })}

     <TouchableOpacity
  style={styles.voteBtn}
  onPress={() => {
    console.log("🔍 [BEFORE MAPPING] item.options:", JSON.stringify(item.options, null, 2));
    
    const safePoll = {
      ...item,
      options: (item.options || []).map((o, index) => {
        console.log(`🔍 [MAPPING ${index}] Raw option:`, JSON.stringify(o, null, 2));
        
        const mapped = {
          optionId: o.optionId || o.id || o._id,
          text: o.optionText || o.text || o.name || "Không có tên",
          votes: Array.isArray(o.votes) ? o.votes : [],
        };
        
        console.log(`✅ [MAPPED ${index}] Result:`, JSON.stringify(mapped, null, 2));
        return mapped;
      }),
    };

    console.log("🟢 [FINAL] safePoll.options:", JSON.stringify(safePoll.options, null, 2));
    setSelectedPoll(safePoll);
    setVoteModalVisible(true);
  }}
>
  <Text style={styles.voteText}>Vote</Text>
</TouchableOpacity>

      </View>
    </TouchableOpacity>
  );
}

    if (item.type === "image") {
      const isMe = item.isCurrentUser;
      return (
        <View style={[styles.messageRow, isMe ? { justifyContent: "flex-end" } : { justifyContent: "flex-start" }]}>
          {!isMe && <Image source={item.avatarUrl ? { uri: item.avatarUrl } : require("../../../assets/images/default-avatar.jpg")} style={styles.avatar} />}
          <Image source={{ uri: item.imageUrl || item.url }} style={{ width: 150, height: 150, borderRadius: 10 }} />
        </View>
      );
    }

    const isMe = item.isCurrentUser;
    const avatarSource = item.avatarUrl ? { uri: item.avatarUrl } : require("../../../assets/images/default-avatar.jpg");
    return (
      <View style={[styles.messageRow, isMe ? { justifyContent: "flex-end" } : { justifyContent: "flex-start" }]}>
        {!isMe && <Image source={avatarSource} style={styles.avatar} />}
        <View style={[styles.bubble, { backgroundColor: "#fff" }, isMe ? { borderBottomRightRadius: 0, alignSelf: "flex-end" } : { borderBottomLeftRadius: 0, alignSelf: "flex-start" }]}>
          <View style={styles.headerRow}>
            {!isMe && <Text style={styles.sender}>{item.sender}</Text>}
            <Text style={styles.time}>{item.time}</Text>
          </View>
          <Text style={styles.messageText}>{item.text}</Text>
        </View>
      </View>
    );
  };

  const repeatTypeMap = { DAILY: "Hàng ngày", WEEKLY: "Hàng tuần", MONTHLY: "Hàng tháng" };

  const handleConfirmEvent = async (eventId, confirmStatus) => {
    if (!user) return;
    if (eventStatuses[eventId] === confirmStatus) {
      return;
    }
    try {
      const statusMap = { ACCEPTED: "Tham gia", DECLINED: "Từ chối" };
      const apiStatus = confirmStatus === "Tham gia" ? "ACCEPTED" : "DECLINED";
      const payload = { eventId, userId: user.userId, status: apiStatus };
      console.log("📤 Gửi request:", payload);
      const res = await eventService.processInvite(payload);
      console.log("📥 Kết quả response:", res);
      if (res.success) {
        setEventStatuses(prev => ({ ...prev, [eventId]: confirmStatus }));
      } else {
        Alert.alert("Lỗi", res.message);
      }
    } catch (err) {
      console.log("🔥 Lỗi khi gọi API:", err);
      Alert.alert("Lỗi", "Không thể xác nhận sự kiện");
    }
  };

  const currentEventStatus = selectedEvent ? eventStatuses[selectedEvent.eventId] : null;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => { if (isSearchMode) { setIsSearchMode(false); setSearchText(""); setSearchResults([]); } else { router.push("/chat"); } }} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        {isSearchMode ? (
          <TextInput placeholder="Tìm tin nhắn..." placeholderTextColor="#ccc" style={{ flex: 1, backgroundColor: "#fff", borderRadius: 8, paddingHorizontal: 10, marginRight: 10, color: "#000" }} value={searchText} onChangeText={(t) => { setSearchText(t); handleSearch(t); }} />
        ) : (
          <Text style={styles.title}>Chi tiết nhóm</Text>
        )}
        {!isSearchMode && (
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerIcon} onPress={() => router.push({ pathname: "/chat/group-info", params: { groupId } })}>
              <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <KeyboardAvoidingView style={styles.flex1} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}>
        <FlatList 
          ref={flatListRef}  // ✅ Thêm ref
          data={isSearchMode ? searchResults : messages} 
          keyExtractor={(item, index) => item.id?.toString() || index.toString()} 
          renderItem={renderMessage} 
          contentContainerStyle={styles.messagesContainer} 
          ListEmptyComponent={!loading && <Text style={{ color: "#999", textAlign: "center", marginTop: 20 }}>{isSearchMode ? "Không tìm thấy tin nhắn" : "Chưa có tin nhắn nào"}</Text>} 
        />
        {!isSearchMode && (
          <SafeAreaView edges={["bottom"]} style={{ backgroundColor: "#fff" }}>
            <View style={styles.inputContainer}>
              <TouchableOpacity onPress={() => setShowMenu((prev) => !prev)}>
                <Ionicons name="add-circle" size={28} color="#2ECC71" />
              </TouchableOpacity>
              <TextInput placeholder="Gửi tin nhắn" style={styles.input} placeholderTextColor="#999" multiline value={inputText} onChangeText={setInputText} />
              <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                <Ionicons name="send" size={22} color="#2ECC71" />
              </TouchableOpacity>
            </View>
            {showMenu && (
              <View style={styles.menuContainer}>
                <TouchableOpacity style={styles.menuRow}>
                  <Ionicons name="camera" size={20} color="#2ECC71" style={styles.menuIcon} />
                  <Text style={styles.menuText}>Máy ảnh</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuRow} onPress={pickImage}>
                  <Ionicons name="image" size={20} color="#2ECC71" style={styles.menuIcon} />
                  <Text style={styles.menuText}>Ảnh</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuRow} onPress={() => router.push({ pathname: "/chat/group-calendar", params: { id: groupId } })}>
                  <Ionicons name="calendar" size={20} color="#2ECC71" style={styles.menuIcon} />
                  <Text style={styles.menuText}>Nhắc hẹn</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuRow} onPress={() => router.push({ pathname: "/chat/create-poll", params: { groupId } })}>
                  <Ionicons name="list" size={20} color="#2ECC71" style={styles.menuIcon} />
                  <Text style={styles.menuText}>Bình chọn</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuRow} onPress={() => router.push({ pathname: "/chat/create-split-bill", params: { groupId } })}>
                  <Ionicons name="cash" size={20} color="#2ECC71" style={styles.menuIcon} />
                  <Text style={styles.menuText}>Chia tiền</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuRow} onPress={() => router.push({ pathname: "/chat/info-split-bill", params: { groupId } })}>
                  <Ionicons name="alarm" size={20} color="#2ECC71" style={styles.menuIcon} />
                  <Text style={styles.menuText}>Thanh toán</Text>
                </TouchableOpacity>
              </View>
            )}
          </SafeAreaView>
        )}
        <Modal visible={voteModalVisible} animationType="slide" transparent={true} onRequestClose={() => setVoteModalVisible(false)}>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>{selectedPoll?.title}</Text>
      
      {console.log("🔍 [MODAL RENDER] selectedPoll:", JSON.stringify(selectedPoll, null, 2))}
      
      {selectedPoll?.options.map((opt, idx) => {
        console.log(`🔍 [MODAL OPTION ${idx}]`, JSON.stringify(opt, null, 2));
        
        return (
          <TouchableOpacity
            key={idx}
            style={styles.modalOption}
            onPress={async () => {
              console.log("📤 [VOTE CLICK] opt:", JSON.stringify(opt, null, 2));
              console.log("📤 [VOTE DATA]:", {
                pollId: selectedPoll.id,
                optionId: opt.optionId,
                userId: user.userId,
              });
              
              if (!opt.optionId) {
                Alert.alert("❌ Lỗi", "optionId is undefined!");
                return;
              }
              
              try {
                const res = await pollService.vote(
                  selectedPoll.id,
                  opt.optionId,
                  user.userId
                );
                
                console.log("📥 [DEBUG] Response vote:", res);
                
                if (res.success) {
                  setMessages((prev) => {
                    const updated = prev.map((m) => {
                      if (String(m.id) === String(selectedPoll.id)) {
                        return {
                          ...m,
                          options: m.options.map((o) =>
                            o.optionId === opt.optionId
                              ? { 
                                  ...o, 
                                  votes: [...(o.votes || []), { user: { userId: user.userId } }]
                                }
                              : o
                          ),
                        };
                      }
                      return m;
                    });
                    
                    AsyncStorage.setItem(`messages_${groupId}`, JSON.stringify(updated));
                    return updated;
                  });

                  Alert.alert("✅ Thành công", "Bạn đã vote cho option này");
                  setVoteModalVisible(false);
                } else {
                  Alert.alert("❌ Thất bại", res.message || "Vote thất bại");
                }
              } catch (err) {
                console.error("❌ Vote error:", err);
                Alert.alert("Lỗi", "Không thể vote");
              }
            }}
          >
            <Text>{opt.text}</Text>
            <Text>{opt.votes?.length || 0} votes</Text>
          </TouchableOpacity>
        );
      })}

              <View style={styles.addOptionRow}>
                <TextInput placeholder="Thêm lựa chọn..." style={styles.addOptionInput} value={newOption} onChangeText={setNewOption} />
                <TouchableOpacity style={styles.addOptionBtn} onPress={async () => {
                  if (!newOption.trim()) return;
                  try {
                    const res = await pollService.addOption(selectedPoll.id, newOption.trim());
                    if (res.success) {
                      const newOpt = { optionId: res.data.optionId, text: res.data.optionText || newOption.trim(), votes: Array.isArray(res.data.votes) ? res.data.votes : [] };
                      setMessages((prev) => {
                        const updated = prev.map((m) => String(m.id) === String(selectedPoll.id) ? { ...m, options: [...m.options, newOpt] } : m);
                        AsyncStorage.setItem(`messages_${groupId}`, JSON.stringify(updated));
                        const newSelected = updated.find((m) => String(m.id) === String(selectedPoll.id));
                        setSelectedPoll(newSelected);
                        return updated;
                      });
                      setNewOption("");
                    } else {
                      Alert.alert("Lỗi", res.message);
                    }
                  } catch (err) {
                    Alert.alert("Lỗi", "Không thể kết nối server");
                    console.log("❌ Exception:", err);
                  }
                }}>
                  <Ionicons name="add" size={22} color="#fff" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setVoteModalVisible(false)}>
                <Text style={styles.modalCloseText}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        
        {/* ✅ MODAL PARTICIPANTS */}
        <Modal visible={showParticipantsModal} animationType="slide" transparent={true} onRequestClose={() => setShowParticipantsModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Người tham gia</Text>
              <ParticipantsList />
              <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setShowParticipantsModal(false)}>
                <Text style={styles.modalCloseText}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        
        {/* ✅ MODAL SỰ KIỆN */}
        <Modal visible={eventModalVisible} animationType="slide" transparent={true} onRequestClose={() => {
          setEventModalVisible(false);
        }}>
          <View style={styles.eventModalOverlay}>
            <View style={styles.eventModalContent}>
              {selectedEvent ? (
                editMode ? (
                  <>
                    <Text style={styles.eventModalTitle}>Chỉnh sửa sự kiện</Text>
                    <Text style={styles.eventModalLabel}>Tiêu đề</Text>
                    <TextInput style={styles.eventModalInput} value={editEvent.title} onChangeText={(t) => setEditEvent({ ...editEvent, title: t })} placeholder="Nhập tiêu đề sự kiện" />
                    <Text style={styles.eventModalLabel}>Ngày</Text>
                    <TouchableOpacity style={styles.eventModalInput} onPress={() => setShowDatePicker(true)}>
                      <Text>{editEvent.eventDate || "Chọn ngày"}</Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                      <DateTimePicker value={editEvent.eventDate ? new Date(editEvent.eventDate) : new Date()} mode="date" display="default" onChange={(event, selectedDate) => {
                        setShowDatePicker(false);
                        if (selectedDate) {
                          const formatted = selectedDate.toISOString().split("T")[0];
                          setEditEvent({ ...editEvent, eventDate: formatted });
                        }
                      }} />
                    )}
                    <Text style={styles.eventModalLabel}>Giờ</Text>
                    <TouchableOpacity style={styles.eventModalInput} onPress={() => setShowTimePicker(true)}>
                      <Text>{editEvent.eventTime || "Chọn giờ"}</Text>
                    </TouchableOpacity>
                    {showTimePicker && (
                      <DateTimePicker value={editEvent.eventTime ? new Date(`1970-01-01T${editEvent.eventTime}`) : new Date()} mode="time" display="default" onChange={(event, selectedTime) => {
                        setShowTimePicker(false);
                        if (selectedTime) {
                          const hours = selectedTime.getHours().toString().padStart(2, "0");
                          const minutes = selectedTime.getMinutes().toString().padStart(2, "0");
                          setEditEvent({ ...editEvent, eventTime: `${hours}:${minutes}:00` });
                        }
                      }} />
                    )}
                    <Text style={styles.eventModalLabel}>Lặp lại</Text>
                    <View style={[styles.eventModalInput, { padding: 0 }]}>
                      <Picker selectedValue={editEvent.repeatType} onValueChange={(value) => setEditEvent({ ...editEvent, repeatType: value })}>
                        <Picker.Item label="Không" value="NONE" />
                        <Picker.Item label="Hàng ngày" value="DAILY" />
                        <Picker.Item label="Hàng tuần" value="WEEKLY" />
                        <Picker.Item label="Hàng tháng" value="MONTHLY" />
                      </Picker>
                    </View>
                    <View style={styles.eventModalActions}>
                      <TouchableOpacity style={styles.eventModalActionBtn} onPress={async () => {
                        const res = await eventService.updateEvent(editEvent);
                        if (res.success && res.event) {
                          const updatedEvent = res.event;
                          setSelectedEvent(updatedEvent);
                          setMessages((prev) => {
                            const updatedMessages = prev.map((msg) => String(msg.id) === String(updatedEvent.eventId) ? { ...msg, content: updatedEvent.title, date: `${updatedEvent.eventDate}T${updatedEvent.eventTime}`, repeat: updatedEvent.repeatType } : msg);
                            AsyncStorage.setItem(`messages_${groupId}`, JSON.stringify(updatedMessages));
                            return updatedMessages;
                          });
                          // ✅ REFETCH SAU KHI UPDATE
                          fetchEvents();
                          setEventModalVisible(false);
                          setEditMode(false);
                          Alert.alert("Thành công", "Cập nhật sự kiện thành công!");
                        } else {
                          Alert.alert("Lỗi", res.message);
                        }
                      }}>
                        <Text style={styles.eventModalActionText}>Lưu</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.eventModalActionBtn} onPress={() => setEditMode(false)}>
                        <Text style={styles.eventModalActionText}>Hủy</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  <>
                    <Text style={styles.eventModalTitle}>{selectedEvent.title}</Text>
                    <Text style={styles.eventModalText}>Ngày: {selectedEvent.eventDate}</Text>
                    <Text style={styles.eventModalText}>Giờ: {selectedEvent.eventTime}</Text>
                    <Text style={styles.eventModalText}>Người tạo: {selectedEvent.creator?.fullName}</Text>
                    <Text style={styles.eventModalText}>Lặp lại: {repeatTypeMap[selectedEvent?.repeatType] || "Không"}</Text>

                    {/* ✅ NÚT XEM NGƯỜI THAM GIA - MỞ MODAL */}
                    <TouchableOpacity
                      style={styles.viewParticipantsBtn}
                      onPress={() => {
                        fetchEventParticipants(selectedEvent.eventId);
                        setShowParticipantsModal(true);
                      }}
                    >
                      <Ionicons name="people" size={20} color="#2ECC71" style={{ marginRight: 5 }} />
                      <Text style={styles.viewParticipantsText}>Xem người tham gia</Text>
                    </TouchableOpacity>

                    {user && (
                      <View style={styles.confirmationSection}>
                        {currentEventStatus && (
                          <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 10 }}>
                            <Text style={styles.eventModalText}>Bạn xác nhận: {currentEventStatus}</Text>
                            <Ionicons name="checkmark-circle" size={20} color="green" style={{ marginLeft: 5 }} />
                          </View>
                        )}
                        <View style={styles.eventActions}>
                          <TouchableOpacity
                            style={[
                              styles.eventReject,
                              currentEventStatus === "Từ chối" && { backgroundColor: "#ffdddd", borderWidth: 1, borderColor: "#ff0000" }
                            ]}
                            onPress={() => handleConfirmEvent(selectedEvent.eventId, "Từ chối")}
                          >
                            <Ionicons
                              name={currentEventStatus === "Từ chối" ? "checkmark-circle" : "radio-button-off"}
                              size={20}
                              color="#ff0000"
                              style={{ marginRight: 5 }}
                            />
                            <Text style={[
                              styles.eventReject,
                              currentEventStatus === "Từ chối" && { color: "#ff0000", fontWeight: "bold" }
                            ]}>Từ chối</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[
                              styles.eventAccept,
                              currentEventStatus === "Tham gia" && { backgroundColor: "#ddffdd", borderWidth: 1, borderColor: "#00ff00" }
                            ]}
                            onPress={() => handleConfirmEvent(selectedEvent.eventId, "Tham gia")}
                          >
                            <Ionicons
                              name={currentEventStatus === "Tham gia" ? "checkmark-circle" : "radio-button-off"}
                              size={20}
                              color="#00ff00"
                              style={{ marginRight: 5 }}
                            />
                            <Text style={[
                              styles.eventAccept,
                              currentEventStatus === "Tham gia" && { color: "#00ff00", fontWeight: "bold" }
                            ]}>Tham gia</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                    <View style={styles.eventModalActions}>
                      <TouchableOpacity style={styles.eventModalActionBtn} onPress={() => {
                        setEditEvent({
                          eventId: selectedEvent.eventId,
                          title: selectedEvent.title,
                          eventDate: selectedEvent.eventDate,
                          eventTime: selectedEvent.eventTime,
                          repeatType: selectedEvent.repeatType,
                        });
                        setEditMode(true);
                      }}>
                        <Text style={styles.eventModalActionText}>Chỉnh sửa</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.eventModalActionBtn} onPress={() => {
                        setEventModalVisible(false);
                      }}>
                        <Text style={styles.eventModalActionText}>Đóng</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )
              ) : (
                <Text>Đang tải chi tiết...</Text>
              )}
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
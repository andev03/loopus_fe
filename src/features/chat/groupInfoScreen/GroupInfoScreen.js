import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import styles from "./GroupInfoScreen.styles";

export default function GroupInfoScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Tùy chọn</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Avatar + Group name */}
        <View style={styles.groupHeader}>
          <Image
            source={{ uri: "https://randomuser.me/api/portraits/women/2.jpg" }}
            style={styles.avatar}
          />
          <Text style={styles.groupName}>Nhóm cơm tấm</Text>
          <TouchableOpacity>
            <Ionicons name="pencil" size={16} color="#2ECC71" />
          </TouchableOpacity>
        </View>

        {/* Actions row */}
        <View style={styles.actionRow}>
          <View style={styles.actionItem}>
            <View style={styles.iconCircle}>
              <Ionicons name="search" size={24} color="#444" />
            </View>
            <Text style={styles.actionText}>Tìm tin nhắn</Text>
          </View>
          <View style={styles.actionItem}>
            <View style={styles.iconCircle}>
              <Ionicons name="person-add" size={24} color="#444" />
            </View>
            <Text style={styles.actionText}>Thêm thành viên</Text>
          </View>
          <View style={styles.actionItem}>
            <View style={styles.iconCircle}>
              <Ionicons name="image" size={24} color="#444" />
            </View>
            <Text style={styles.actionText}>Đổi hình nền</Text>
          </View>
          <View style={styles.actionItem}>
            <View style={styles.iconCircle}>
              <Ionicons name="notifications-off" size={24} color="#444" />
            </View>
            <Text style={styles.actionText}>Tắt thông báo</Text>
          </View>
        </View>

       {/* Photos block */}
<View style={styles.photoBlock}>
  <TouchableOpacity style={styles.photoHeader}>
    <Ionicons name="images" size={20} color="#666" />
    <Text style={styles.optionText}>Ảnh & video</Text>
    <Ionicons name="chevron-forward" size={20} color="#ccc" style={styles.arrow} />
  </TouchableOpacity>

  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoRow}>
    <Image source={{ uri: "https://picsum.photos/200" }} style={styles.photo} />
    <Image source={{ uri: "https://picsum.photos/201" }} style={styles.photo} />
    <Image source={{ uri: "https://picsum.photos/202" }} style={styles.photo} />
    <Image source={{ uri: "https://picsum.photos/203" }} style={styles.photo} />
  </ScrollView>
</View>

        {/* Options with arrow > */}
        <TouchableOpacity style={styles.option}>
          <Ionicons name="people" size={20} color="#666" />
          <Text style={styles.optionText}>Xem thành viên</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" style={styles.arrow} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Ionicons name="person-add-outline" size={20} color="#666" />
          <Text style={styles.optionText}>Duyệt thành viên mới</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" style={styles.arrow} />
        </TouchableOpacity>

        <TouchableOpacity
           style={styles.option}
            onPress={() => router.push("/chat/group-qr")}
            >
          <Ionicons name="qr-code" size={20} color="#666" />
          <Text style={styles.optionText}>Mã QR & Link Nhóm</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" style={styles.arrow} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Ionicons name="alert-circle" size={20} color="#666" />
          <Text style={styles.optionText}>Báo Cáo</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" style={styles.arrow} />
        </TouchableOpacity>

        {/* Leave */}
        <View style={[styles.option, { marginTop: 20 }]}>
          <Ionicons name="exit" size={20} color="red" />
          <Text style={[styles.optionText, { color: "red" }]}>Rời khỏi nhóm</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}



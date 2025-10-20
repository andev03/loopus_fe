import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { getUser, saveUser } from "../../services/storageService";
import { updateUserInformation, updateUserAvatar } from "../../services/authService";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function EditProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
  const loadUser = async () => {
    const u = await getUser();
    console.log("🧩 User từ storage:", u);

    if (u) {
      setUser(u);

      // Nếu backend chỉ trả về fullName thì tách ra
      const [first, ...lastParts] = (u.fullName || "").split(" ");
      const last = lastParts.join(" ");

      setFirstName(first || "");
      setLastName(last || "");
      setEmail(u.email || u.username || "");
      setDob(u.dateOfBirth || "");
      setBio(u.bio || "");
      setAvatar(u.avatarUrl);
    }
  };
  loadUser();
}, []);


 const handleSave = async () => {
  if (!firstName || !lastName) {
    Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
    return;
  }

  setLoading(true);

  const fullName = `${firstName} ${lastName}`.trim(); // 👈 Ghép fullName mới
  const userData = {
    userId: user?.userId,
    firstName,
    lastName,
    email,
    dob,
    bio: bio || "Chưa có giới thiệu",
    fullName, // 👈 Thêm fullName nếu backend cần
  };

  console.log("📤 Sending update:", userData);

  const res = await updateUserInformation(userData, user?.token);
  setLoading(false);

  if (res.success) {
    Alert.alert("Thành công", "Cập nhật thông tin thành công");
    
    // 👈 Lưu với fullName mới
    await saveUser({ 
      ...user, 
      firstName, 
      lastName, 
      fullName, // 👈 Quan trọng: cập nhật fullName
      dob, 
      bio 
    });
    
    router.push("/(tabs)/account");
  } else {
    console.log("❌ Update profile error:", res);
    Alert.alert("Thất bại", res.message || "Cập nhật thất bại");
  }
};

 const handlePickAvatar = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    Alert.alert("Quyền truy cập bị từ chối", "Cần cấp quyền truy cập ảnh để đổi avatar.");
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.7,
  });

  if (!result.canceled) {
    const file = result.assets[0];
    console.log("🖼️ Chọn ảnh:", file);

    // ✅ hiển thị preview ngay
    setAvatar(file.uri); 
    await handleUploadAvatar(file);
  }
};

// 📤 Upload avatar lên server
const handleUploadAvatar = async (file) => {
  if (!user?.userId) {
    Alert.alert("Lỗi", "Không xác định được userId.");
    return;
  }

  setUploading(true);
  const res = await updateUserAvatar(
    user.userId,
    {
      uri: file.uri,
      name: file.fileName || `avatar_${Date.now()}.jpg`,
      type: file.mimeType || "image/jpeg",
    },
    user?.token
  );
  setUploading(false);

  if (res.success) {
    Alert.alert("Thành công", "Cập nhật avatar thành công");

    // ✅ Nếu server trả URL string thì dùng, ngược lại vẫn giữ preview
    const newAvatarUrl = typeof res.data === "string" ? res.data : file.uri;
    setAvatar(newAvatarUrl);

    // ✅ Lưu đúng định dạng (string)
    await saveUser({ ...user, avatarUrl: newAvatarUrl });
  } else {
    Alert.alert("Thất bại", res.message || "Cập nhật avatar thất bại");
  }
};


  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chỉnh sửa thông tin</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.avatarContainer}>
          <TouchableOpacity onPress={handlePickAvatar}>
            <Image
              source={{
                uri: avatar || "https://ui-avatars.com/api/?name=User",
              }}
              style={styles.avatar}
            />
            {uploading && (
              <View style={styles.overlay}>
                <ActivityIndicator color="#fff" size="small" />
              </View>
            )}
          </TouchableOpacity>
          <Text style={styles.avatarLabel}>Chạm để đổi ảnh đại diện</Text>
        </View>

        <View style={styles.formContainer}>
          {/* Họ */}
          <View style={styles.inputGroup}>
            <View style={styles.labelContainer}>
              <Ionicons name="person-outline" size={18} color="#10b981" />
              <Text style={styles.label}>Họ</Text>
            </View>
            <TextInput 
              style={styles.input} 
              value={lastName} 
              onChangeText={setLastName}
              placeholderTextColor="#9ca3af"
            />
          </View>

          {/* Tên */}
          <View style={styles.inputGroup}>
            <View style={styles.labelContainer}>
              <Ionicons name="person-outline" size={18} color="#10b981" />
              <Text style={styles.label}>Tên</Text>
            </View>
            <TextInput 
              style={styles.input} 
              value={firstName} 
              onChangeText={setFirstName}
              placeholderTextColor="#9ca3af"
            />
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <View style={styles.labelContainer}>
              <Ionicons name="mail-outline" size={18} color="#10b981" />
              <Text style={styles.label}>Email</Text>
            </View>
            <TextInput
              style={[styles.input, styles.inputDisabled]}
              value={email}
              editable={false}
              selectTextOnFocus={false}
            />
          </View>

          {/* Ngày sinh */}
          <View style={styles.inputGroup}>
            <View style={styles.labelContainer}>
              <Ionicons name="calendar-outline" size={18} color="#10b981" />
              <Text style={styles.label}>Ngày sinh</Text>
            </View>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
              <Text style={dob ? styles.dateText : styles.datePlaceholder}>
                {dob ? dob : "Chọn ngày sinh"}
              </Text>
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={dob ? new Date(dob) : new Date()}
              mode="date"
              display="spinner"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setDob(selectedDate.toISOString().split("T")[0]);
                }
              }}
            />
          )}

          {/* Giới thiệu */}
          <View style={styles.inputGroup}>
            <View style={styles.labelContainer}>
              <Ionicons name="chatbubble-outline" size={18} color="#10b981" />
              <Text style={styles.label}>Giới thiệu</Text>
            </View>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={bio}
              onChangeText={setBio}
              multiline
              placeholder="Giới thiệu đôi nét về bạn..."
              placeholderTextColor="#9ca3af"
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity 
            onPress={handleSave} 
            style={styles.button}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <View style={styles.buttonContent}>
                <Ionicons name="checkmark-circle-outline" size={22} color="#fff" />
                <Text style={styles.buttonText}>Lưu thay đổi</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* --- Thêm style avatar --- */
const styles = {
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#10b981",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: { padding: 4 },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "600" },
  scrollView: { paddingHorizontal: 16 },
  avatarContainer: {
    alignItems: "center",
    marginTop: 24,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: "#10b981",
  },
  overlay: {
    position: "absolute",
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLabel: {
    marginTop: 8,
    color: "#6b7280",
    fontSize: 13,
  },
  formContainer: { marginTop: 20 },
  inputGroup: { marginBottom: 16 },
  labelContainer: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  label: { marginLeft: 6, color: "#374151", fontWeight: "500" },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: "#111827",
  },
  inputDisabled: { backgroundColor: "#f3f4f6", color: "#9ca3af" },
  textArea: { height: 80, textAlignVertical: "top" },
  dateText: { color: "#111827", fontSize: 15 },
  datePlaceholder: { color: "#9ca3af", fontSize: 15 },
  button: {
    backgroundColor: "#10b981",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 40,
  },
  buttonContent: { flexDirection: "row", alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16, marginLeft: 6, fontWeight: "600" },
};

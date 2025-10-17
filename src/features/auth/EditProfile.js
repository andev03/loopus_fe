import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getUser, saveUser } from "../../services/storageService";
import { updateUserInformation } from "../../services/authService";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function EditProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [bio, setBio] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const u = await getUser();
      console.log("🧩 User từ storage:", u);
      if (u) {
        setUser(u);
        setFirstName(u.firstName || "");
        setLastName(u.lastName || "");
        setEmail(u.email || u.username || "");
        setDob(u.dob || "");
        setBio(u.bio || "");
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

    const userData = {
      userId: user?.userId,
      firstName,
      lastName,
      email,
      dob,
      bio: bio || "Chưa có giới thiệu",
    };

    console.log("📤 Sending update:", userData);

    const res = await updateUserInformation(userData);
    setLoading(false);

    if (res.success) {
      Alert.alert("Thành công", "Cập nhật thông tin thành công");
      await saveUser({ ...user, firstName, lastName, dob, bio });
      router.back();
    } else {
      console.log("❌ Update profile error:", res);
      Alert.alert("Thất bại", res.message || "Cập nhật thất bại");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header với gradient effect */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chỉnh sửa thông tin</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
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

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#f0fdf4",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#10b981",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.5,
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
    paddingTop: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 6,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#047857",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#d1fae5",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: "#1f2937",
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputDisabled: {
    backgroundColor: "#f3f4f6",
    borderColor: "#e5e7eb",
    color: "#6b7280",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
    paddingTop: 14,
  },
  dateText: {
    fontSize: 16,
    color: "#1f2937",
  },
  datePlaceholder: {
    fontSize: 16,
    color: "#9ca3af",
  },
  button: {
    backgroundColor: "#10b981",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 12,
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
};
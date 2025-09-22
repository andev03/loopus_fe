import { useState } from "react";
import { useRouter } from "expo-router";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";

export default function ForgotPasswordScreen() {
  const router = useRouter();

  const [step, setStep] = useState(1); // 1: nhập email, 2: nhập OTP, 3: đặt mật khẩu
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSendOtp = () => {
    if (!email) {
      Alert.alert("Lỗi", "Vui lòng nhập email");
      return;
    }
    // 🚀 call API gửi OTP
    console.log("Send OTP to:", email);
    setStep(2);
  };

  const handleVerifyOtp = () => {
    if (!otp) {
      Alert.alert("Lỗi", "Vui lòng nhập OTP");
      return;
    }
    // 🚀 call API verify OTP
    console.log("Verify OTP:", otp);
    setStep(3);
  };

  const handleResetPassword = () => {
    if (!password || !confirmPassword) {
      Alert.alert("Lỗi", "Vui lòng nhập mật khẩu");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu không khớp");
      return;
    }
    // 🚀 call API reset password
    console.log("Reset password:", password);
    Alert.alert("Thành công", "Mật khẩu đã được đặt lại!");
    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quên mật khẩu</Text>
      <Text style={styles.subtitle}>Khôi phục tài khoản của bạn</Text>

      {step === 1 && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Nhập email"
            value={email}
            onChangeText={setEmail}
          />
          <TouchableOpacity style={styles.button} onPress={handleSendOtp}>
            <Text style={styles.buttonText}>Gửi mã OTP</Text>
          </TouchableOpacity>
        </>
      )}

      {step === 2 && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Nhập mã OTP"
            value={otp}
            onChangeText={setOtp}
          />
          <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
            <Text style={styles.buttonText}>Xác nhận OTP</Text>
          </TouchableOpacity>
        </>
      )}

      {step === 3 && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Mật khẩu mới"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Xác nhận mật khẩu"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
            <Text style={styles.buttonText}>Đặt lại mật khẩu</Text>
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push("/login")}
      >
        <Text style={styles.backText}>Quay lại đăng nhập</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 8 },
  subtitle: { fontSize: 16, marginBottom: 20 },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  button: {
    width: "100%",
    backgroundColor: "#2ECC71",
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600", textAlign: "center" },
  backButton: {
    marginTop: 12,
  },
  backText: { color: "#2ECC71", fontSize: 14 },
});

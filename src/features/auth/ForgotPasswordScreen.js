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
import { sendForgotPasswordOtp, verifyForgotPassword } from "../../services/resetPasswordService";

export default function ForgotPasswordScreen() {
  const router = useRouter();

  const [step, setStep] = useState(1); 
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSendOtp = async () => {
  if (!email) {
    Alert.alert("Lỗi", "Vui lòng nhập email");
    return;
  }

  const res = await sendForgotPasswordOtp(email);
  console.log("Send OTP result:", res);
  if (res.success) {
    Alert.alert("Thành công", "OTP đã được gửi tới email của bạn");
    setStep(2);
  } else {
    Alert.alert("Lỗi", res.message);
  }
  
};

  const handleVerifyOtp = async () => {
  if (!otp) {
    Alert.alert("Lỗi", "Vui lòng nhập OTP");
    return;
  }
  const res = await verifyForgotPassword(email, otp, null, null);

  if (res.success) {
    Alert.alert("Thành công", "Mã OTP chính xác, hãy đặt lại mật khẩu");
    setStep(3);
  } else {
    Alert.alert("Lỗi", res.message || "OTP không hợp lệ");
  }
};

  const handleResetPassword = async () => {
  if (!password || !confirmPassword) {
    Alert.alert("Lỗi", "Vui lòng nhập mật khẩu");
    return;
  }
  if (password !== confirmPassword) {
    Alert.alert("Lỗi", "Mật khẩu không khớp");
    return;
  }

  const res = await verifyForgotPassword(email, otp, password, confirmPassword);
  if (res.success) {
    Alert.alert("Thành công", "Mật khẩu đã được đặt lại!", [
      { text: "OK", onPress: () => router.replace("/login") },
    ]);
  } else {
    Alert.alert("Lỗi", res.message);
  }
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

import React, { useState } from "react";
import { 
  ScrollView, 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View, 
  Alert, 
  ActivityIndicator,
  Platform
} from "react-native";
import { useRouter } from "expo-router";
import DateTimePicker from '@react-native-community/datetimepicker';
import { register } from '../../services/authService';

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: null, // Bỏ default date
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const router = useRouter();

  // Xử lý thay đổi ngày sinh
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || formData.dob;
    
    // iOS: Chỉ đóng picker khi user chọn xong
    if (Platform.OS === 'ios') {
      // Không tự động đóng trên iOS để user có thể scroll thoải mái
      // setShowDatePicker(false); // Bỏ dòng này để cho phép scroll
    } else {
      // Android: Tự động đóng sau khi chọn
      setShowDatePicker(false);
    }
    
    setFormData(prev => ({ ...prev, dob: currentDate }));
  };

  
  const formatDate = (date) => {
    if (!date) return ''; 
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    });
  };

  // Validate form
  const validateForm = () => {
    if (!formData.firstName.trim()) return "Vui lòng nhập tên";
    if (!formData.lastName.trim()) return "Vui lòng nhập họ";
    if (!formData.email.trim()) return "Vui lòng nhập email";
    if (!formData.dob) return "Vui lòng nhập ngày sinh"; 
    if (!formData.password.trim() || formData.password.length < 6) {
      return "Mật khẩu phải có ít nhất 6 ký tự";
    }
    if (formData.password !== formData.confirmPassword) {
      return "Mật khẩu không khớp";
    }
    if (!checked) return "Vui lòng đồng ý với điều khoản sử dụng";
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return "Email không hợp lệ";
    }
    
    return null;
  };

  // Xử lý đăng ký
  const handleRegister = async () => {
    const validationError = validateForm();
    if (validationError) {
      Alert.alert("Lỗi", validationError);
      return;
    }

    setIsLoading(true);
    
    const userData = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      dob: formData.dob.toISOString().split('T')[0], 
      email: formData.email.trim(),
      password: formData.password
    };

    console.log("Sending to API:", userData); 

    try {
      const response = await register(userData);
      
      if (response.success) {
        Alert.alert(
          "Thành công", 
          "Đăng ký thành công! Vui lòng đăng nhập.",
          [
            {
              text: "OK",
              onPress: () => router.push("/login")
            }
          ]
        );
      } else {
        Alert.alert("Lỗi", response.message);
      }
    } catch (error) {
      console.error("Register error:", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Đăng ký tài khoản mới</Text>
      <Text style={styles.subtitle}>Chào mừng bạn tới LOOPUS</Text>

      {/* Họ và Tên */}
      <View style={styles.row}>
        <TextInput 
          style={[styles.input, { flex: 1, marginRight: 6 }]} 
          placeholder="Họ" 
          value={formData.lastName}
          onChangeText={(text) => setFormData(prev => ({ ...prev, lastName: text }))}
        />
        <TextInput 
          style={[styles.input, { flex: 1, marginLeft: 6 }]} 
          placeholder="Tên" 
          value={formData.firstName}
          onChangeText={(text) => setFormData(prev => ({ ...prev, firstName: text }))}
        />
      </View>

      {/* Ngày sinh */}
      <TouchableOpacity 
        style={styles.dateInputContainer} 
        onPress={() => setShowDatePicker(true)}
        activeOpacity={0.7}
      >
        <TextInput
          style={styles.input}
          placeholder="Vui lòng nhập ngày sinh" 
          value={formatDate(formData.dob)}
          editable={false}
          pointerEvents="none"
        />
        <Text style={styles.dateIcon}>📅</Text>
      </TouchableOpacity>

      {/* DatePicker cải thiện - Cho phép scroll */}
      {showDatePicker && (
        <View style={styles.datePickerModal}>
          {/* Header cho iOS */}
          {Platform.OS === 'ios' && (
            <View style={styles.datePickerHeader}>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={() => setShowDatePicker(false)}
              >
                <Text style={styles.headerButtonText}>Hủy</Text>
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Chọn ngày sinh</Text>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={() => setShowDatePicker(false)}
              >
                <Text style={[styles.headerButtonText, styles.confirmText]}>Xong</Text>
              </TouchableOpacity>
            </View>
          )}
          
          {/* DatePicker chính */}
          <View style={styles.datePickerContent}>
            <DateTimePicker
              value={formData.dob || new Date(1990, 0, 1)} // Default value cho picker
              mode="date"
              display={Platform.select({
                ios: 'spinner', // iOS: Spinner cho phép scroll dễ dàng
                android: 'spinner' // Android: Spinner thay vì calendar để scroll
              })}
              maximumDate={new Date()}
              minimumDate={new Date(1900, 0, 1)}
              onChange={onDateChange}
              accentColor="#2ECC71" // Màu xanh cho các nút active
            />
          </View>
          
          {/* Footer cho Android */}
          {Platform.OS === 'android' && (
            <View style={styles.datePickerFooter}>
              <TouchableOpacity
                style={styles.footerButton}
                onPress={() => setShowDatePicker(false)}
              >
                <Text style={styles.footerButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.footerButton, styles.confirmFooterButton]}
                onPress={() => setShowDatePicker(false)}
              >
                <Text style={styles.confirmFooterButtonText}>Xong</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
      
      {/* Placeholder để tránh overlap khi DatePicker hiện */}
      {showDatePicker && <View style={styles.placeholder} />}

      {/* Email */}
      <TextInput 
        style={styles.input} 
        placeholder="Vui lòng nhập email" 
        keyboardType="email-address"
        autoCapitalize="none"
        value={formData.email}
        onChangeText={(text) => setFormData(prev => ({ ...prev, email: text.toLowerCase().trim() }))}
      />

      {/* Mật khẩu */}
      <TextInput 
        style={styles.input} 
        placeholder="Nhập mật khẩu" 
        secureTextEntry
        value={formData.password}
        onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
      />
      <TextInput 
        style={styles.input} 
        placeholder="Nhập lại mật khẩu" 
        secureTextEntry
        value={formData.confirmPassword}
        onChangeText={(text) => setFormData(prev => ({ ...prev, confirmPassword: text }))}
      />

      {/* Điều khoản */}
      <View style={styles.checkboxRow}>
        <TouchableOpacity 
          onPress={() => setChecked(!checked)} 
          style={styles.checkbox}
        >
          {checked ? <View style={styles.checkboxChecked} /> : null}
        </TouchableOpacity>
        <Text style={styles.checkboxLabel}>Tôi đồng ý với Điều khoản sử dụng Loopus</Text>
      </View>

      {/* Nút đăng ký */}
      <TouchableOpacity 
        style={[
          styles.registerButton, 
          (!checked || isLoading) && styles.registerButtonDisabled
        ]}
        onPress={handleRegister}
        disabled={!checked || isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.registerText}>Đăng ký</Text>
        )}
      </TouchableOpacity>

      {/* Đã có tài khoản */}
      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text style={styles.loginLink}>Bạn đã có tài khoản</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexGrow: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "#fff", 
    padding: 20 
  },
  title: { 
    fontSize: 22, 
    fontWeight: "bold", 
    marginBottom: 8 
  },
  subtitle: { 
    fontSize: 16, 
    marginBottom: 20 
  },
  input: { 
    width: "100%", 
    borderWidth: 1, 
    borderColor: "#ccc", 
    borderRadius: 8, 
    padding: 12, 
    marginBottom: 12,
    backgroundColor: '#f9f9f9'
  },
  row: { 
    flexDirection: "row", 
    width: "100%", 
    marginBottom: 12 
  },
  dateInputContainer: {
    position: 'relative',
    width: '100%',
    marginBottom: 12
  },
  dateIcon: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -6 }],
    fontSize: 16,
    color: '#666'
  },
  
  // DatePicker Modal Styles
  datePickerModal: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 8, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    overflow: 'hidden'
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef'
  },
  headerButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    minWidth: 60,
    alignItems: 'center'
  },
  headerButtonText: {
    fontSize: 16,
    color: '#6c757d',
    fontWeight: '500'
  },
  confirmText: {
    color: '#2ECC71',
    fontWeight: '600'
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50'
  },
  datePickerContent: {
    padding: 16,
    backgroundColor: '#fff',
    minHeight: Platform.OS === 'ios' ? 200 : 150
  },
  datePickerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef'
  },
  footerButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderRadius: 6,
    marginHorizontal: 4,
    backgroundColor: 'transparent'
  },
  confirmFooterButton: {
    backgroundColor: '#2ECC71'
  },
  footerButtonText: {
    fontSize: 16,
    color: '#6c757d',
    fontWeight: '500'
  },
  confirmFooterButtonText: {
    color: '#fff',
    fontWeight: '600'
  },
  
  // Placeholder để tránh overlap
  placeholder: {
    height: Platform.OS === 'ios' ? 250 : 200,
    backgroundColor: 'transparent'
  },
  
  checkboxRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 20 
  },
  checkbox: { 
    width: 20, 
    height: 20, 
    borderWidth: 1, 
    borderColor: "#2ECC71", 
    marginRight: 8, 
    alignItems: "center", 
    justifyContent: "center" 
  },
  checkboxChecked: { 
    width: 12, 
    height: 12, 
    backgroundColor: "#2ECC71" 
  },
  checkboxLabel: { 
    fontSize: 14, 
    flex: 1 
  },
  registerButton: { 
    width: "100%", 
    backgroundColor: "#2ECC71", 
    padding: 14, 
    borderRadius: 8, 
    marginBottom: 10 
  },
  registerButtonDisabled: {
    backgroundColor: '#bdc3c7'
  },
  registerText: { 
    color: "#fff", 
    fontSize: 16, 
    fontWeight: "600", 
    textAlign: "center" 
  },
  loginLink: { 
    color: "#555", 
    fontSize: 14, 
    marginTop: 8 
  },
});
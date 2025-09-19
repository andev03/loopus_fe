import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import styles from "./NotificationSettingScreen.styles";

export default function NotificationSettingsScreen() {
  const navigation = useNavigation();

  // state cho các switch
  const [settings, setSettings] = useState({
    sound: true,
    device: true,
    group: true,
    reminder: true,
    security: true,
    promo: true,
    voucher: true,
    ads: false,
    friends: true,
    changeAdmin: true,
    survey: true,
  });

  const toggleSwitch = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cài đặt thông báo</Text>
        <View style={{ width: 24 }} /> 
      </View>

      <ScrollView>
        {/* Cài đặt chung */}
        <View style={styles.itemRow}>
          <Text style={styles.itemTitle}>Âm thông báo</Text>
          <Switch
            value={settings.sound}
            onValueChange={() => toggleSwitch("sound")}
            trackColor={{ false: "#ccc", true: "#2ECC71" }}
            thumbColor="#fff"
          />
        </View>
        <View style={styles.itemRow}>
          <Text style={styles.itemTitle}>Nhận thông báo trên thiết bị</Text>
          <Switch
            value={settings.device}
            onValueChange={() => toggleSwitch("device")}
            trackColor={{ false: "#ccc", true: "#2ECC71" }}
            thumbColor="#fff"
          />
        </View>

        {/* Nhóm quan trọng */}
        <Text style={styles.section}>Thông báo quan trọng</Text>
        <SettingRow
          icon="card-outline"
          title="Giao dịch nhóm"
          desc="Cập nhật khi có thành viên thêm, chỉnh sửa hoặc xóa chi tiêu"
          value={settings.group}
          onToggle={() => toggleSwitch("group")}
        />
        <SettingRow
          icon="alarm-outline"
          title="Nhắc nhở"
          desc="Khi đến hạn trả nợ hoặc hoàn thành nhắc nhở giao dịch"
          value={settings.reminder}
          onToggle={() => toggleSwitch("reminder")}
        />
        <SettingRow
          icon="shield-checkmark-outline"
          title="Cảnh báo bảo mật"
          desc="Thông báo khi phát hiện bất thường, yêu cầu xác thực bảo mật"
          value={settings.security}
          onToggle={() => toggleSwitch("security")}
        />

        {/* Nhóm ưu đãi */}
        <Text style={styles.section}>Thông báo ưu đãi</Text>
        <SettingRow
          icon="gift-outline"
          title="Ưu đãi dịch vụ"
          desc="Ưu đãi dịch vụ bạn đang sử dụng"
          value={settings.promo}
          onToggle={() => toggleSwitch("promo")}
        />
        <SettingRow
          icon="pricetag-outline"
          title="Voucher & mã giảm giá"
          desc="Cập nhật voucher ưu đãi nhóm có thể áp dụng trong dịch vụ liên kết"
          value={settings.voucher}
          onToggle={() => toggleSwitch("voucher")}
        />
        <SettingRow
          icon="megaphone-outline"
          title="Quảng cáo"
          desc="Các thông báo quảng cáo khác"
          value={settings.ads}
          onToggle={() => toggleSwitch("ads")}
        />

        {/* Nhóm tương tác */}
        <Text style={styles.section}>Thông báo tương tác</Text>
        <SettingRow
          icon="people-outline"
          title="Bạn bè & nhóm"
          desc="Tương tác với bạn bè và các nhóm của bạn"
          value={settings.friends}
          onToggle={() => toggleSwitch("friends")}
        />
        <SettingRow
          icon="swap-horizontal-outline"
          title="Thay đổi nhóm"
          desc="Khi nhóm đổi admin, đại diện, thành viên"
          value={settings.changeAdmin}
          onToggle={() => toggleSwitch("changeAdmin")}
        />
        <SettingRow
          icon="chatbox-ellipses-outline"
          title="Khảo sát & phản hồi"
          desc="Khảo sát, phản hồi dịch vụ hoặc trải nghiệm"
          value={settings.survey}
          onToggle={() => toggleSwitch("survey")}
        />

        {/* Footer */}
        <TouchableOpacity style={styles.footerBtn}>
          <Text style={styles.footerText}>Tắt tất cả thông báo</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// Component cho từng dòng setting
function SettingRow({ icon, title, desc, value, onToggle }) {
  return (
    <View style={styles.settingRow}>
      <Ionicons
        name={icon}
        size={22}
        color="#2ECC71"
        style={{ marginRight: 12 }}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDesc}>{desc}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: "#ccc", true: "#2ECC71" }}
        thumbColor="#fff"
      />
    </View>
  );
}

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Switch,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import styles from "./NotificationSettingScreen.styles";

import { settingService } from "../../../services/settingService"; 
import { getUserId } from "../../../services/storageService";

export default function NotificationSettingsScreen() {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [allSettings, setAllSettings] = useState([]); // danh sách setting mô tả
  const [userSettings, setUserSettings] = useState([]); // danh sách user setting (id, type)
  const [settingsMap, setSettingsMap] = useState({}); // map type -> boolean

  // 🟢 Lấy data khi load
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const userId = await getUserId();
        if (!userId) {
          Alert.alert("Lỗi", "Không tìm thấy thông tin người dùng.");
          return;
        }

        // Gọi 2 API song song
        const [allRes, userRes] = await Promise.all([
          settingService.getAllSettings(),
          settingService.getSettingsByUserId(userId),
        ]);

        if (!allRes.success || !userRes.success) {
          Alert.alert("Lỗi", "Không thể tải cài đặt thông báo.");
          return;
        }

        setAllSettings(allRes.data);
        setUserSettings(userRes.data);

        // Tạo map type -> enabled
        const map = {};
        allRes.data.forEach((setting) => {
          const userSetting = userRes.data.find(
            (u) => u.type === setting.type
          );
          map[setting.type] = userSetting ? userSetting.enabled ?? true : true;
        });

        setSettingsMap(map);
      } catch (error) {
        console.error("❌ Lỗi fetchSettings:", error);
        Alert.alert("Lỗi", "Không thể tải dữ liệu cài đặt.");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // 🟢 Toggle một setting
  const toggleSwitch = async (type) => {
    try {
      const newEnabled = !settingsMap[type];
      setSettingsMap((prev) => ({ ...prev, [type]: newEnabled }));

      // Tìm ID của setting tương ứng
      const userSetting = userSettings.find((u) => u.type === type);
      if (!userSetting) return;

      const payload = [
        {
          settingId: userSetting.id,
          enabled: newEnabled,
        },
      ];

      const res = await settingService.updateSettingsByUserId(payload);
      if (!res.success) {
        Alert.alert("Lỗi", "Không thể cập nhật cài đặt.");
      }
    } catch (error) {
      console.error("❌ toggleSwitch error:", error);
      Alert.alert("Lỗi", "Không thể cập nhật trạng thái.");
    }
  };

  // 🟢 Tắt tất cả
  const turnOffAll = async () => {
    await updateAllSettings(false);
  };

  // 🟢 Bật tất cả
  const turnOnAll = async () => {
    await updateAllSettings(true);
  };

  // 🟢 Hàm update tất cả setting
  const updateAllSettings = async (enabled) => {
    try {
      const payload = userSettings.map((s) => ({
        settingId: s.id,
        enabled,
      }));
      setSettingsMap((prev) => {
        const newMap = {};
        Object.keys(prev).forEach((k) => (newMap[k] = enabled));
        return newMap;
      });
      const res = await settingService.updateSettingsByUserId(payload);
      if (!res.success) {
        Alert.alert("Lỗi", "Không thể cập nhật tất cả cài đặt.");
      }
    } catch (error) {
      console.error("❌ updateAllSettings:", error);
      Alert.alert("Lỗi", "Không thể thay đổi tất cả cài đặt.");
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2ECC71" />
      </View>
    );
  }

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

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {allSettings.map((item) => (
          <SettingRow
            key={item.type}
            icon={getIconByType(item.type)}
            title={item.description}
            value={settingsMap[item.type]}
            onToggle={() => toggleSwitch(item.type)}
          />
        ))}

        {/* Footer */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginVertical: 20,
          }}
        >
          <TouchableOpacity style={styles.footerBtn} onPress={turnOffAll}>
            <Text style={styles.footerText}>Tắt tất cả</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerBtn} onPress={turnOnAll}>
            <Text style={styles.footerText}>Bật tất cả</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// 🟢 Component cho từng dòng
function SettingRow({ icon, title, value, onToggle }) {
  return (
    <View style={styles.settingRow}>
      <Ionicons
        name={icon}
        size={22}
        color="#2ECC71"
        style={{ marginRight: 12 }}
      />
      <Text style={styles.settingTitle}>{title}</Text>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: "#ccc", true: "#2ECC71" }}
        thumbColor="#fff"
      />
    </View>
  );
}

// 🟢 Map icon theo type
function getIconByType(type) {
  const map = {
    SOUND: "volume-high-outline",
    DEVICE_NOTIFICATION: "phone-portrait-outline",
    GROUP_TRANSACTION: "card-outline",
    REMINDER: "alarm-outline",
    SECURITY_ALERT: "shield-checkmark-outline",
    SERVICE_PROMO: "gift-outline",
    VOUCHER: "pricetag-outline",
    ADVERTISING: "megaphone-outline",
    FRIENDS_AND_GROUPS: "people-outline",
    GROUP_CHANGE: "swap-horizontal-outline",
    SURVEY_FEEDBACK: "chatbox-ellipses-outline",
  };
  return map[type] || "notifications-outline";
}

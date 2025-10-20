import React, { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { getUser } from "../../../services/storageService";
import { createPaymentLink } from "../../../services/orderService";
import { Linking } from "react-native";

export default function PremiumScreen() {
  const [loading, setLoading] = useState(false);

  const handleBuy = async () => {
    try {
      setLoading(true);

      const user = await getUser();
      if (!user || !user.userId) {
        Alert.alert("Lỗi", "Không tìm thấy thông tin người dùng!");
        return;
      }

      const checkoutUrl = await createPaymentLink(user.userId, 50000);
      if (checkoutUrl) {
        Linking.openURL(checkoutUrl);
      } else {
        Alert.alert("Lỗi", "Không nhận được link thanh toán!");
      }
    } catch (err) {
      Alert.alert("Lỗi", "Không thể tạo đơn hàng. Vui lòng thử lại sau!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f0fdf4" }}>
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with gradient-like effect */}
        <View
          style={{
            backgroundColor: "#10b981",
            paddingVertical: 24,
            paddingHorizontal: 20,
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
            shadowColor: "#059669",
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.2,
            shadowRadius: 6,
            elevation: 6,
          }}
        >
          <Text
            style={{
              fontSize: 28,
              fontWeight: "bold",
              textAlign: "center",
              color: "#fff",
              letterSpacing: 0.5,
            }}
          >
            ✨ Loopus Premium
          </Text>
          <Text
            style={{
              fontSize: 13,
              textAlign: "center",
              color: "#d1fae5",
              marginTop: 6,
              fontWeight: "500",
            }}
          >
            Nâng cấp trải nghiệm của bạn
          </Text>
        </View>

        {/* Content Container */}
        <View style={{ padding: 20 }}>
         {/* Features Card */}
<View
  style={{
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    marginBottom: 20,
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1.5,
    borderColor: "#d1fae5",
  }}
>
  <Text
    style={{
      fontSize: 16,
      lineHeight: 24,
      color: "#064e3b",
      fontWeight: "600",
      marginBottom: 12,
    }}
  >
    Trải nghiệm không giới hạn:
  </Text>
  <View style={{ marginTop: 8 }}>
    {/* 1. Tạo nhóm không giới hạn */}
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
        paddingLeft: 8,
      }}
    >
      <View
        style={{
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: "#10b981",
          marginRight: 10,
        }}
      />
      <Text style={{ fontSize: 15, color: "#065f46", flex: 1 }}>
        Tạo nhóm không giới hạn
      </Text>
    </View>

    {/* 2. Thêm thành viên không giới hạn */}
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
        paddingLeft: 8,
      }}
    >
      <View
        style={{
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: "#10b981",
          marginRight: 10,
        }}
      />
      <Text style={{ fontSize: 15, color: "#065f46", flex: 1 }}>
        Thêm thành viên không giới hạn 
      </Text>
    </View>

    {/* 3. Chat trợ lý Loopus */}
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 8,
      }}
    >
      <View
        style={{
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: "#10b981",
          marginRight: 10,
        }}
      />
      <Text style={{ fontSize: 15, color: "#065f46", flex: 1 }}>
        Thêm chat trợ lý Loopus
      </Text>
    </View>
  </View>
</View>

          {/* Price Card */}
          <View
            style={{
              backgroundColor: "#ecfdf5",
              borderRadius: 14,
              padding: 18,
              marginBottom: 24,
              borderWidth: 1.5,
              borderColor: "#6ee7b7",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: "#059669",
                textAlign: "center",
                marginBottom: 6,
                fontWeight: "600",
              }}
            >
              Chỉ với
            </Text>
            <Text
              style={{
                fontSize: 28,
                fontWeight: "bold",
                color: "#047857",
                textAlign: "center",
              }}
            >
              50.000 VNĐ
            </Text>
          </View>

          {/* Buy Button */}
          <TouchableOpacity
            disabled={loading}
            style={{
              backgroundColor: loading ? "#86efac" : "#10b981",
              paddingVertical: 16,
              borderRadius: 14,
              alignItems: "center",
              shadowColor: "#059669",
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.25,
              shadowRadius: 6,
              elevation: 5,
            }}
            onPress={handleBuy}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text
                style={{
                  color: "#fff",
                  fontSize: 17,
                  fontWeight: "bold",
                  letterSpacing: 0.5,
                }}
              >
                🚀 Mua ngay
              </Text>
            )}
          </TouchableOpacity>

          {/* Back Button */}
          <TouchableOpacity
            style={{
              marginTop: 20,
              paddingVertical: 10,
              marginBottom: 10,
            }}
            onPress={() => router.back()}
          >
            <Text
              style={{
                textAlign: "center",
                color: "#059669",
                fontSize: 15,
                fontWeight: "600",
              }}
            >
              ← Quay lại
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
import React, { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Linking from "expo-linking";

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    const handleDeepLink = ({ url }) => {
      const { path } = Linking.parse(url);
      console.log("🔗 Deep link nhận được:", path);

      // 👉 Nếu deep link là loopus://login → luôn về màn login
      if (path === "login") {
        router.replace("/login");
      }
    };

    // Lắng nghe sự kiện deep link khi app đang mở
    const subscription = Linking.addEventListener("url", handleDeepLink);

    // Nếu app mở trực tiếp bằng deep link (ví dụ người dùng bấm từ trình duyệt)
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => subscription.remove();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />
    </GestureHandlerRootView>
  );
}

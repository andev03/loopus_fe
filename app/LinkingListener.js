// app/LinkingListener.js
import { useEffect } from "react";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";

export default function LinkingListener() {
  const router = useRouter();

  useEffect(() => {
    const handleDeepLink = ({ url }) => {
      const { path } = Linking.parse(url);
      console.log("🔗 Deep link nhận được:", path);

      // 👉 Luôn quay về login
      router.replace("/login");
    };

    const sub = Linking.addEventListener("url", handleDeepLink);

    // Cũng kiểm tra nếu app mở bằng deep link ngay từ đầu
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => sub.remove();
  }, []);

  return null;
}

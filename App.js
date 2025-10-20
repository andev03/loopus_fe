import { useEffect } from "react";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  const router = useRouter(); // 👉 thêm dòng này

  useEffect(() => {
    const handleDeepLink = (event) => {
      const url = event.url;
      console.log("📩 Deep link nhận được:", url);

      if (url.includes("payment-success")) {
        router.push("/payment-success");
      } else if (url.includes("payment-cancel")) {
        router.push("/payment-cancel");
      }
    };

    const subscription = Linking.addEventListener("url", handleDeepLink);

    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => subscription.remove();
  }, []);

  return <AppNavigator />;
}

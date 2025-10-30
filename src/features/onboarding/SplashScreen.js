import { useRouter } from "expo-router"; // 👈 dùng router
import { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, Text, View } from "react-native";

const { width } = Dimensions.get("window");

export default function SplashScreen() {
  const router = useRouter(); // 👈 lấy router
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: width * 0.6,
      duration: 2000,
      useNativeDriver: false,
    }).start(() => {
      router.replace("/onboarding"); // 👈 chuyển sang màn Onboarding
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>LOOPUS</Text>

      <View style={styles.progressBar}>
        <Animated.View style={[styles.progress, { width: progress }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 40,
  },
  progressBar: {
    width: width * 0.6,
    height: 8,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progress: {
    height: "100%",
    backgroundColor: "#2ECC71",
  },
});

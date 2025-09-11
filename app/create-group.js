import { View } from "react-native";
import CreateGroupScreen from "../src/features/chat/CreateGroupScreen";

export default function Page() {
  return (
    <View style={{ flex: 1 }}>
      <CreateGroupScreen />
    </View>
  );
}
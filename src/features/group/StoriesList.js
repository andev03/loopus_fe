import React from "react";
import { View, Image, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { router } from "expo-router";


export default function StoriesList() {
  return (
    <View style={styles.container}>
      <ScrollView>
        {stories.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() =>
              router.push({
                pathname: "/group/status-viewer",
                params: { storyId: item.id },
              })
            }
          >
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 10,
    top: 100,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 12,
    paddingVertical: 6,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginVertical: 6,
  },
});

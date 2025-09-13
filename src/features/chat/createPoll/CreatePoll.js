import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import styles from "./CreatePoll.styles";

export default function CreatePollScreen() {
  const [title, setTitle] = useState("");
  const [options, setOptions] = useState(["", ""]);

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleChangeOption = (text, index) => {
    const newOptions = [...options];
    newOptions[index] = text;
    setOptions(newOptions);
  };

  const handleRemoveOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions.length ? newOptions : [""]);
  };

  const handleSubmit = () => {
    const poll = { title, options: options.filter((o) => o.trim() !== "") };
    router.push({
      pathname: "/chat/[id]",
      params: { poll: JSON.stringify(poll), id: "1" },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconWrap}>
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Bình chọn</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* top icon card (custom ballot-like icon) */}
        <View style={styles.topCard}>
          <View style={styles.iconContainer}>
            {/* diamond (rotated square with border) */}
            <View style={styles.diamond}>
              {/* counter-rotate the check so it appears upright inside the rotated diamond */}
              <Ionicons
                name="checkmark"
                size={18}
                color="#2ECC71"
                style={{ transform: [{ rotate: "-45deg" }] }}
              />
            </View>

            {/* small rounded box under the diamond */}
            <View style={styles.box} />
          </View>
        </View>

        {/* main card */}
        <View style={styles.card}>
          <Text style={styles.label}>Thăm dò ý kiến...</Text>

          {/* <-- Giữ nguyên ô nhập câu hỏi như bạn yêu cầu --> */}
          <TextInput
            style={styles.input}
            placeholder="Nhập câu hỏi..."
            value={title}
            onChangeText={setTitle}
          />

          {/* Option rows */}
          {options.map((opt, idx) => (
            <View key={idx} style={styles.optionRow}>
              <Ionicons
                name="pencil-outline"
                size={18}
                color="#999"
                style={{ marginRight: 8 }}
              />
              <TextInput
                style={styles.optionInput}
                placeholder={`Thêm ý kiến ${idx + 1}`}
                value={opt}
                onChangeText={(text) => handleChangeOption(text, idx)}
                underlineColorAndroid="transparent"
              />
              <TouchableOpacity
                onPress={() => handleRemoveOption(idx)}
                style={styles.removeBtn}
              >
                <Ionicons name="close" size={18} color="#bbb" />
              </TouchableOpacity>
            </View>
          ))}

          {/* add option */}
          <TouchableOpacity style={styles.addRow} onPress={handleAddOption}>
            <Ionicons name="add-circle-outline" size={20} color="#2ECC71" />
            <Text style={styles.addOption}>  Thêm ý kiến</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* submit button fixed at bottom */}
      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.submitText}>Bình chọn</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}


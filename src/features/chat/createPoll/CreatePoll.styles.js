import { StyleSheet, Platform } from "react-native";

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F2F4F5" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#2ECC71",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  iconWrap: { width: 28, alignItems: "flex-start" },
  title: { color: "#fff", fontSize: 18, fontWeight: "700" },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 160,
  },

  topCard: {
    alignSelf: "center",
    marginTop: 1,
    width: 110,
    height: 76,
    borderRadius: 12,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",

    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
      },
      android: { elevation: 4 },
    }),
  },

  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },

  diamond: {
    width: 36,
    height: 36,
    borderWidth: 2,
    borderColor: "#2ECC71",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    transform: [{ rotate: "45deg" }],
    borderRadius: 6,
  },

  box: {
    width: 48,
    height: 18,
    borderRadius: 8,
    marginTop: -6,
    borderWidth: 2,
    borderColor: "#2ECC71",
    backgroundColor: "#fff",
  },

  card: {
    marginTop: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,

    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
      },
      android: { elevation: 2 },
    }),
  },

  label: { fontSize: 16, marginBottom: 8, color: "#333", fontWeight: "600" },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
    fontSize: 15,
    backgroundColor: "#fafafa",
  },

  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#f0f0f0",
  },

  optionInput: {
    flex: 1,
    fontSize: 15,
    color: "#333",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: "transparent",
  },

  removeBtn: {
    padding: 6,
    marginLeft: 8,
    borderRadius: 20,
    backgroundColor: "#f8f8f8",
  },

  addRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    paddingVertical: 10,
  },

  addOption: { color: "#2ECC71", marginLeft: 6, fontSize: 15, fontWeight: "600" },

  submitBtn: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 40,
    backgroundColor: "#2ECC71",
    paddingVertical: 14,
    borderRadius: 40,
    alignItems: "center",

    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
      },
      android: { elevation: 6 },
    }),
  },

  submitText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});

export default styles;

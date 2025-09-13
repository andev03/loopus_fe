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
    borderRadius: 10,
    padding: 16,

    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.02,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
      },
      android: { elevation: 1 },
    }),
  },

  label: { fontSize: 16, marginBottom: 8, color: "#333", fontWeight: "600" },

 
  input: {
    borderBottomWidth: 1,
    borderColor: "#ddd",
    marginBottom: 12,
    paddingVertical: 6,
  },

  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  optionInput: {
    flex: 1,
    paddingVertical: 0,
    fontSize: 15,
    color: "#333",
  },

  removeBtn: {
    padding: 6,
    marginLeft: 8,
  },

  addRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },

  addOption: { color: "#2ECC71", marginLeft: 6, fontSize: 15 },

  submitBtn: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 120,
    backgroundColor: "#2ECC71",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
      },
      android: { elevation: 4 },
    }),
  },

  submitText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});

export default styles;
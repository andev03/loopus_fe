import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#A8F0C4" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  timeText: { marginLeft: 8, color: "#000", fontSize: 14 },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBtn: {
    padding: 6,
    marginLeft: 16,
  },

  imageWrap: {
    flex: 1,
    marginHorizontal: 12,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  image: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
  },
  placeholder: {
    flex: 1,
    width: "100%",
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },

  overlayText: {
    position: "absolute",
    top: "45%",
    textAlign: "center",
    color: "#fff",
    fontSize: 22,
    fontWeight: "600",
    paddingHorizontal: 10,
  },
  input: {
    position: "absolute",
    top: "45%",
    width: "80%",
    color: "#fff",
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
  },

  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#A8F0C4",
  },
  leftGroup: { flexDirection: "row", alignItems: "center" },

  toolBtn: {
    backgroundColor: "#fff",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  toolBtnLarge: { width: 56, height: 40, borderRadius: 20 },
  toolBtnSmall: { width: 48, height: 40 },

  toolText: { fontSize: 18, fontWeight: "600" },

  sendBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2ECC71",
    alignItems: "center",
    justifyContent: "center",
  },

  // 🟢 Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
  },
  modalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 15,
  },
  modalCancel: {
    color: "#999",
    fontSize: 16,
    marginRight: 15,
  },
  modalConfirm: {
    color: "#4CAF50",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default styles;

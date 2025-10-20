import { StyleSheet, Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000",
    },
    progressBar: {
        height: 3,
        backgroundColor: "rgba(255,255,255,0.3)",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    progressFill: {
        height: "100%",
        backgroundColor: "#fff",
    },
    header: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 40,                 // keep above image/arrows
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingBottom: 12,          // paddingTop set from insets in JS
        // removed marginTop/marginBottom to avoid layout push
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    userAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
        borderWidth: 2,
        borderColor: "#2ECC71",
    },
    username: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    timeText: {
        color: "#ccc",
        fontSize: 12,
        marginTop: 2,
    },
    storyContent: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        // paddingTop is set dynamically in JS to reserve space under the header
    },
    storyImage: {
        borderRadius: 12,
        width: width,
        height: height * 0.65,
        alignSelf: "center",
        resizeMode: "contain",
    },
    captionOverlay: {
        position: "absolute",
        bottom: 20,
        left: 16,
        right: 16,
        backgroundColor: "rgba(0,0,0,0.6)",
        padding: 12,
        borderRadius: 8,
    },
    captionText: {
        color: "#fff",
        fontSize: 16,
    },
    progressContainer: {
        position: "absolute",
        top: 8,
        left: 8,
        right: 8,
        zIndex: 12,
        flexDirection: "row",
        gap: 4,
    },
    progressBarSegment: {
        flex: 1,
        height: 3,
        backgroundColor: "rgba(255,255,255,0.3)",
        borderRadius: 2,
        overflow: "hidden",
    },
    progressFillSegment: {
        height: "100%",
        backgroundColor: "#fff",
    },
    reactionsDisplay: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    reactionEmoji: {
        fontSize: 20,
        marginRight: 4,
    },
    reactionCount: {
        color: "#fff",
        fontSize: 14,
        marginLeft: 4,
    },
    reactionPicker: {
        position: "absolute",
        bottom: 72,
        left: 16,
        right: 16,
        backgroundColor: "rgba(20,20,20,0.95)",
        borderRadius: 16,
        paddingVertical: 10,
        paddingHorizontal: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        zIndex: 20,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.1)",
    },
    emojiBtn: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        backgroundColor: "rgba(255,255,255,0.08)",
    },
    emojiText: {
        fontSize: 22,
    },
    commentsSection: {
        maxHeight: 200,
        paddingHorizontal: 16,
    },
    emptyComment: {
        color: "#aaa",
        fontSize: 14,
        paddingVertical: 8,
    },
    commentItem: {
        flexDirection: "row",
        marginBottom: 12,
        alignItems: "flex-start",
    },
    commentAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 8,
    },
    commentContent: {
        flex: 1,
        backgroundColor: "rgba(255,255,255,0.1)",
        padding: 8,
        borderRadius: 12,
    },
    commentUsername: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 2,
    },
    commentText: {
        color: "#fff",
        fontSize: 14,
    },
    commentActions: {
        flexDirection: "row",
        gap: 8,
        alignItems: "center",
    },
    editCommentBtn: {
        padding: 4,
    },
    deleteCommentBtn: {
        padding: 4,
    },
    editCommentContainer: {
        width: "100%",
        marginTop: 4,
    },
    editCommentInput: {
        backgroundColor: "#2a2a2a",
        borderRadius: 8,
        padding: 8,
        color: "#fff",
        fontSize: 14,
        maxHeight: 100,
        borderWidth: 1,
        borderColor: "#2ECC71",
    },
    editCommentActions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 8,
        marginTop: 8,
    },
    editCancelBtn: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        backgroundColor: "#444",
    },
    editCancelText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "600",
    },
    editSaveBtn: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        backgroundColor: "#2ECC71",
    },
    editSaveText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "600",
    },
    bottomActions: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: "rgba(255,255,255,0.1)",
    },
    reactionBtn: {
        marginRight: 12,
    },
    myReactionText: {
        fontSize: 28,
        color: "#fff",
    },
    commentInputWrap: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.1)",
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    commentInput: {
        flex: 1,
        color: "#fff",
        fontSize: 14,
        marginRight: 8,
    },

    // Overlay arrows for manual navigation
    navArrows: {
        position: "absolute",
        top: height / 2 - 22,
        left: 0,
        right: 0,
        zIndex: 20,                 // below header, above image
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 12,
    },
    navBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "rgba(0,0,0,0.35)",
        alignItems: "center",
        justifyContent: "center",
    },
});
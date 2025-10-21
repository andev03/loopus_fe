import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Alert,
    Animated,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActionSheetIOS,
    FlatList,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import {
    getStoryDetail,
    listReactions,
    addReaction,
    removeReaction,
    updateReaction,
    listComments,
    addComment,
    getAlbumStories,
    deleteStory,
} from "../../services/storyService";
import { getUserId } from "../../services/storageService";
import styles from "./StoryDetailScreen.styles";
import { toPlainText } from "../../utils/utils";
import { Modalize } from "react-native-modalize";

export default function StoryDetailScreen() {
    const insets = useSafeAreaInsets();
    const params = useLocalSearchParams();
    const storyId = params.storyId;
    const albumId = params.albumId;
    const groupId = params.groupId;

    console.log("📱 Story Detail Params:", { storyId, albumId, groupId });

    const [story, setStory] = useState(null);
    const [reactions, setReactions] = useState([]);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState(null);

    const [commentText, setCommentText] = useState("");
    const [showReactionPicker, setShowReactionPicker] = useState(false);
    const [myReaction, setMyReaction] = useState(null);
    const modalizeRef = useRef(null);

    // Navigation state
    const [allStories, setAllStories] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentStoryId, setCurrentStoryId] = useState(storyId);
    const isNavigating = useRef(false);

    const reactionScale = useRef(new Animated.Value(0)).current;

    const EMOJIS = ["❤️", "😂", "😮", "😢", "😡", "👍"];

    useEffect(() => {
        fetchAllStories();
    }, [albumId]);

    useEffect(() => {
        if (allStories.length > 0 && storyId) {
            const index = allStories.findIndex(s => s.storyId?.toString() === storyId?.toString());
            if (index !== -1) {
                setCurrentIndex(index);
                setCurrentStoryId(storyId);
                loadStory(allStories[index].storyId);
            }
        }
    }, [allStories, storyId]);

    // ✅ Watch for currentStoryId changes
    useEffect(() => {
        if (currentStoryId && allStories.length > 0) {
            console.log("🔄 Current story ID changed:", currentStoryId);
            loadStory(currentStoryId);
        }
    }, [currentStoryId]);

    const fetchAllStories = async () => {
        try {
            if (!albumId) return;

            const res = await getAlbumStories(albumId);
            let storiesData = [];
            if (res?.data?.data) {
                storiesData = res.data.data;
            } else if (res?.data) {
                storiesData = res.data;
            } else if (Array.isArray(res)) {
                storiesData = res;
            }

            console.log("📚 Loaded stories:", storiesData.length);
            setAllStories(storiesData);
        } catch (error) {
            console.error("❌ Lỗi tải danh sách stories:", error);
        }
    };


    const loadStory = async (targetStoryId) => {
        try {
            if (!targetStoryId || targetStoryId === 'undefined') {
                Alert.alert("Lỗi", "Không tìm thấy story ID");
                router.back();
                return;
            }

            // ✅ Prevent loading the same story twice
            if (story?.storyId?.toString() === targetStoryId?.toString() && !isNavigating.current) {
                console.log("⏭️ Already showing this story, skipping load");
                return;
            }

            setLoading(true);
            isNavigating.current = false;

            const uid = await getUserId();
            setCurrentUserId(uid);

            console.log("🔍 Fetching story:", targetStoryId);

            const [storyRes, reactionsRes, commentsRes] = await Promise.all([
                getStoryDetail(targetStoryId),
                listReactions(targetStoryId),
                listComments(targetStoryId),
            ]);

            // Normalize API payloads
            const storyData = storyRes?.data?.data ?? storyRes?.data ?? storyRes;
            const reactionsArr = reactionsRes?.data?.data ?? reactionsRes?.data ?? reactionsRes ?? [];
            const commentsArr = commentsRes?.data?.data ?? commentsRes?.data ?? commentsRes ?? [];

            setStory(storyData);
            setReactions(Array.isArray(reactionsArr) ? reactionsArr : []);
            setComments(Array.isArray(commentsArr) ? commentsArr : []);

            // Find my reaction as full object
            const mine = (Array.isArray(reactionsArr) ? reactionsArr : []).find(
                (r) => r?.user?.userId?.toString() === uid?.toString()
            );
            setMyReaction(mine || null);

            setLoading(false);

            // Normalize comments to plain text
            const normalizedComments = (Array.isArray(commentsArr) ? commentsArr : []).map((c) => ({
                ...c,
                content: toPlainText(c.content ?? c.text ?? ""),
            }));
            setComments(normalizedComments);

        } catch (error) {
            console.error("❌ Lỗi tải story:", error);
            Alert.alert("Lỗi", "Không thể tải story");
            router.back();
        }
    };

    const navigateNext = () => {
        if (isNavigating.current) return;
        if (currentIndex < allStories.length - 1) {
            isNavigating.current = true;
            const nextIndex = currentIndex + 1;
            const nextStory = allStories[nextIndex];
            setCurrentIndex(nextIndex);
            setCurrentStoryId(nextStory.storyId);
        } else {
            router.back();
        }
    };

    const navigatePrev = () => {
        if (isNavigating.current) return;
        if (currentIndex > 0) {
            isNavigating.current = true;
            const prevIndex = currentIndex - 1;
            const prevStory = allStories[prevIndex];
            setCurrentIndex(prevIndex);
            setCurrentStoryId(prevStory.storyId);
        }
    };

    const handleReaction = async (emoji) => {
        try {
            // Remove if tapping the same emoji
            if (myReaction && myReaction.emoji === emoji) {
                await removeReaction({
                    storyId: currentStoryId,
                    reactionId: myReaction.id || myReaction.reactionId,
                });
                setMyReaction(null);
                // ✅ Fix: Filter by user để đảm bảo chỉ xóa của current user
                setReactions(reactions.filter((r) => 
                    r?.user?.userId?.toString() !== currentUserId?.toString()
                ));
                setShowReactionPicker(false);
                return;
            }

            // If already reacted with different emoji, try update first
            if (myReaction) {
                try {
                    const upd = await updateReaction({
                        storyId: currentStoryId,
                        reactionId: myReaction.id || myReaction.reactionId,
                        emoji,
                    });
                    const updated = upd?.data || upd || { ...myReaction, emoji };
                    setMyReaction(updated);
                    // ✅ Update reactions list
                    setReactions(
                        reactions.map((r) =>
                            (r.id || r.reactionId) === (myReaction.id || myReaction.reactionId)
                                ? { ...r, emoji }
                                : r
                        )
                    );
                } catch (e) {
                    console.log("🔄 Update failed, fallback to remove + add");
                    // Fallback: remove old + add new (ẩn emoji cũ)
                    await removeReaction({
                        storyId: currentStoryId,
                        reactionId: myReaction.id || myReaction.reactionId,
                    });
                    const res = await addReaction({
                        storyId: currentStoryId,
                        userId: currentUserId,
                        emoji,
                    });
                    const newReaction = res.data || res;
                    setMyReaction(newReaction);
                    // ✅ Fix: Filter tất cả reactions của current user, chỉ giữ newReaction
                    setReactions([
                        ...reactions.filter((r) => 
                            r?.user?.userId?.toString() !== currentUserId?.toString()
                        ),
                        newReaction,
                    ]);
                }
            } else {
                // First reaction
                const res = await addReaction({
                    storyId: currentStoryId,
                    userId: currentUserId,
                    emoji,
                });
                const newReaction = res.data || res;
                setMyReaction(newReaction);
                // ✅ Fix: Filter tất cả reactions của current user (nếu có), thêm new
                setReactions([
                    ...reactions.filter((r) => 
                        r?.user?.userId?.toString() !== currentUserId?.toString()
                    ),
                    newReaction,
                ]);
            }

            // Animate
            reactionScale.setValue(0);
            Animated.spring(reactionScale, {
                toValue: 1,
                friction: 3,
                useNativeDriver: true,
            }).start();
        } catch (error) {
            console.error("❌ Lỗi react:", error);
            Alert.alert("Lỗi", "Không thể cập nhật reaction");
        } finally {
            setShowReactionPicker(false);
        }
    };

    const handleSendComment = async () => {
        if (!commentText.trim()) return;

        try {
            const res = await addComment(currentStoryId, currentUserId, commentText.trim());
            const newComment = res.data || res;
            const normalized = {
                ...newComment,
                content: toPlainText(newComment?.content ?? newComment?.text ?? commentText.trim()),
            };
            setComments([...comments, normalized]);
            setCommentText("");
        } catch (error) {
            console.error("❌ Lỗi comment:", error);
            Alert.alert("Lỗi", "Không thể gửi bình luận");
        }
    };

    // Delete story
    const handleDeleteStory = () => {
        Alert.alert(
            "Xóa story",
            "Bạn có chắc muốn xóa story này?",
            [
                { text: "Hủy", style: "cancel" },
                {
                    text: "Xóa",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            // if (progressAnimation.current) progressAnimation.current.stop();
                            await deleteStory(currentStoryId);

                            // Remove from list and go next/prev/back
                            const idx = currentIndex;
                            const updated = allStories.filter(s => s.storyId?.toString() !== currentStoryId?.toString());
                            setAllStories(updated);

                            if (updated.length === 0) {
                                router.back();
                                return;
                            }

                            if (idx < updated.length) {
                                setCurrentIndex(idx);
                                setCurrentStoryId(updated[idx].storyId);
                            } else {
                                setCurrentIndex(idx - 1);
                                setCurrentStoryId(updated[idx - 1].storyId);
                            }
                        } catch (error) {
                            console.error("❌ Lỗi xóa story:", error);
                            Alert.alert("Lỗi", "Không thể xóa story");
                        }
                    },
                },
            ]
        );
    };

    const renderComment = ({ item, index }) => {
        // ✅ Ensure strings for text content to avoid rendering issues
        const username = item.user?.fullName || item.user?.username || "User";
        const content = String(item.content || '');

        return (
            <View style={styles.commentItem} key={item.id || item.commentId || index}>
                <Image
                    source={{
                        uri: item.user?.avatarUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
                    }}
                    style={styles.commentAvatar}
                />
                <View style={styles.commentContent}>
                    <Text style={styles.commentUsername}>
                        {username}
                    </Text>
                    <Text style={styles.commentText}>{content}</Text>
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

    // Helper to know if current user owns the story
    const isOwner =
        !!currentUserId &&
        (
            // story?.userId?.toString() === currentUserId?.toString() ||
            story?.user?.userId?.toString() === currentUserId?.toString()
        );
    console.log("comments", comments)
    return (
        <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
            >
                {/* Header */}
                <View style={[styles.header]}>
                    <View style={styles.headerLeft}>
                        <Image
                            source={{
                                uri: story?.user?.avatarUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
                            }}
                            style={styles.userAvatar}
                        />
                        <View>
                            <Text style={styles.username}>
                                {story?.user?.fullName || story?.user?.username || "User"}
                            </Text>
                            <Text style={styles.timeText}>
                                {story?.createdAt ? new Date(story.createdAt).toLocaleString("vi-VN") : ""}
                            </Text>
                        </View>
                    </View>

                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        {isOwner && (
                            <TouchableOpacity onPress={handleDeleteStory} style={{ marginRight: 12 }}>
                                <Ionicons name="trash-outline" size={24} color="#ff4444" />
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity onPress={() => router.back()}>
                            <Ionicons name="close" size={28} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Story content */}
                <View style={[styles.storyContent, { paddingTop: insets.top + 56 }]}>
                    <Image
                        source={{ uri: story?.imageUrl || story?.fileUrl || story?.url }}
                        style={styles.storyImage}
                        resizeMode="contain"
                        onError={(e) => {
                            console.error("❌ Image load error:", e.nativeEvent.error);
                        }}
                    />
                    {story?.caption && (
                        <View style={styles.captionOverlay}>
                            <Text style={styles.captionText}>{story.caption}</Text>
                        </View>
                    )}
                </View>

                {/* ⬅️➡️ Navigation arrows */}
                <View style={styles.navArrows} pointerEvents="box-none">
                    <TouchableOpacity onPress={navigatePrev} style={styles.navBtn}>
                        <Ionicons name="chevron-back" size={28} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={navigateNext} style={styles.navBtn}>
                        <Ionicons name="chevron-forward" size={28} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* Reactions display */}
                {reactions.length > 0 && (
                    <View style={styles.reactionsDisplay}>
                        {reactions.slice(0, 3).map((r, idx) => (
                            <Text key={`reaction-${r.id || idx}`} style={styles.reactionEmoji}>
                                {r.emoji}
                            </Text>
                        ))}
                        {reactions.length > 3 && (
                            <Text style={styles.reactionCount}>+{reactions.length - 3}</Text>
                        )}
                    </View>
                )}

              

                {/* Reaction picker */}
                {showReactionPicker && (
                    <View style={styles.reactionPicker}>
                        {EMOJIS.map((emoji, idx) => (
                            <TouchableOpacity
                                key={`emoji-${emoji}-${idx}`}
                                onPress={() => handleReaction(emoji)}
                                style={styles.emojiBtn}
                            >
                                <Text style={styles.emojiText}>{emoji}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {/* Nút mở bình luận (Instagram style) */}
                <TouchableOpacity
                    style={{
                        position: "absolute",
                        bottom: 90,
                        right: 20,
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                    onPress={() => modalizeRef.current?.open()}
                >
                    <Ionicons name="chatbubble-outline" size={22} color="#fff" />
                    <Text style={{ color: "#fff", marginLeft: 6 }}>
                        {comments.length} bình luận
                    </Text>
                </TouchableOpacity>


                {/* Bottom actions */}
                <View style={styles.bottomActions}>
                    <TouchableOpacity
                        onPress={() => setShowReactionPicker(!showReactionPicker)}
                        style={styles.reactionBtn}
                    >
                        {myReaction ? (
                            <Text style={styles.reactionEmoji}>{myReaction?.emoji}</Text>
                        ) : (
                            <Ionicons name="heart-outline" size={28} color="#fff" />
                        )}
                    </TouchableOpacity>

                    <View style={styles.commentInputWrap}>
                        <TextInput
                            style={styles.commentInput}
                            placeholder="Viết bình luận..."
                            placeholderTextColor="#999"
                            value={commentText}
                            onChangeText={setCommentText}
                        />
                        <TouchableOpacity
                            onPress={handleSendComment}
                            disabled={!commentText.trim()}
                        >
                            <Ionicons
                                name="send"
                                size={24}
                                color={commentText.trim() ? "#2ECC71" : "#999"}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <Modalize
                    ref={modalizeRef}
                    adjustToContentHeight
                    modalStyle={{
                        backgroundColor: "#1a1a1a",
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                        padding: 16,
                    }}
                    handleStyle={{ backgroundColor: "#666" }}
                >
                    <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600", marginBottom: 10 }}>
                        Bình luận ({comments.length})
                    </Text>

                    <ScrollView  // ✅ Quay lại ScrollView để tránh nesting với Modalize
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        style={{ maxHeight: 300, marginBottom: 10 }}  // Giữ maxHeight để không overflow
                    >
                        {comments.length === 0 ? (
                            <Text style={{ color: "#aaa", textAlign: "center", marginVertical: 10 }}>
                                Chưa có bình luận nào
                            </Text>
                        ) : (
                            comments.map((item, index) => renderComment({ item, index }))  // ✅ Pass index for safe key
                        )}
                    </ScrollView>

                    {/* Ô nhập bình luận (giữ nguyên) */}
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            borderTopWidth: 1,
                            borderTopColor: "#333",
                            paddingTop: 10,
                            marginTop: 10,
                        }}
                    >
                        <TextInput
                            style={{
                                flex: 1,
                                color: "#fff",
                                borderWidth: 1,
                                borderColor: "#444",
                                borderRadius: 20,
                                paddingHorizontal: 14,
                                paddingVertical: 6,
                            }}
                            placeholder="Viết bình luận..."
                            placeholderTextColor="#888"
                            value={commentText}
                            onChangeText={setCommentText}
                        />
                        <TouchableOpacity
                            onPress={handleSendComment}
                            disabled={!commentText.trim()}
                            style={{ marginLeft: 8 }}
                        >
                            <Ionicons
                                name="send"
                                size={22}
                                color={commentText.trim() ? "#2ECC71" : "#777"}
                            />
                        </TouchableOpacity>
                    </View>
                </Modalize>

            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
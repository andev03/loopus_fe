import React, { useEffect, useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native'
import { listComments, addComment, listReactions, addReaction } from '../../services/storyService'

const EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🔥']

export default function StoryViewer({ storyId, currentUserId }) {
    const [comments, setComments] = useState([])
    const [reactions, setReactions] = useState([])
    const [text, setText] = useState('')

    useEffect(() => {
        let stop = false
        const tick = async () => {
            try {
                const [c, r] = await Promise.all([
                    listComments(storyId),
                    listReactions(storyId)
                ])
                if (!stop) {
                    setComments(Array.isArray(c) ? c : [])
                    setReactions(Array.isArray(r) ? r : [])
                }
            } catch { }
        }
        tick()
        const id = setInterval(tick, 2500) // lightweight polling
        return () => { stop = true; clearInterval(id) }
    }, [storyId])

    const send = async () => {
        if (!text.trim()) return
        const optimistic = { id: `local-${Date.now()}`, content: text, userId: currentUserId }
        setComments((prev) => [optimistic, ...prev])
        setText('')
        try { await addComment(storyId, currentUserId, optimistic.content) } catch { }
    }

    const react = async (emoji) => {
        try {
            await addReaction({ storyId, userId: currentUserId, emoji })
            const r = await listReactions(storyId)
            setReactions(Array.isArray(r) ? r : [])
        } catch { }
    }

    return (
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
            {/* Reaction bar */}
            <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 16, marginBottom: 8 }}>
                {EMOJIS.map((e) => (
                    <TouchableOpacity key={e} onPress={() => react(e)}
                        style={{ paddingHorizontal: 12, paddingVertical: 8, backgroundColor: 'rgba(0,0,0,0.35)', borderRadius: 20 }}>
                        <Text style={{ fontSize: 18, color: '#fff' }}>{e}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Comments list */}
            <View style={{ maxHeight: 260, paddingHorizontal: 16 }}>
                <FlatList
                    inverted
                    data={comments}
                    keyExtractor={(it) => String(it.id)}
                    renderItem={({ item }) => (
                        <View style={{ marginVertical: 4, backgroundColor: 'rgba(0,0,0,0.35)', padding: 8, borderRadius: 12 }}>
                            <Text style={{ color: '#fff' }}>{item.content || item.text}</Text>
                        </View>
                    )}
                />
            </View>

            {/* Input */}
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12, gap: 8 }}>
                <TextInput
                    placeholder="Gửi tin nhắn"
                    value={text}
                    onChangeText={setText}
                    style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8 }}
                />
                <TouchableOpacity onPress={send}
                    style={{ paddingHorizontal: 14, paddingVertical: 8, backgroundColor: '#7bd389', borderRadius: 20 }}>
                    <Text>Gửi</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}
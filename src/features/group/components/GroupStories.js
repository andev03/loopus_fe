import React, { useEffect, useState } from 'react'
import { SafeAreaView, View, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { getGroup } from '../../../src/services/groupService'
import { getAlbumStories } from '../../../src/services/storyService'
import StoryComposer from '../../../src/components/story/StoryComposer'

export default function GroupStories() {
    const { groupId } = useLocalSearchParams()
    const router = useRouter()
    const [albumId, setAlbumId] = useState(null)
    const [stories, setStories] = useState([])
    const [loading, setLoading] = useState(true)
    const currentUserId = global?.auth?.userId // replace with your auth store

    useEffect(() => {
        let mounted = true
            ; (async () => {
                setLoading(true)
                const group = await getGroup(groupId)
                const aId = group?.albumId || group?.album?.id
                setAlbumId(aId || null)
                if (aId) {
                    const items = await getAlbumStories(aId)
                    if (mounted) setStories(items || [])
                }
                if (mounted) setLoading(false)
            })()
        return () => { mounted = false }
    }, [groupId])

    const onPosted = async (res) => {
        // Backend is expected to return album info with the story
        const aId = res?.albumId || res?.album?.id || albumId
        if (!aId) return
        if (aId !== albumId) setAlbumId(aId)
        const items = await getAlbumStories(aId)
        setStories(items || [])
    }

    if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <FlatList
                data={stories}
                keyExtractor={(item) => String(item.id)}
                ListHeaderComponent={
                    <View style={{ padding: 12 }}>
                        <StoryComposer userId={currentUserId} groupId={groupId} onSuccess={onPosted} />
                    </View>
                }
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => router.push({ pathname: '/story/[id]', params: { id: item.id } })}>
                        <Image source={{ uri: item.mediaUrl || item.thumbnailUrl }} style={{ width: '100%', aspectRatio: 9 / 16 }} />
                    </TouchableOpacity>
                )}
            />
        </SafeAreaView>
    )
}
import React, { useState } from 'react'
import { View, Image, TextInput, Button, ActivityIndicator, Alert } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { createStory } from '../../services/storyService'

export default function StoryComposer({ userId, groupId, onSuccess }) {
    const [media, setMedia] = useState(null)
    const [caption, setCaption] = useState('')
    const [loading, setLoading] = useState(false)

    const pick = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All, quality: 0.9
        })
        if (!result.canceled) {
            const asset = result.assets[0]
            setMedia({
                uri: asset.uri,
                name: asset.fileName || 'upload.jpg',
                type: asset.mimeType || (asset.uri.endsWith('.mp4') ? 'video/mp4' : 'image/jpeg')
            })
        }
    }

    const submit = async () => {
        if (!media) return Alert.alert('Chọn ảnh hoặc video')
        try {
            setLoading(true)
            const data = await createStory({
                request: { userId, groupId, caption, visibilityType: 'group' },
                file: media
            })
            onSuccess?.(data)
            setMedia(null)
            setCaption('')
        } catch (e) {
            Alert.alert('Tải lên thất bại', e?.message || 'Network error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <View style={{ gap: 12 }}>
            {media && <Image source={{ uri: media.uri }} style={{ height: 240, borderRadius: 12 }} />}
            <Button title="Chọn ảnh/video" onPress={pick} />
            <TextInput placeholder="Viết chú thích..." value={caption} onChangeText={setCaption}
                style={{ backgroundColor: '#fff', padding: 10, borderRadius: 8 }} />
            {loading ? <ActivityIndicator /> : <Button title="Đăng Story" onPress={submit} />}
        </View>
    )
}
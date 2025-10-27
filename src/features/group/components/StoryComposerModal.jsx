import React, { useState } from 'react'
import { Modal, View, Text, TouchableOpacity, TextInput, Image } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { createStory } from '../../services/storyApi'

export default function StoryComposerModal({ visible, onClose, groupId, onCreated }) {
    const [asset, setAsset] = useState(null)
    const [caption, setCaption] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const pick = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== 'granted') return
        const res = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            quality: 0.9,
            allowsEditing: false,
        })
        if (!res.canceled) {
            const a = res.assets[0]
            setAsset(a)
        }
    }

    const submit = async () => {
        if (!asset) return
        setSubmitting(true)
        try {
            const uri = asset.uri
            const fileName = asset.fileName || uri.split('/').pop() || 'upload.jpg'
            // rudimentary mime inference
            const ext = (fileName.split('.').pop() || '').toLowerCase()
            const mime = ext === 'mp4' ? 'video/mp4' : ext === 'mov' ? 'video/quicktime' : 'image/jpeg'

            const data = await createStory({
                uri,
                fileName,
                mime,
                caption,
                groupId,
                visibilityType: 'group',
            })
            onCreated?.(data)
            onClose()
            setAsset(null)
            setCaption('')
        } catch (e) {
            alert(e?.response?.data?.message || e.message || 'Upload failed')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <View style={{ flex: 1, backgroundColor: '#0009', justifyContent: 'flex-end' }}>
                <View style={{ backgroundColor: 'white', borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 16 }}>
                    <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8 }}>Create story</Text>
                    <TouchableOpacity onPress={pick} style={{ backgroundColor: '#eef', padding: 12, borderRadius: 8 }}>
                        <Text>{asset ? 'Change media' : 'Pick image/video'}</Text>
                    </TouchableOpacity>
                    {asset?.uri ? (
                        <Image source={{ uri: asset.uri }} style={{ width: '100%', height: 200, marginTop: 12, borderRadius: 8 }} />
                    ) : null}
                    <TextInput
                        placeholder="Caption (optional)"
                        value={caption}
                        onChangeText={setCaption}
                        style={{ marginTop: 12, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10 }}
                    />
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12, gap: 12 }}>
                        <TouchableOpacity onPress={onClose}><Text>Cancel</Text></TouchableOpacity>
                        <TouchableOpacity onPress={submit} disabled={submitting || !asset} style={{ opacity: submitting || !asset ? 0.6 : 1 }}>
                            <Text style={{ color: '#0a84ff' }}>{submitting ? 'Uploading…' : 'Post'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}
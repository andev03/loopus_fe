import { api } from './http'
import { toRNFile } from '../utils/utils'

export async function createStory({ request = {}, file }) {
  const { userId, caption, visibilityType, albumId, groupId } = request

  const rnFile = toRNFile(file)
  if (!rnFile) throw new Error('Missing file')

  const fd = new FormData()

  // Append file
  fd.append('file', {
    uri: rnFile.uri,
    name: rnFile.name,
    type: rnFile.type,
  })

  // Append request as JSON blob
  const requestPayload = {
    userId,
    caption: caption || '',
    visibilityType,
  }
  if (albumId) requestPayload.albumId = albumId
  if (groupId) requestPayload.groupId = groupId

  // Append as string with type
  fd.append('request', {
    string: JSON.stringify(requestPayload),
    type: 'application/json'
  })

  console.log("🧩 Upload payload:", rnFile, requestPayload);


  const res = await api.post('/api/stories', fd, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Accept': 'application/json',
    },

  });

  return res.data
}

// Detail
export async function getStoryDetail(storyId) {
  const res = await api.get(`/api/stories/${storyId}/detail`)
  return res.data
}

// Album stories by albumId
export async function getAlbumStories(albumId) {
  const res = await api.get(`/api/stories/${albumId}`)
  return res.data
}

// Delete story
export async function deleteStory(storyId) {
  const res = await api.delete(`/api/stories/${storyId}`)
  return res.data
}

// Reactions
export async function listReactions(storyId) {
  const res = await api.get(`/api/stories/${storyId}/reactions`)
  return res.data
}
export async function addReaction({ storyId, userId, emoji }) {
  const res = await api.post(`/api/stories/reaction`, { storyId, userId, emoji })
  return res.data
}
export async function removeReaction({ storyId, reactionId }) {
  const res = await api.delete(`/api/stories/${storyId}/${reactionId}/reactions`)
  return res.data
}

// Comments
export async function listComments(storyId) {
  const res = await api.get(`/api/stories/${storyId}/comments`)
  return res.data
}
export async function addComment(storyId, userId, content) {
  const res = await api.post(`/api/stories/${storyId}/comments`, {
    storyId,
    userId,
    content,
  })
  return res.data
}
export async function updateComment(commentId, text) {
  console.log("🧩 Updating comment:", commentId, text);
  const res = await api.put(`/api/stories/comment/${commentId}`, { text })
  return res.data
}
export async function deleteComment(storyId, commentId) {
  const res = await api.delete(`/api/stories/${storyId}/comments/${commentId}`)
  return res.data
}
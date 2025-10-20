export const toPlainText = (content) => {
    if (typeof content === "string") {
        const s = content.trim();
        if (s.startsWith("{") || s.startsWith("[")) {
            try {
                const obj = JSON.parse(s);
                if (typeof obj?.text === "string") return obj.text;
            } catch { }
        }
        return content;
    }
    if (content && typeof content === "object") {
        if (typeof content.text === "string") return content.text;
        try { return JSON.stringify(content); } catch { return ""; }
    }
    return "";
};

// Normalize a file for React Native FormData
export function toRNFile(input) {
    if (!input) return null

    if (typeof input === 'string') {
        const name = input.split('/').pop() || 'upload.jpg'
        const ext = (name.split('.').pop() || '').toLowerCase()
        const type =
            ext === 'png' ? 'image/png' :
                ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' :
                    ext === 'heic' || ext === 'heif' ? 'image/jpeg' : // avoid octet-stream
                        ext === 'mp4' ? 'video/mp4' :
                            'image/jpeg'
        const uri = input.startsWith('file://') ? input : `file://${input}`
        return { uri, name, type }
    }

    const { uri, name, type } = input || {}
    const finalUri = uri?.startsWith('file://') ? uri : `file://${uri}`
    const fileName = name || (uri ? uri.split('/').pop() : 'upload.jpg')
    const guessed =
        type ||
        (fileName?.toLowerCase().endsWith('.png')
            ? 'image/png'
            : fileName?.toLowerCase().endsWith('.mp4')
                ? 'video/mp4'
                : 'image/jpeg')
    return { uri: finalUri, name: fileName, type: guessed }
}
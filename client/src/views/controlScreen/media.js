
const sendMedia = soundName => {
    ipcRenderer.send("send-message", ["play_media", soundName])
}
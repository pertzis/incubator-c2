
const sendSound = soundName => {
    ipcRenderer.send("send-message", ["play_sound", soundName])
}
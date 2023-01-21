const { ipcRenderer } = require('electron')

const titleCell = document.getElementById("title")


ipcRenderer.send("get-server")

ipcRenderer.on("get-server", (_, server) => {
    titleCell.textContent = server.hostname
    document.title = `Epic Hacker Console [${server.hostname}]`
})

ipcRenderer.on("receive-message", (_, message) => {
    console.log("%c[INCUBATOR CLIENT] %c[RECEIVED] %c" + message, "color: lightgreen; font-weight: bold", "color: lightblue; font-weight: bold", "color: white;")
})

ipcRenderer.on("send-message", (_, message) => {
    console.log("%c[INCUBATOR CLIENT] %c[SENT] %c" + message, "color: lightgreen; font-weight: bold", "color: lightblue; font-weight: bold", "color: white;")
})
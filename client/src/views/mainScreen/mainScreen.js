const { ipcRenderer } = require('electron');

const clientRow = document.getElementById("clientRow")
const hostnameCell = document.getElementById("hostName")
const ipAddressCell = document.getElementById("ipAddress")
const osVersionCell = document.getElementById("osVersion")

ipcRenderer.send("connect-server")
ipcRenderer.send("send-message", ["get_pc_info"])

ipcRenderer.on("receive-message", (event, message) =>{
    let command = message[0]
    console.log("%c[INCUBATOR CLIENT] %c[RECEIVED] %c" + message, "color: lightgreen; font-weight: bold", "color: lightblue; font-weight: bold", "color: white;")
    switch (command) {
        case "get_pc_info":
            hostnameCell.textContent = message[1]
            ipAddressCell.textContent = message[2]
            osVersionCell.textContent = message[3]
            clientRow.style.display = "table-row"

            ipcRenderer.send("set-server", {
                hostname: message[1],
                ipAddress: message[2],
                operatingSystem: message[3]
            })
    }
})

const openControlScreen = () => {
    ipcRenderer.send("open-control-screen")
}

ipcRenderer.on("send-message", (event, message) => {
    console.log("%c[INCUBATOR CLIENT] %c[SENT] %c" + message, "color: lightgreen; font-weight: bold", "color: lightblue; font-weight: bold", "color: white;")
})
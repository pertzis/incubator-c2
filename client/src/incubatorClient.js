const net = require("net")

const DELIM = "<|!|>"

exports.socket = new net.Socket()

exports.serverInfo = {
    hostname: "",
    ipAddress: "",
    operatingSystem: ""
}

exports.connect = () => {
    exports.socket.connect(8081, "localhost", () => {
        console.log("%c[INCUBATOR CLIENT] %cConnected!", "color: lightgreen; font-weight: bold", "color: white")
    })
}

exports.decode = data => {
    let message = data.toString().substring(10)
    message = message.split(DELIM)
    return message
}

exports.send = (message) => {

    const formattedMessage = message.join(DELIM)
    console.log("%c[INCUBATOR CLIENT] %c[SENT] %c" + formattedMessage, "color: lightgreen; font-weight: bold", "color: lightblue; font-weight: bold", "color: white;")
    exports.socket.write((new TextEncoder().encode(formattedMessage)).length.toString().padEnd(10) + formattedMessage)
}

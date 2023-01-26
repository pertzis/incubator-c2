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
        console.log("[Incubator Client] Connected!")
    })
}

exports.decode = data => {
    let message = data.toString().substring(10)
    message = message.split(DELIM)
    console.log("[Incubator Client <- Received] " + message)
    return message
}

exports.send = (message) => {
    const formattedMessage = message.join(DELIM)
    console.log("[Incubator Client -> Sent] " + message)
    exports.socket.write((new TextEncoder().encode(formattedMessage)).length.toString().padEnd(10) + formattedMessage)
}

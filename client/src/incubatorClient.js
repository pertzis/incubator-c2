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
        console.log("[Incubator Client] Connected to server!")
    })
}

exports.decode = data => {
    let message = data.toString().substring(10)
    message = message.split(DELIM)
    console.log("[Incubator Client <- Received] " + message)
    return message
}

exports.send = (message) => {
    console.log("[Incubator Client -> Sent] " + message)
    exports.socket.write(message.length.toString().padEnd(10) + message)
}


const sendProcess = () => {

    document.getElementById("error-response-process").style.display = "none"


    const processError = document.getElementById("error-process")
    processError.style.display = "none"

    const processName = document.getElementById("processName")
    if (processName.value.length === 0) {
        return processError.style.display = "block"
    }

    ipcRenderer.send("send-message", ["run_process", processName.value])

    ipcRenderer.on("receive-message", (_, message) => {
        console.log(message)
        if (message[0] === "run_process") {
            const command = message[1]
            const success = bool(message[2])
            const response = message[3]
    
            if (!success) {
                document.getElementById("error-response-process-text").textContent = response
                document.getElementById("error-response-process-command").textContent = command
                document.getElementById("error-response-process").style.display = "block"
            }
        }
    })
}


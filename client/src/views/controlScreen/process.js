
const sendProcess = () => {

    // document.getElementById("error-response-process").style.display = "none"


    const processError = document.getElementById("error-process")
    processError.style.display = "none"

    const processName = document.getElementById("processName")
    if (processName.value.length === 0) {
        return processError.style.display = "block"
    }

    ipcRenderer.send("send-message", ["run_process", processName.value])
}


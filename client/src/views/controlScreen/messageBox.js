let selectedIcon = "error"

const setSelectedIcon = iconName => {

    const previousSelected = document.getElementById("msgbox-icon-" + selectedIcon)
    previousSelected.classList.remove("icon-active")
    previousSelected.classList.add("icon-inactive")

    const elem = document.getElementById("msgbox-icon-" + iconName)
    elem.classList.remove("icon-inactive")
    elem.classList.add("icon-active")
    selectedIcon = iconName

}

const sendMessageBox = () => {
    let error = false
    const titleError = document.getElementById("error-title")
    const messageError = document.getElementById("error-message")


    titleError.style.display = "none"
    messageError.style.display = "none"


    const messageBoxTitle = document.getElementById("messageBoxTitle").value
    if (messageBoxTitle.length === 0) {
        error = true
        titleError.style.display = "block"
    }

    const message = document.getElementById("messageBoxMessage").value
    if (message.length === 0) {
        error = true
        messageError.style.display = "block"
    }

    if (error) {
        return
    }

    let iconCode = 0
    switch (selectedIcon) {
        case "error":
            iconCode = 16
            break
        case "question":
            iconCode = 32
            break
        case "warning":
            iconCode = 48
            break
        case "info":
            iconCode = 64
    }



    let buttonsCode = 0
    try {
        const radioElements = document.getElementsByName("radios-buttons")
        radioElements.forEach(element => {
            element.checked && (buttonsCode = parseInt(element.value))
        })
    } catch {}

    ipcRenderer.send("send-message", ["show_messagebox", message, messageBoxTitle, buttonsCode, iconCode])

}

setSelectedIcon(selectedIcon)
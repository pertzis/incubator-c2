const { ipcRenderer } = require('electron')
const { MDCTextField } = require('@material/textfield');

new MDCTextField(document.querySelector('.mdc-text-field'));

const titleCell = document.getElementById("title")

let active = "messageBox"

const useEffect = () => {
    document.getElementById(active+"-component").style.display = "block"
}
useEffect()

const handleSelection = (screen) => {
    document.getElementById(active).classList.add("inactive")
    document.getElementById(active + "-icon").classList.add("inactive")
    document.getElementById(active).classList.remove("active")
    document.getElementById(active + "-icon").classList.remove("active")
    document.getElementById(active + "-component").style.display = "none"
    active = screen
    document.getElementById(active).classList.add("active")
    document.getElementById(active + "-icon").classList.add("active")
    document.getElementById(active).classList.remove("inactive")
    document.getElementById(active + "-icon").classList.remove("inactive")

    document.getElementById(active + "-component").style.display = "block"

}




ipcRenderer.send("get-server")

ipcRenderer.on("get-server", (_, server) => {
    titleCell.textContent = server.hostname
    document.title = `Epic Hacker Console [${server.hostname}]`
})
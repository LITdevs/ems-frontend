const wss = new WebSocket("wss://ems-api.litdevs.org/v1/pm2/socket", getCookie("EMS-token"));
wss.addEventListener("error", () => {
    document.getElementById("console").innerHTML = `<span class="text-red-5">[${new Date().toLocaleTimeString()}] Connection failed</span>`;
})
let Econsole = document.getElementById("console")

wss.addEventListener("open", () => {
    Econsole.innerHTML = `<span class="text-green-1">[${new Date().toLocaleTimeString()}] Connected</span><br>${Econsole.innerHTML}`;
})

wss.addEventListener("close", () => {
    Econsole.innerHTML = `<span class="text-red-3">[${new Date().toLocaleTimeString()}] Disconnected</span><br>${Econsole.innerHTML}`;
})


function clearConsole() {
    document.getElementById("console").innerHTML = ""
}
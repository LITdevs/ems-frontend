let wss
let retryCount = 0;
let firstTry = true
let Econsole = document.getElementById("console")

function openSocket() {
    if (firstTry) Econsole.innerHTML = `<span class="text-yellow-2">[${new Date().toLocaleTimeString()}] Connecting...</span><br>${Econsole.innerHTML}`
    else Econsole.innerHTML = `<span class="text-yellow-2">[${new Date().toLocaleTimeString()}] Reconnecting...</span><br>${Econsole.innerHTML}`
    wss = new WebSocket("wss://ems-api.litdevs.org/v1/pm2/socket", getCookie("EMS-token"));
    firstTry = false;
    addListeners();
    addPageSpecificListeners();
}

openSocket();


function addListeners() {
    wss.addEventListener("open", () => {
        Econsole.innerHTML = `<span class="text-green-1">[${new Date().toLocaleTimeString()}] Socket connected</span><br>${Econsole.innerHTML}`;
        retryCount = 0;
    })

    wss.addEventListener("close", () => {
        Econsole.innerHTML = `<span class="text-red-3">[${new Date().toLocaleTimeString()}] Disconnected.</span><br>${Econsole.innerHTML}`;
        if (retryCount < 5) {
            retryCount++;
            setTimeout(() => {
                openSocket();
            }, 1000);
        } else {
            Econsole.innerHTML = `<span class="text-red-5">[${new Date().toLocaleTimeString()}] Backend is dead. Bailing out, you are on your own now. Good luck.</span><br>${Econsole.innerHTML}`;
        }
    })

    wss.addEventListener("error", () => {
        Econsole.innerHTML = `<span class="text-red-5">[${new Date().toLocaleTimeString()}] Connection failed</span><br>${Econsole.innerHTML}`;
    })
}



function clearConsole() {
    document.getElementById("console").innerHTML = "";
}
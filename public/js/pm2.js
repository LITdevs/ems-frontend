let allProcesses = [];
let statuses = {};

function processStatus(name) {
    if (!statuses[name]) statuses[name] = {name: name, status: true};
    fetch("https://ems-api.litdevs.org/v1/pm2/status", {
        method: "POST", // I know it makes no sense for this to be a POST
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getCookie("EMS-token")}`
        },
        body: JSON.stringify({
            appName: name
        })
    }).then(res => res.json()).then(res => {
        if (res?.request?.status_code && res.request.status_code === 200) {
            let onlineState;
            let onlineStateColor;

            switch (res.response.data.pm2_env.status) {
                case "online":
                    statuses[name].status = true;
                    onlineState = "Online";
                    onlineStateColor = "green";
                    break;
                case "failed":
                    statuses[name].status = false;
                    onlineState = "Crashed";
                    onlineStateColor = "yellow";
                    break;
                case "stopped":
                    statuses[name].status = false;
                    onlineState = "Offline";
                    onlineStateColor = "red";
                    break;
                default:
                    statuses[name].status = false;
                    onlineState = res.response.data.pm2_env.status;
                    onlineStateColor = "yellow"
                    break;
            }

            document.querySelector(`.${name}-status`).textContent = onlineState;
            document.querySelector(`.${name}-status-dot`).classList.remove("status-dot-gray");
            document.querySelector(`.${name}-status-dot`).classList.remove("status-dot-green");
            document.querySelector(`.${name}-status-dot`).classList.remove("status-dot-red");
            document.querySelector(`.${name}-status-dot`).classList.remove("status-dot-yellow");
            document.querySelector(`.${name}-status-dot`).classList.add(`status-dot-${onlineStateColor}`);
        }
    })
}

function processPower(name) {
    if (name.includes("ems") && !confirm("Looks like you are trying to power off something related to the EMS!" +
        "\nOdds are you are using it to do that, so this is a stupid idea." +
        "\n\nProceed?")) return;
    if (!statuses[name]) statuses[name] = {name: name, status: false};
    fetch("https://ems-api.litdevs.org/v1/pm2/status", {
        method: "PATCH",
        headers: {
            "Authorization": `Bearer ${getCookie("EMS-token")}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            appName: name,
            status: !statuses[name].status
        })
    }).then(res => res.json()).then(res => {
        if (typeof res?.request?.status_code !== "number") {
            alert("Unknown error");
            return setTimeout(() => {processStatus(name)}, 1000);
        }
        alert(res.response.message)
        return setTimeout(() => {processStatus(name)}, 1000);
    })

}
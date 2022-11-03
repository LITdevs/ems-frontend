let atm7_power = false
function atm7status() {
    fetch("https://ems-api.litdevs.org/v1/minecraft/status", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${getCookie("EMS-token")}`
        }
    }).then(res => res.json()).then(res => {
        if (res?.request?.status_code && res.request.status_code === 200) {
            let onlineState;
            let onlineStateColor;

            switch (res.response.data.SubState) {
                case "running":
                    atm7_power = true;
                    onlineState = "Online";
                    onlineStateColor = "green";
                    break;
                case "failed":
                    atm7_power = false;
                    onlineState = "Crashed";
                    onlineStateColor = "yellow";
                    break;
                case "dead":
                    atm7_power = false;
                    onlineState = "Offline";
                    onlineStateColor = "red";
                    break;
                default:
                    atm7_power = false;
                    onlineState = res.response.data.SubState;
                    onlineStateColor = "yellow"
                    break;
            }

            document.querySelector(".atm-status").textContent = onlineState;
            document.querySelector(".atm-status-dot").classList.remove("status-dot-gray");
            document.querySelector(".atm-status-dot").classList.remove("status-dot-green");
            document.querySelector(".atm-status-dot").classList.remove("status-dot-red");
            document.querySelector(".atm-status-dot").classList.remove("status-dot-yellow");
            document.querySelector(".atm-status-dot").classList.add(`status-dot-${onlineStateColor}`);

        }
    })
}

atm7status();

function atm7status_deferred() {
    setTimeout(() => {
        atm7status()
    }, 1000)
}

function atm7power(force) {
    if (force && !confirm("Are you sure you want to force stop the server?\nData may not be saved!")) return;
    fetch("https://ems-api.litdevs.org/v1/minecraft/status", {
        method: "PATCH",
        headers: {
            "Authorization": `Bearer ${getCookie("EMS-token")}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            status: !atm7_power,
            force
        })
    }).then(res => res.json()).then(res => {
        if (typeof res?.request?.status_code !== "number") {
            alert("Unknown error");
            return atm7status_deferred();
        }
        alert(res.response.message)
        atm7status_deferred();
    })
}

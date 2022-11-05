let funserver_power = false
function funserverstatus() {
    fetch("https://ems-api.litdevs.org/v1/sharkofbot/funserver/status", {
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
                    funserver_power = true;
                    onlineState = "Online";
                    onlineStateColor = "green";
                    break;
                case "failed":
                    funserver_power = false;
                    onlineState = "Crashed";
                    onlineStateColor = "yellow";
                    break;
                case "dead":
                    funserver_power = false;
                    onlineState = "Offline";
                    onlineStateColor = "red";
                    break;
                default:
                    funserver_power = false;
                    onlineState = res.response.data.SubState;
                    onlineStateColor = "yellow"
                    break;
            }

            document.querySelector(".funserver-status").textContent = onlineState;
            document.querySelector(".funserver-status-dot").classList.remove("status-dot-gray");
            document.querySelector(".funserver-status-dot").classList.remove("status-dot-green");
            document.querySelector(".funserver-status-dot").classList.remove("status-dot-red");
            document.querySelector(".funserver-status-dot").classList.remove("status-dot-yellow");
            document.querySelector(".funserver-status-dot").classList.add(`status-dot-${onlineStateColor}`);

        }
    })
}

funserverstatus();

function funserverstatus_deferred() {
    setTimeout(() => {
        funserverstatus()
    }, 1000)
}

function funserverpower(force) {
    fetch("https://ems-api.litdevs.org/v1/sharkofbot/funserver/status", {
        method: "PATCH",
        headers: {
            "Authorization": `Bearer ${getCookie("EMS-token")}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            status: !funserver_power,
            force
        })
    }).then(res => res.json()).then(res => {
        if (typeof res?.request?.status_code !== "number") {
            alert("Unknown error");
            return funserverstatus_deferred();
        }
        alert(res.response.message)
        funserverstatus_deferred();
    })
}

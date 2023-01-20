let fml_power = false
function fmlstatus() {
    fetch("https://ems-api.litdevs.org/v1/minecraft2/status", {
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
                    fml_power = true;
                    onlineState = "Online";
                    onlineStateColor = "green";
                    break;
                case "failed":
                    fml_power = false;
                    onlineState = "Crashed";
                    onlineStateColor = "yellow";
                    break;
                case "dead":
                    fml_power = false;
                    onlineState = "Offline";
                    onlineStateColor = "red";
                    break;
                default:
                    fml_power = false;
                    onlineState = res.response.data.SubState;
                    onlineStateColor = "yellow"
                    break;
            }

            document.querySelector(".fml-status").textContent = onlineState;
            document.querySelector(".fml-status-dot").classList.remove("status-dot-gray");
            document.querySelector(".fml-status-dot").classList.remove("status-dot-green");
            document.querySelector(".fml-status-dot").classList.remove("status-dot-red");
            document.querySelector(".fml-status-dot").classList.remove("status-dot-yellow");
            document.querySelector(".fml-status-dot").classList.add(`status-dot-${onlineStateColor}`);

        }
    })
}

fmlstatus();

function fmlstatus_deferred() {
    setTimeout(() => {
        fmlstatus()
    }, 1000)
}

function fmlpower(force) {
    if (force && !confirm("Are you sure you want to force stop the server?\nData may not be saved!")) return;
    fetch("https://ems-api.litdevs.org/v1/minecraft2/status", {
        method: "PATCH",
        headers: {
            "Authorization": `Bearer ${getCookie("EMS-token")}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            status: !fml_power,
            force
        })
    }).then(res => res.json()).then(res => {
        if (typeof res?.request?.status_code !== "number") {
            alert("Unknown error");
            return fmlstatus_deferred();
        }
        alert(res.response.message)
        fmlstatus_deferred();
    })
}

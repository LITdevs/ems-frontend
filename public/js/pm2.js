let allProcesses = [];
let statuses = {};

function processStatus(name) {
    if (!statuses[name]) statuses[name] = {name: name, status: true};
    let trackingName = document.querySelector(`#tracking_${name}`)?.innerHTML;
    if (trackingName) processTracking(trackingName);
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

function processRestart(name) {
    if (name.includes("ems") && !confirm("Looks like you are trying to restart something related to the EMS!" +
        "\nThis may result in odd behaviour, you have been warned" +
        "\n\nProceed?")) return;
    if (!statuses[name]) statuses[name] = {name: name, status: true};
    fetch("https://ems-api.litdevs.org/v1/pm2/restart", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${getCookie("EMS-token")}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            appName: name
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

function processPull(name) {
    if (name.includes("ems") && !confirm("Looks like you are going to restart something related to the EMS!" +
        "\nThis may result in odd behaviour, you have been warned" +
        "\n\nProceed?")) return;
    fetch("https://ems-api.litdevs.org/v1/pm2/pull", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${getCookie("EMS-token")}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            appName: name
        })
    }).then(res => res.json()).then(res => {
        if (typeof res?.request?.status_code !== "number") {
            alert("Unknown error");
            processRestart(name)
            return setTimeout(() => {processStatus(name)}, 1000);
        }
        alert(res.response.message)
        processRestart(name)
        return setTimeout(() => {processStatus(name)}, 1000);
    })
}

function processTracking(name) {
    console.log(`charting ${name}`)
    fetch(`https://uptime.litdevs.org/${name}`).then(res => res.json()).then(res => {
      let dataPoints = res.map((item) => {
        return {
          x: new Date(item.timestamp),
          y: item.duration
        }
      });
      let chart = new Chart(document.getElementById(`chart_${name}`), {
          type: 'line',
          data: {
                datasets: [{
                    cubicInterpolationMode: 'monotone',
                    backgroundColor: '#FFB1C1',
                    borderColor: '#FF6384',
                    borderWidth: 1,
                    radius: 0,
                    label: "Response time (ms)",
                    data: dataPoints
                }]
          },
          options: {
              interaction: {
                  intersect: false
              },
              scales: {
                  x: {
                      type: "time",
                      time: {
                          unit: "day"
                      },
                      min: new Date(dataPoints[0].x),
                      max: new Date(dataPoints[dataPoints.length - 1].x),
                  },
                  y: {
                      min: -1
                  }
              }
          }
      })
        timescale = 32;
      if (timescale <= dataPoints.length) chart.options.scales.x.min = new Date(dataPoints[dataPoints.length - timescale].x)
      else chart.options.scales.x.min = new Date(dataPoints[0].x)
      chart.update()
    })
}
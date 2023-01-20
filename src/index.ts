import express, {Request, Response} from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import axios from 'axios';
import isAuthenticated from "./util/isAuthenticated";
const app = express()
dotenv.config()

app.set('view engine', 'ejs')

app.use(cookieParser());
app.use('/', express.static('public'));

app.get('/', isAuthenticated, (req: Request, res: Response) => {
    axios.get('https://ems-api.litdevs.org/v1/pm2/processes', {
        headers: {
            Authorization: `Bearer ${req.cookies["EMS-token"]}`
        }
    }).then(response => {
        res.render('index', { processes: response.data.response.data });
    })
})

app.get('/logs', isAuthenticated, (req: Request, res: Response) => {
    res.render('console');
})

app.get('/deploy/new', isAuthenticated, (req: Request, res: Response) => {
    res.render('deploy');
})

app.get('/ass', isAuthenticated, (req: Request, res: Response) => {
    axios.get('https://ems-api.litdevs.org/v1/ass/list', {
        headers: {
            Authorization: `Bearer ${req.cookies["EMS-token"]}`
        }
    }).then(response => {
        res.render('ass', { secrets: response.data.response.data });
    })
})

app.get("/logs/:appName", isAuthenticated, (req: Request, res: Response) => {
    axios.get(`https://ems-api.litdevs.org/v1/pm2/logs/${req.params.appName}`, {
        headers: {
            Authorization: `Bearer ${req.cookies["EMS-token"]}`
        }
    }).then(response => {
        if (response.status === 404) return res.status(404).send("No such app");
        res.render("appConsole", { app: req.params.appName, infoLogs: response.data.response.info, errorLogs: response.data.response.error });
    }).catch(err => {
        console.log(err);
        res.status(500).send("Internal Server Error or app not found");
    })
})

app.get("/app/:appName", isAuthenticated, (req: Request, res: Response) => {
    // Get app status
    axios.post(`https://ems-api.litdevs.org/v1/pm2/status`, { appName: req.params.appName }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${req.cookies["EMS-token"]}`
        }
    }).then(response => {
        if (response.status === 404) return res.status(404).send("No such app");
        res.render("app", { app: response.data.response.definition });
    }).catch(err => {
        console.error(err);
        res.status(500).send("Internal Server Error or app not found");
    })
})
app.get("/app/:appName/env", isAuthenticated, (req: Request, res: Response) => {
    // Get app status
    axios.post(`https://ems-api.litdevs.org/v1/pm2/status`, { appName: req.params.appName }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${req.cookies["EMS-token"]}`
        }
    }).then(response => {
        if (response.status === 404) return res.status(404).send("No such app");
        res.render("env", { app: response.data.response.definition });
    }).catch(err => {
        console.error(err);
        res.status(500).send("Internal Server Error or app not found");
    })
})

app.get("/nginx", isAuthenticated, (req: Request, res: Response) => {
    res.render("nginx");
})

app.get("/vitals", (req: Request, res: Response) => {
    res.render("vitals", { restrictNav: !req.cookies?.["EMS-token"] });
})

const port = process.env.EMS_FRONTEND_PORT || 1338;
app.listen(port, () => {
    console.info(`Listening on ${port}`);
})

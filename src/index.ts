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

app.get('/deploy', isAuthenticated, (req: Request, res: Response) => {
    res.render('console');
})

app.get('/deploy/new', isAuthenticated, (req: Request, res: Response) => {
    res.render('deploy');
})

const port = process.env.EMS_FRONTEND_PORT || 1338;
app.listen(port, () => {
    console.info(`Listening on ${port}`)
})

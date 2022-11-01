import express, {Request, Response} from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import isAuthenticated from "./util/isAuthenticated";
const app = express()
dotenv.config()

app.set('view engine', 'ejs')

app.use(cookieParser());
app.use('/', express.static('public'));

app.get('/', isAuthenticated, (req: Request, res: Response) => {

    res.render('index');
})

const port = process.env.EMS_FRONTEND_PORT || 1338;
app.listen(port, () => {
    console.info(`Listening on ${port}`)
})

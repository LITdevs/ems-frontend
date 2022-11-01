export default async function (req, res, next) {
    const logout = () => {
        res.cookie("EMS-token", "");
        return res.render('login');

    }
    if (!req.cookies?.["EMS-token"]) return logout();

    let jwt = req.cookies["EMS-token"];
    let jwtData = jwt.split(".")?.[1];
    if (!jwtData) return logout();

    jwtData = Buffer.from(jwtData, 'base64url').toString("utf-8");
    jwtData = JSON.parse(jwtData);

    if (jwtData.exp * 1000 < Date.now()) return logout();

    res.locals.user = jwtData;

    next();
}
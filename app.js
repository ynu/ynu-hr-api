const jsonServer = require('json-server');
const app = jsonServer.create();
let router = jsonServer.router({});
const middlewares = jsonServer.defaults();
const DynamicMiddleware = require('dynamic-middleware');
const config = require('./config');
const jwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');

// Set default middlewares (logger, static, cors and no-cache)
app.use(middlewares);

const mysql = require('mysql2/promise');
const mysqlOption = {
    connectionLimit : 10,
    host            : config.mysqlHost,
    user            : config.mysqlUsername,
    password        : config.mysqlPassword,
    database        : config.mysqlDatabase
}
const pool  = mysql.createPool(mysqlOption);

const CronJob = require('cron').CronJob;

const updateJob = async () => {
    console.log('updating the data!');
    try {
        const [zzjg] = await pool.query('select * from t_zzjg');
        const [jzg] = await pool.query('select * from t_jzg');
        const data = {zzjg, jzg};
        console.info(`updated partial data is ${JSON.stringify(zzjg[0])}, ${JSON.stringify(jzg[0])}`);
        router = jsonServer.router(data);
        dm.replace(router);
    }
    catch (err) {
        console.info(err);
        throw err;
    }
};

setTimeout(updateJob, config.initializationTime);

// use cron to arrange automation data update
// new CronJob('*/10 * * * * *', updateJob, null, true, 'Asia/Shanghai');
// use mysql change event to update data
const zongjiOptions = {mysqlOption, startOption: {includeSchema: { [config.mysqlDatabase]: true }}, cb: updateJob};
const zongjiWrapper = require('./utils/zongji-wrapper')(zongjiOptions);

app.get('/token', (req, res, next) => {
    const username = req.query.username;
    const password = req.query.password;
    if(!username || !password) {
        res.status(401).send('lack of credentials infomation!');
        return;
    }
    const token = jsonwebtoken.sign({sub: username}, config.jwtSecret);
    res.json({token});
    return;
});

app.use(jwt({
    secret: config.jwtSecret,
    credentialsRequired: true,
    getToken: (req) => {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            return req.headers.authorization.split(' ')[1];
        } else if (req.query && req.query.token) {
            return req.query.token;
        }
        return null;
    }
}));

// use DynamicMiddleware to wrap the jsonServer router
let dm = DynamicMiddleware.create(router);
app.use(dm.handler());

app.listen(config.port, () => {
    console.log(`HR API Server is running on ${config.port}`)
});
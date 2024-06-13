import * as express from 'express'

import {LOGIN_CHECK_PATH_LIST, port, sessions, WHITE_LIST_PATH_LIST} from './config/default';
import * as  cors from 'cors'


import * as bodyParser from 'body-parser'
import * as path from 'path'
// import * as multer from  'multer';
// const upload = multer();

import * as cookieParser from 'cookie-parser'
import {getRedisDB, RedisDB} from "./db/readis/readis";
import session = require('express-session');
import connectRedis = require('connect-redis');

const app = express();
let redisDB: RedisDB = getRedisDB();

//解析post
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
//session
let secure = () => {
    if (process.env.NODE_ENV == 'development') {
        app.set('trust proxy', 1)
        return true
    } else {
        return false;
    }
}
let RedisStore = connectRedis(session);
let store = new RedisStore({
    client: redisDB.getClient()
});

// store.all(() => {
// })


app.use(session({
    name: sessions.name,
    secret: sessions.secret,
    resave: false, //强制更新session的信息,
    rolling: true,//强制每个请求设置cookie ,并且重置他的过期时间 maxAge
    saveUninitialized: false, //如果登录失败,将不会把信息保存取来
    cookie: {
        secure: secure(), //根据当前的环境返回不同的值
        maxAge: sessions.maxAge
    },
    proxy: false,//代理,设置为true 需要设置反向代理,
    store: store
}))


// //注册路由
// import * as scenicRouter from "./routes/ScenicRouter";
import * as loginRouter from "./routes/LoginRouter";
// import * as ossRouter from "./routes/OssRouter";
// import * as clockInfoRouter from "./routes/ClockInfoRouter";
// import * as wxRouter from "./routes/WxRouter";
import * as createPDFbyUrl from "./routes/CreatePDFbyUrl";
import * as jobApplication from "./routes/JobApplication";
import SendData from "./models/sendData";

app.all('*', (req, res, next) => {
    const pathList = req.path.split('/').filter(item => item)
    if (LOGIN_CHECK_PATH_LIST.includes(pathList[0]) && !WHITE_LIST_PATH_LIST.includes(req.path)) {
        if (!req.session.user) {
            res.send(new SendData().get401SendData())
            return;
        } else {
            req.session.cookie.expires = new Date(Date.now() + sessions.maxAge); // 1小时后过期
            next()
            return;
        }
    }

    let {origin, Origin, referer, Referer} = req.headers;
    //允许所有来源访问nom  ${origin|Origin|referer|Referer|"*"}
    res.header('Access-Control-Allow-Origin', '*')
    //用于判断request来自ajax还是传统请求
    res.header("Access-Control-Allow-Headers", " Origin, X-Requested-With, Content-Type, Accept");
    //允许访问的方式
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
    //设置预检"请求（preflight）间隔时间 当浏览器发送一预检请求后,那么该请求下次预检时间实在1天之后,该时间是设置给请求的,  比如localhost:8080/login 预检后,下次是1天后
    res.header('Access-Control-Max-Age', `${1 * 24 * 60 * 60}`)
    //修改程序信息与版本
    res.header('X-Powered-By', ' 3.2.1')
    //内容类型：如果是post请求必须指定这个属性
    res.header('Content-Type', 'application/json;charset=utf-8')
    next()
});

// app.use('/wechatapi',scenicRouter)
app.use('', loginRouter)
// app.use('/oss', ossRouter)
// app.use('/clock', clockInfoRouter)
// app.use('/wx', wxRouter)
app.use('/getFile', createPDFbyUrl)
app.use('/jobApplication', jobApplication)


// 设置不然用本地保存cookie,会失败
app.use(cors({
    credentials: true,
    origin: true
}));
//解析post请求数据的中间插件
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

//错误处理
app.use(function (err, req, res, next) {
    const send = new SendData();
    res.send(send.getNoSendData(err.message));
});
//处理404
app.use(function (req, res, next) {
    console.log(req.path);
    const send = new SendData();
    res.send(send.getNoSendData('接口错误', 404));
});

const server = app.listen(port, function () {
    console.log('监听接口:', port)
});
module.exports = app;

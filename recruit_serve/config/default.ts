import {PoolConfig} from "mysql";
import {ClientOpts} from "redis";

export let sessions = {
    name: 'vue_admin_template_token', //查找session 的id
    secret: 'your-secret-key', //
    cookie: {  //设置cookie
        secure: false
    },
    maxAge: 2 * 60 * 60 * 1000,
}
//域名配置
export let url = process.env.NODE_ENV == 'development' ? 'http://localhost' : '';
//端口
export let port = parseInt(process.env.PORT, 10) || 8088
//oss配置
export const ACCESSKEYSECRET = 'FlU6A7i2CspXz8MlN13zT7hOgLo8Tj';
export const ACCESSKEYID = 'LTAI5tD3dtgMy2oyVKr4eFYi';
export const HOST = 'https://oss-cn-beijing.aliyuncs.com'; // 外网
// export const HOST = 'https://qxlreportpdf.oss-cn-beijing-internal.aliyuncs.com'; //内网

// oss://wcpdemo/resumeInfo/

export const DIR = 'resumeInfo/';
export const OSSConfig = {
    internal: false,
    bucket: 'wcpdemo',
    region: 'oss-cn-beijing',
    accessKeyId: ACCESSKEYID,
    accessKeySecret: ACCESSKEYSECRET,
    timeout: '120s', // 将超时时间设置为120秒
}

//mySQL 配置
export const poolConfig: PoolConfig = {
    multipleStatements: true, //设置多语句查询
    waitForConnections: true,// 当连接池的每个链接到达上线的时候,为true,则加入队列,等到有可用链接,在进行查询.为fasle的时候, 链接池直接抛出异常
    connectionLimit: 10, //最大的链接上线
    queueLimit: 0,//链接栈里面的最大的数量,超出后直接返回错误
    host: 'localhost',
    user: 'root',
    password: 'root_password', //密码
    database: 'JobApplicationDB', //数据库名
    port: 3306,        //数据库端口
};


//redis 配置
export const clientOpts: ClientOpts = {
    port: 6379,
    host: "127.0.0.1",
    retry_strategy: function (options) {
        // if (options.error && options.error.code === "ECONNREFUSED") {
        //     //服务器拒绝连接
        //     return new Error("The server refused the connection");
        // }
        //总重试连接的时间
        if (options.total_retry_time > 1000 * 60 * 60) {
            return new Error("Retry time exhausted");
        }
        if (options.attempt > 10) {
            //如果尝试连接十次以上 就不要连接了
            return undefined;
        }
        // 返回一个重新连接的时间
        return 5 * 1000 * 60 //5分钟之后 重新连接
    },
}

//fetch(fai,chi) 配置
export const HEADERS: object = {
    'mode': 'sors',
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};
export const RRSPONSEMETHOLDLIST: Array<string> = ['arrayBuffer', 'blob', 'formData', 'json', 'text', 'buffer']


//小程序的配置
export const APPID = 'wxef5d2c8115a34065'
export const SECRET = 'cb91e07ac0071dce2d304afcc26b6b83';

export const LOGIN_CHECK_PATH_LIST = ['jobApplication', 'getUserinfo'];
export const WHITE_LIST_PATH_LIST = [
    '/jobApplication/getApplication',
    '/jobApplication/download',
    '/getFile/getP'
];

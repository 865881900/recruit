import {Callback, ClientOpts, RedisClient} from "redis";
import {clientOpts} from "../../config/default";

const Redis = require('redis');


/**
 *保存一组数据到reads 中去
 * @param dataName  值的key
 * @param dataValue  值的value
 * @param expireTime  过期时间 大于0执行该语句
 * @return {Promise<void>}
 * this.client.set(dataName, dataValue, ReadisDB.Callback)
 */

/**
 * rides 数据可修改值的过期时间
 * @param dataName  需要修改值的key
 * @param expireTime  需要设置的过期时间
 * @return {Promise<void>}
 * this.client.expire(dataName, expireTime, ReadisDB.Callback)
 */

/**
 * 查询指定key 的过期时间
 * @param dataName 查看的key
 * this.client.TTL(dataName)
 */

/**
 * 封装的redis
 */
export class RedisDB {
    private client: RedisClient;
    private static PASSWORD = 'wangmyredis';

    constructor() {
        this.client = Redis.createClient(clientOpts);
        //设置密码
        this.client.auth('wangmyredis')
        this.client.on('ready', function () {
            console.log('redis 重播命令')
        });
        this.client.on('connect', function () {
            console.log('redis 连接成功');

        });
        this.client.on('reconnecting', function () {
            console.log('redis 重新连接重新连接')
        });
        this.client.on('error', function (err) {
            console.log('redis  错误', err)
        });
        this.client.on('end', function () {
            console.log('redis 连接终止')
        });
        this.client.on('warning', function () {
            console.log('redis 不适用密码,不推荐项')
        })
        this.redis = this.redis.bind(this);
    }


    public async redis(fun: Function, callback: Function = null): Promise<any> {
        await fun.call(this.client, this.client);
        if (callback) {
            await callback()
        }

        // redis((client)=>{
        //     client.redis方法名(参数)
        // },回调函数=>{
        //
        // })
    };

    public getClient(): RedisClient {
        return this.client
    }
};

let redisDB = new RedisDB()

export function getRedisDB(): RedisDB {
    return redisDB;
}

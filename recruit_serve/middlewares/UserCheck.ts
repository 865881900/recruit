import {getRedisDB} from '../db/readis/readis'
import {RedisClient} from "redis";
import OSS from 'ali-oss';
import SendData from "../models/sendData";

//校验
export class UserCheck {
    private redisDB: RedisClient;

    constructor() {
        this.redisDB = getRedisDB().getClient();
    };

    async checkLogin(req, res, next) {
        const sendData = new SendData()
        let sessionId: string;
        try {

            sessionId = req.headers.sessionid;
            if (!sessionId) {
                res.send(sendData.get401SendData());
                return
            }
            let time: number = await new Promise((resolve, reject) => {
                this.redisDB.exists(sessionId, function (error, time) {
                    if (error) {
                        reject(error)
                    }
                    resolve(time)
                })
            })
            if (time > 0) {
                let userId: string = await new Promise((resolve, reject) => {
                    this.redisDB.get(sessionId, async function (err, data) {
                        if (err) {
                            reject(err)
                        }
                        resolve(data)
                    })
                });
                req.body.sessionId = userId;
                this.redisDB.expire(sessionId, 2 * 60 * 60);
                next()
            } else {
                res.send(sendData.get401SendData());
                return
            }
        } catch (e) {
            res.send(sendData.getNoSendData(e.message));
        }
    }
}

const userCheck = new UserCheck()

export function getUserCheck(): UserCheck {
    return userCheck
}

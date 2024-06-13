import {getLoginDAO, LoginDAO} from "../../DAO/LoginDAO";
import {FetchHttp, getFetchHttp} from '../../utils/fetchHttp'
import {getRedisDB} from '../../db/readis/readis'
import {RedisClient} from "redis";
import {v1} from "node-uuid";
import {UserInfo} from "../../models/UserInfo";
import {APPID, SECRET} from "../../config/default";
import SendData from "../../models/sendData";
import {getEncryption} from "../../utils/encryption";
import {getUserInfoServer, UserInfoServer} from "../../server/JobApplicationServer/UserInfoServer";
import {UserInfo as UserInfo1} from "../../models/JobApplication/UserInfo";
import {OperateData} from "../../utils/OperateData";

export class LoginController {

    private fetchHttp: FetchHttp;
    private redisDB: RedisClient;
    private loginDAO: LoginDAO;
    private userInfoServer: UserInfoServer

    constructor() {
        this.fetchHttp = getFetchHttp();
        this.redisDB = getRedisDB().getClient();
        this.loginDAO = getLoginDAO();
        this.userInfoServer = getUserInfoServer();
    };

    //用户登录
    async newLogin(res, req) {
        let {code, userName, userImg} = res.body,
            uerInfo: any,
            userInfo: UserInfo,
            newUserInfoSessionId: string, //生成的sessionId
            firstTime: boolean; //是否第一次登陆
        try {
            uerInfo = await this.fetchHttp.get('https://api.weixin.qq.com/sns/jscode2session', {
                appid: APPID,
                secret: SECRET,
                js_code: code,
                grant_type: 'authorization_code'
            })
            //处理微信服务器的异常
            if (uerInfo.errcode) {
                req.send({
                    code: uerInfo.errcode,
                    mesg: uerInfo.errmsg
                });
                return
            }
            userInfo = await this.loginDAO.getUserInfoByOpenid(uerInfo.openid);
            newUserInfoSessionId = v1()
            //是否以前登陆过
            if (userInfo.getSessionId()) {
                //是的话,更新用户的信息
                firstTime = false;
                userInfo.setSessionId(newUserInfoSessionId);
                await this.loginDAO.updateUserInfoByOpenid(userInfo);
            } else {
                //否的话,插入用户的信息
                firstTime = true;
                userInfo.setSessionId(newUserInfoSessionId);
                userInfo.setUserName(userName);
                userInfo.setUserImg(userImg);
                await this.loginDAO.saveUserInfo(userInfo)
            }
            //把openid 保存到缓存中去
            this.redisDB.set(newUserInfoSessionId, uerInfo.openid);
            this.redisDB.expire(newUserInfoSessionId, 20)
            req.send({
                code: 200,
                sessionId: newUserInfoSessionId,
                firstTime: firstTime
            })

        } catch (e) {
            req.send({
                code: 500,
                sessionId: e.message
            })
        }

    }

    //用密码户登录密码
    async login(res, req) {
        const sendData = new SendData()
        try {
            let {password, userName} = res.body;
            if (userName === '') {
                req.send(sendData.getNoSendData('userName 不能为空'))
                return;
            }
            if (password === '') {
                req.send(sendData.getNoSendData('password 不能为空'))
                return;
            }
            const userInfo: UserInfo1 = await this.userInfoServer.getUserInfoByUserName(userName);
            if (!userInfo) {
                req.send(sendData.getNoSendData('用户名或者密码错误'));
            }
            const encryption = getEncryption();


            password = encryption.decryptByCrypto(password);
            password = encryption.hashPassword(password)
            if (password !== userInfo.password) {
                req.send(sendData.getNoSendData('密码错误'));
                return;
            }
            //存储信息
            res.session.user = {
                ...userInfo,
                password: undefined,
            };
            req.send(sendData.getOkSendData({}, '登录成功'));
        } catch (e) {
            req.send(sendData.getNoSendData(e.message));
        }

    }

    async signIn(res, req) {
        const sendData = new SendData();
        try {
            const userName = res.body.userName;
            const password = res.body.password;
            if (userName === '') {
                req.send(sendData.getNoSendData('userName 不能为空'))
                return;
            }
            if (password === '') {
                req.send(sendData.getNoSendData('password 不能为空'))
                return;
            }
            await this.userInfoServer.registerUser(userName, password);
            req.send(sendData.getOkSendData(null, '注册成功'))
        } catch (e) {
            req.send(sendData.getNoSendData(e.message));
        }
    }

    async logOut(res, req) {
        const sendData = new SendData();
        try {
            res.session.user && res.session.destroy((err) => {
                if (err) {
                    req.send(sendData.getNoSendData('退出登录失败'))
                } else {
                    req.clearCookie('connect.sid'); // 清除session cookie
                    req.send(sendData.getOkSendData());
                }
            });
        } catch (e) {
            req.send(sendData.getNoSendData(e.message));
        }
    }

    async getUserinfo(res, req) {
        const sendData = new SendData();
        try {
            const userinfo = await this.userInfoServer.getUserInfoByUserInfoID(res.session.user.userInfoID)
            req.send(sendData.getOkSendData({
                ...userinfo,
                password: undefined,
            }, '请求成功'));
        } catch (e) {
            req.send(sendData.getNoSendData(e.message));
        }
    }

    async bindingResumeID(res, req) {
        const sendData = new SendData();
        const resumeID = res.body.resumeID;
        const userInfoID = res.body.userInfoID;
        if (!resumeID) {
            req.send(sendData.getNoSendData('resumeID 不能为空'))
            return;
        }
        if (!userInfoID) {
            req.send(sendData.getNoSendData('userInfoID 不能为空'))
            return;
        }
        try {
            await this.userInfoServer.addResumeID(resumeID, userInfoID)
            req.send(sendData.getOkSendData(null, '关联成功'));
        } catch (e) {
            req.send(sendData.getNoSendData(e.message));
        }
    }
};

const login = new LoginController()

export function getLogins(): LoginController {
    return login
}


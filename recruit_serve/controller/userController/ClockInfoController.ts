import {ClockInfoDAO, getClockInfoDAO} from "../../DAO/ClockInfoDAO";
import {getRedisDB} from '../../db/readis/readis'
import {RedisClient} from "redis";
import {ClockInfo} from "../../models/ClockInfo";

interface ClockList {
    clockList:Array<ClockInfo>,
    pageTotal:number
}
export class ClockInfoController {
    private clockInfoDAO: ClockInfoDAO;
    private redisDB: RedisClient;


    constructor() {
        this.clockInfoDAO = getClockInfoDAO();
        this.redisDB = getRedisDB().getClient();
    };

    /**
     * 保存用户的评论信息
     * @param res
     * @param req
     */
    async saveUserClock(req, res) {
        let {userId, data} = req.body, clockInfoList: Array<ClockInfo>, datas: any;

        try {
            data = JSON.parse(data)
            if (!data.clockText || !data.clockImageList) {
                res.send({
                    code: 202,
                    mesg: '评论信息或图片为空'
                });
                return
            }
            //返回用户的userId
            //产看该用户是否评论过
            clockInfoList = await this.clockInfoDAO.getClockDetailByUserId(userId, Number(data.scenicId));
            if (clockInfoList.length > 0) {
                res.send({
                    code: 201,
                    mesg: '用户已经评论过了'
                })
                return
            }
            datas = await this.clockInfoDAO.saveUserClocl(Object.assign(new ClockInfo(userId), data));
            res.send({
                code: 200,
                data: {
                    clockInfoId: datas.insertId
                }
            })
        } catch (e) {
            res.send({
                code: 500,
                mesg: e.message
            })
        }
    };

    /**
     * 根据景点ID返回评论
     * @param req
     * @param res
     */
    async getClockListByScenicId(req, res)  {
        let {scenicId, page} = req.body,
            clockList:ClockList,
            {pageNumber, pageWhich, pageTotal} = JSON.parse(page);
             pageWhich = (pageWhich-1)*pageNumber

        try {
            clockList = await this.clockInfoDAO.getClockListyScenicId(Number(scenicId),Number(pageWhich),Number(pageNumber));
            res.send({
                code: 200,
                data: clockList
            })

        } catch (e) {
            res.send({
                code: 500,
                mesg: e.message
            })
        }
    };

    /**
     * 保存用户的分享照片到数据库
     * @param req
     * @param res
     */
    async saveClockCanvasImage(req, res) {
        let {clockInfoId, canvasImg} = req.body;
        try {
            await this.clockInfoDAO.saveClockCanvasImg(clockInfoId, canvasImg);
            res.send({
                code: 200,
            })
        } catch (e) {
            res.send({
                code: 500,
                mesg: e.message
            })
        }


    };


    /**
     * 根据评论的Id返回该评论的详细信息
     */
    async getClockDetailsByClockInfoId(req, res) {
        let {clockInfoId} = req.body, clockDateil: ClockInfo;
        try {
            clockDateil = await this.clockInfoDAO.getClockDetailsByClockInfoId(clockInfoId);

            res.send({
                code: 200,
                data: clockDateil
            })
        } catch (e) {
            res.send({
                code: 500,
                mesg: e.message
            })
        }


    };


    /**
     * 根据userId 和sessionId判断是不是一个人;
     */

    async isSessionEqueiUserId(req, res) {
        let {userId, userIds} = req.body;
        if (!userId || !userIds) {
            res.send({
                code: 202,
                mesg: '参数有误'
            })
            return
        }
        try {

            res.send({
                code: 200,
                data: userId === userIds
            })


        } catch (e) {
            res.send({
                code: 500,
                mesg: e.message
            })
        }

    }


    /**
     *
     * 点赞评论
     * @param req
     * @param res
     */
    async gotoGiveLike(req, res) {
        let {datetime, userId, clockInfoId} = req.body, clockDateil: ClockInfo;
        try {
            if (!datetime || !userId || !clockInfoId) {
                res.send({
                    code: 202,
                    mesg: '参数有误'
                })
                return
            }
            clockDateil = await this.clockInfoDAO.getClockDetailsByClockInfoId(clockInfoId);
            if (clockDateil.getUserId() === userId) {
                res.send({
                    code: 201,
                    mesg: '自己个不能给自己个点赞'
                })
                return
            }
            await this.clockInfoDAO.saveGiveLcik(datetime, userId, clockInfoId)
            res.send({
                code: 200,
            })

        } catch (e) {
            res.send({
                code: 500,
                mesg: e.message
            })
        }

    }


    /**
     * pageNumber, pageInation,
     * 根据景点的id 返回当前景点点赞的排行榜
     * @param req
     * @param res
     */
    async getClockGiveLikeList(req, res) {
        try {
            let {scenicId} = req.body,
                clockInfo: Array<ClockInfo>;
            clockInfo = await this.clockInfoDAO.getGivelickListByClockInfoId(Number(scenicId));
            res.send({
                code: 200,
                data: clockInfo

            })

        } catch (e) {
            res.send({
                code: 500,
                mesg: e.message

            })
        }
    };
};

const clockInfoController = new ClockInfoController()

export function getClockInfoController(): ClockInfoController {
    return clockInfoController
}

import {getMySqlDB, MySqlDB} from "../db/mySql/mySql";
import {CLOCKINFOSQL, STATCISQL} from "../DAO/sql"
import {ClockInfo} from "../models/ClockInfo"
import {OSSController, getOSSController} from "../controller/userController/OSSController";
import {strict} from "assert";
import ts from "typescript/lib/tsserverlibrary";
import createInstallTypingsRequest = ts.server.createInstallTypingsRequest;
import {GiveLike} from "../models/GiveLike";

export class ClockInfoDAO {
    private mySqlDB: MySqlDB;
    private oSSController: OSSController;

    constructor() {
        this.mySqlDB = getMySqlDB();
        this.oSSController = getOSSController();
    }

    /**
     * 保存用户的评论到数据库
     * @param userInfo
     */
    public async saveUserClocl(clockInfo: ClockInfo): Promise<any> {
        let values: Array<string | number>;
        values = [
            clockInfo.getScenicId(),
            clockInfo.getUserId(),
            clockInfo.getClockTime(),
            clockInfo.getClockImageList(),
            clockInfo.getClockText(),
            clockInfo.getUserName(),
            clockInfo.getUserImg(),

        ]
        try {
            let data: any = await this.mySqlDB.executeSql(STATCISQL.insertIntoClockInfo, values);
            if (data.affectedRows !== 1) {
                throw Error('数据库操作失败')
            }
            return data
        } catch (e) {
            throw e
        }
    };


    /**
     * 根据用户号的id 和 景点的ID 返回该用户在该景点的评论信息
     * @param userId
     * @param scenicId
     */
    public async getClockDetailByUserId(userId: string, scenicId: number): Promise<any> {
        try {
            let data: any = await this.mySqlDB.executeSql(STATCISQL.selectClockWhereUserIdAndScenicId, [userId, scenicId]);
            return data.map(item => {
                return Object.assign(new ClockInfo(item.userId), item)
            })
        } catch (e) {
            throw  e
        }
    };

    public async getClockListyScenicId(scenicId: number, pageWhich: number, pageNumber: number): Promise<any> {
        let clockImageList: Array<string>;
            try {
                let data: any = await this.mySqlDB.executeSql(STATCISQL.selectClockListWhereScenicId, [scenicId, pageWhich, pageNumber]);

                return {
                    clockList: data[0].map(item => {
                        item.clockImageLists = item.clockImageList.split(',').map(items => {
                            return this.oSSController.signatureUrl(items)
                        });
                        return Object.assign(new ClockInfo(item.userId), item)
                    }),
                    pageTotal: data[1][0]['pageTotal']
                }
            } catch (e) {
                throw e
            }
    };

    public async saveClockCanvasImg(clockInfoId: string, canvasImg: string): Promise<any> {
        try {
            this.mySqlDB.executeSql(STATCISQL.updateClcokCanvasImg, [canvasImg, clockInfoId])


        } catch (e) {
            throw e
        }
    }

    /**
     * 根据品论的Id返回用户的额信息
     * @param clockInfoId
     */
    public async getClockDetailsByClockInfoId(clockInfoId: string): Promise<any> {
        let data: any;
        try {
            data = await this.mySqlDB.executeSql(STATCISQL.selectClcokInfoByClockInfoId, [clockInfoId])
            if (data.length != 1) {
                throw "评论id有误"
            }
            data[0].clockImageLists = data[0].clockImageList.split(',').map(items => {
                return this.oSSController.signatureUrl(items)
            });
            return Object.assign(new ClockInfo(data[0].userId), data[0])

        } catch (e) {
            throw e
        }

    }

    /**
     *保存用户的点赞的信息
     * @param datetime 点赞时间
     * @param userId 点赞人的id
     * @param clockInfoId 被点赞的评论的id
     */
    public async saveGiveLcik(datetime: string, userId: string, clockInfoId: string): Promise<any> {
        let data: any;

        try {

            data = this.mySqlDB.executeSql(STATCISQL.insertGiveLick, [datetime, clockInfoId, userId])
            if (data.affectedRows != 1) {
                throw '数据库异常'
            }
        } catch (e) {

        }
    }

    public async getGivelickListByClockInfoId(scenicId: number): Promise<any> {
        try {
            let data: any;
            data = await this.mySqlDB.executeSql(CLOCKINFOSQL.getGiveLikeListByClockId, [scenicId]);
            return data.map(item => {
                return Object.assign(new ClockInfo(item.userId), item)
            })

        } catch (e) {
            throw e
        }


        return undefined;
    }
}

let clockInfoDAO = new ClockInfoDAO()

export function getClockInfoDAO(): ClockInfoDAO {
    return clockInfoDAO
}

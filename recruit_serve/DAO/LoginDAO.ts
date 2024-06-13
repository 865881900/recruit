import {getMySqlDB, MySqlDB} from "../db/mySql/mySql";
import {STATCISQL} from "../DAO/sql"
import {UserInfo} from "../models/UserInfo"

export class LoginDAO {
    private mySqlDB: MySqlDB;
    constructor() {
        this.mySqlDB = getMySqlDB();
    }

    /**
     * 保存用户的信息
     * @param userInfo
     */
    public async saveUserInfo(userInfo:UserInfo): Promise<any> {
        try {
            let data:any = await  this.mySqlDB.executeSql(STATCISQL.insertIntoUserInfo,[userInfo.getOpenId(),userInfo.getSessionId(),userInfo.getUserName(),userInfo.getUserImg()])
            if(data.affectedRows =! 1){
                throw Error('数据库操作失败')
            }
        } catch (e) {
            throw e
        }
    };

    /**
     * 根据用户额openid 返回该用户的信息
     * @param openid
     */
    public async getUserInfoByOpenid(openid:string): Promise<any> {
        try {
            let data:any = await  this.mySqlDB.executeSql(STATCISQL.selectUserInfoByOpenid,[openid]);
            if(data.length > 1){
                throw Error('数据库查询失败')
            }
            return Object.assign(new UserInfo(openid),data[0]);
        } catch (e) {
            throw e
        }
    };


    public async updateUserInfoByOpenid(userInfo:UserInfo): Promise<any> {
        try {
            let data:any = await  this.mySqlDB.executeSql(STATCISQL.updateUserInfoByOpenid,
                [userInfo.getSessionId(),userInfo.getUserName(),userInfo.getUserImg(),userInfo.getOpenId()]);
            if(data.changedRows != 1){
                throw Error('数据库修改失败')
            }
        } catch (e) {
            throw e
        }
    };



}

let loginDAO = new LoginDAO()

export function getLoginDAO(): LoginDAO {
    return loginDAO
}

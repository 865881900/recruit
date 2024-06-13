import {getMySqlDB} from "../../db/mySql/mySql";
import {STATCISQL, USERSQL} from "../sql";
import {Scenic} from "../../models/Scenic";
import {UserInfo} from "../../models/JobApplication/UserInfo";

export class UserInfoDAO {
    private mySqlDB: any;

    constructor() {
        this.mySqlDB = getMySqlDB();
    }

    // 在数据中插入用户信息
    public async saveUserInfo(userInfo: UserInfo): Promise<void> {
        try {
            const data: any = await this.mySqlDB.executeSql(USERSQL.insertIntoUserInfo, [
                userInfo.userName,
                userInfo.password,
                userInfo.name,
                userInfo.userInfoID
            ]);
            if (data.affectedRows !== 1) {
                throw Error('数据库操作失败')
            }
        } catch (e) {
            throw e
        }
    }


    // 根据用户名称查询用户信息
    public async getUserInfoByUserName(userName: string): Promise<UserInfo> {
        try {
            const data: Array<UserInfo> = await this.mySqlDB.executeSql(USERSQL.selectUserInfoByUserName, [userName]);
            return data[0]
        } catch (e) {
            throw e
        }
    }

    // 根据用户名称查询用户信息
    public async getUserInfoByUserInfoID(userInfoID: string): Promise<UserInfo> {
        try {
            const data: Array<UserInfo> = await this.mySqlDB.executeSql(USERSQL.selectUserInfoByUserID, [userInfoID]);
            return data[0]
        } catch (e) {
            throw e
        }
    }

    // 根据用户名称查询用户信息
    public async updateUserInfoByUserInfoID(
        resumeID: string,
        userInfoID: string
    ): Promise<void> {
        try {
            const data: any = await this.mySqlDB.executeSql(USERSQL.updateUserInfoByUserInfoID, [resumeID, userInfoID]);
            if (data.affectedRows !== 1) {
                throw Error('数据库操作失败')
            }
        } catch (e) {
            throw e
        }
    }
}

const userInfoDAO: UserInfoDAO = new UserInfoDAO();

export function getUserInfoDAO(): UserInfoDAO {
    return userInfoDAO
}

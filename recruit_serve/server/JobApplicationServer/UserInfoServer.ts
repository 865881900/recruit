import {getUserInfoDAO, UserInfoDAO} from "../../DAO/JobApplicationDAO/UserInfoDAO";
import {UserInfo} from "../../models/JobApplication/UserInfo";
import {Company} from "../../models/JobApplication/Company";
import {getEncryption} from "../../utils/encryption";
import {OperateData} from "../../utils/OperateData";


export class UserInfoServer {
    userInfoDAO: UserInfoDAO

    constructor() {
        this.userInfoDAO = getUserInfoDAO();
    }

    // 注册用户
    async registerUser(userName: string, password: string): Promise<any> {
        try {
            const _userInfo: UserInfo = await this.userInfoDAO.getUserInfoByUserName(userName);
            if (_userInfo) {
                throw new Error('用户名称重复');
            }
            const userInfo: UserInfo = new UserInfo();
            userInfo.userName = userName;
            userInfo.password = getEncryption().hashPassword(password);
            userInfo.userInfoID = OperateData.createId('userInfoID')
            userInfo.name = OperateData.createId(userName)
            await this.userInfoDAO.saveUserInfo(userInfo);

        } catch (e) {
            throw new Error(e.message)
        }
    }

    // 根据用户名返回用户信息
    async getUserInfoByUserName(userName: string): Promise<UserInfo> {
        try {
            const userInfo: UserInfo = await this.userInfoDAO.getUserInfoByUserName(userName);
            if (!userInfo) {
                throw new Error('用户不存在');
            }
            return userInfo;
        } catch (e) {
            throw new Error(e.message)
        }
    }

    async getUserInfoByUserInfoID(userInfoID: string): Promise<UserInfo> {
        try {
            const userInfo: UserInfo = await this.userInfoDAO.getUserInfoByUserInfoID(userInfoID);
            if (!userInfo) {
                throw new Error('用户不存在');
            }
            return userInfo;
        } catch (e) {
            throw new Error(e.message)
        }
    }

    async addResumeID(
        resumeID: string,
        userInfoID: string
    ) {
        try {
            const user = await this.userInfoDAO.getUserInfoByUserInfoID(userInfoID);
            if (!user) {
                throw new Error('用户不存在');
            }
            await this.userInfoDAO.updateUserInfoByUserInfoID(resumeID, userInfoID);
        } catch (e) {
            throw new Error(e.message)
        }
    }

//     updateUserInfoByUserInfoID
}

const userInfoServer: UserInfoServer = new UserInfoServer();

export function getUserInfoServer(): UserInfoServer {
    return userInfoServer;
}

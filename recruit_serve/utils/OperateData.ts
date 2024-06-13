import * as UUID from "node-uuid";
import * as md5 from "md5";

/**
 * 操作原数据的静态工具类
 * 加密, 生成随机数 等
 */
export class OperateData {
    // private static readonly TYPELIST = ['userId', 'userInfoId', 'url']

    /**
     * 根据id类型返回一个id
     * @param idType id的类型
     */
    public static createId(idType: string) {
        let replaceAll = `${idType.toUpperCase()}${UUID.v1()}`
        // @ts-ignore
        return replaceAll.replaceAll('-','x');
    };

    /**
     * 用md5加密
     * @param password
     */
    public static MD5(password:string) {
        return md5(password);
    }

}

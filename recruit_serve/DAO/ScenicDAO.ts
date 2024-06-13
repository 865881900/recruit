import {getMySqlDB, MySqlDB} from "../db/mySql/mySql";
import {STATCISQL} from "../DAO/sql"
import {Scenic} from "../models/Scenic"

export class ScenicDAO {
    private mySqlDB: MySqlDB;

    constructor() {
        this.mySqlDB = getMySqlDB();
    }

    /**
     * 请求数据库中的所有的景点信息
     * @param captchasId
     */
    public async getScenicList(): Promise<any> {
        try {
            let data: any, datas: Array<Scenic>;
            data = await this.mySqlDB.executeSql(STATCISQL.selectScenicSQL);
            if (data.length == 0) {
                throw Error('请求数据库资源失败')
            }
            datas = data.map((item) => {
                return Object.assign(new Scenic(item.scenicId), item)
            })

            return datas
        } catch (e) {
            throw e
        }
    };


    public async getScenicClock(userId: string): Promise<any> {
        try {
            return await this.mySqlDB.executeSql(STATCISQL.getScenicClockSQL,[userId]);
        } catch (e) {
            throw e
        }
    };

}

let scenicDAO = new ScenicDAO()

export function getScenicDAO(): ScenicDAO {
    return scenicDAO
}

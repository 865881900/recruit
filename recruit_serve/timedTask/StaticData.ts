import {getRedisDB, RedisDB} from "../db/readis/readis";
import {MySqlDB, getMySqlDB} from "../db/mySql/mySql";


class StaticData {
    private readisDB: RedisDB;
    private mySqlDB: MySqlDB;
    private sataicDataList: Array<any>

    constructor() {
        this.readisDB = getRedisDB();
        this.mySqlDB = getMySqlDB();
    }

    public setSataicDataList(sataicDataList: Array<any>): void {
        this.sataicDataList = sataicDataList;
    };

    public getSataicDataList(): Array<any> {
        return this.sataicDataList;
    };

    public async readStaticDataToMysql() {
            //读取轮播图

            //读取
    };

    public async readStaticDataToRedis() {

    }

    public async writeStaticToRedis() {

    }
}

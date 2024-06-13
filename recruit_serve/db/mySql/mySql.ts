import {Connection, ConnectionConfig, Query} from "mysql";
import {poolConfig} from "../../config/default";

const mssql = require("mysql");

const pool = mssql.createPool(poolConfig);




/**
 * 创建一个mySQL链接
 */
export class MySqlDB {
    /**
     * 执行
     * @param sql 需要执行的SQL语句
     * @param values 需要操作的数字
     * @return 返回一个promise对象
     */
    executeSql(sql: string, values: Array<any> = []): Promise<Object> {
        if (!(this instanceof MySqlDB)) {
            throw new Error('使用executeSql,必须是对象')
        }
        return new Promise((resolve, reject) => {
            pool.getConnection(function(err, connection) {
                connection.query(sql, values, function (err, result,fields) {
                    if (err) {
                        reject(err);
                    }
                    resolve(result)
                    connection.release(); //关闭连接
                });
            })
        })
    };
}
const mySqlDB = new MySqlDB()
export function getMySqlDB():MySqlDB{
    return mySqlDB
}


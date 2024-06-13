import {Company} from "../../models/JobApplication/Company";
import {COMPANYSQL} from "../sql";
import {getMySqlDB} from "../../db/mySql/mySql";

export class CompanyDAO {
    private mySqlDB: any;

    constructor() {
        this.mySqlDB = getMySqlDB();
    }

    /**
     * 创建新的企业
     * @param company 企业的实体
     */
    public async createCompany(company: Company): Promise<void> {
        try {
            let data: any = await this.mySqlDB.executeSql(COMPANYSQL.insertIntoCompany, [
                company.companyID,
                company.companyName,
                company.companyLogo,
                company.companyAddress,
                company.companySize,
                company.companyIntroduction,
                company.companyType,
            ])
            if (data.affectedRows !== 1) {
                throw Error('数据库操作失败')
            }
        } catch (e) {
            throw e
        }
    };

    // 修改企业信息
    async updateCompany(company: Company): Promise<void> {
        try {
            let data: any = await this.mySqlDB.executeSql(COMPANYSQL.updateCompany, [
                company.companyName,
                company.companyLogo,
                company.companyAddress,
                company.companySize,
                company.companyIntroduction,
                company.companyType,
                company.companyID
            ])
            if (data.affectedRows !== 1) {
                throw Error('修改数据库失败')
            }
        } catch (e) {
            throw e
        }
    };

    // 根据企业名称模糊查询, 企业类型, 分页查询
    async selectCompanyList(pageSize: number, pageNumber: number, companyName?: string, companyType?: string): Promise<Array<Company>> {
        try {
            const isCompanyType = companyType === "";
            const isCompanyName = companyName === ""
            const sql = COMPANYSQL.selectCompanyByCompanyNameLike(isCompanyType, isCompanyName);
            let valueList = [
                `%${companyName}%`,
                companyType,
                Number(pageNumber),
                Number(pageSize)
            ];
            if (isCompanyType) {
                valueList.splice(1, 1)
            }
            if (isCompanyName) {
                valueList.splice(0, 1)
            }
            let data: any = await this.mySqlDB.executeSql(sql, valueList)
            return data
        } catch (e) {
            throw e
        }
    }

    // 统计
    async selectCompanyCount(pageSize: number, pageNumber: number, companyName?: string, companyType?: string): Promise<number> {
        try {
            const isCompanyType = companyType === "";
            const isCompanyName = companyName === ""
            const sql = COMPANYSQL.selectCompanyByCompanyNameCount(isCompanyType, isCompanyName);
            let valueList = [
                `%${companyName}%`,
                companyType
            ];
            if (isCompanyType) {
                valueList.splice(1, 1)
            }
            if (isCompanyName) {
                valueList.splice(0, 1)
            }
            let data: any = await this.mySqlDB.executeSql(sql, valueList);
            return data[0]['COUNT(*)']
        } catch (e) {
            throw e
        }
    }

    // 根据id返回企业的信息
    async getCompanyByCompanyId(companyID: string): Promise<Company> {
        try {
            let data: any = await this.mySqlDB.executeSql(COMPANYSQL.selectCompanyByCompanyID, [
                companyID
            ])
            if (data.length > 1) {
                throw Error('数据库查询失败')
            }
            return data[0]
        } catch (e) {
            throw e
        }
    }

    //  根据企业名称返回企业的信息
    async getCompanyByCompanyName(companyName: string): Promise<Array<Company>> {
        try {
            let data: Array<Company> = await this.mySqlDB.executeSql(COMPANYSQL.selectCompanyByCompanyName, [
                companyName
            ])
            return data
        } catch (e) {
            throw e
        }
    }

    // 根据表名称返回该表的所有信息
    async getAllCompany(tableName): Promise<Array<any>> {
        try {
            let data: Array<Company> = await this.mySqlDB.executeSql(COMPANYSQL.selectCompanyByTableName, [tableName])
            return data
        } catch (e) {
            throw e
        }
    }
    // 返回省市两级的信息
    async selectRegionEnum(id: string): Promise<Array<any>> {
        try {
            let data: Array<Company> = await this.mySqlDB.executeSql(COMPANYSQL.selectRegionEnum(), [id])
            return data
        } catch (e) {
            throw e
        }
    }

}

const companyDAO = new CompanyDAO();

export function getCompanyDAO() {
    return companyDAO
}
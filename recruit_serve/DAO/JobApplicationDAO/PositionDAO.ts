import {Position} from "../../models/JobApplication/Position";
import {POSITIONSQL} from "../sql";
import {getMySqlDB} from "../../db/mySql/mySql";

export class PositionDAO {
    private mySqlDB: any;

    constructor() {
        this.mySqlDB = getMySqlDB();
    }

    // 创建新岗位
    public async createPosition(position: Position): Promise<void> {
        try {
            let data: any = await this.mySqlDB.executeSql(POSITIONSQL.insertIntoPosition, [
                position.positionID,
                position.positionName,
                position.positionDescription,
                Number(position.recruitmentNumber),
                position.salaryRange,
                position.highlight,
                position.responsibilities,
                position.requirements,
                position.educationRequirement,
                position.companyID,
                position.positionType,
            ])
            if (data.affectedRows !== 1) {
                throw Error('数据库操作失败')
            }
        } catch (e) {
            throw e
        }
    };

    // 修改岗位信息
    public async updatePosition(position: Position): Promise<void> {
        try {
            let data: any = await this.mySqlDB.executeSql(POSITIONSQL.updatePosition, [
                position.positionName,
                position.positionDescription,
                Number(position.recruitmentNumber),
                position.salaryRange,
                position.highlight,
                position.responsibilities,
                position.requirements,
                position.educationRequirement,
                position.positionType,
                position.positionID,
            ])
            if (data.affectedRows !== 1) {
                throw Error('数据库操作失败')
            }
        } catch (e) {
            throw e
        }
    };

    // 根据岗位id删除岗位信息
    async deletePosition(positionID: string): Promise<void> {
        try {
            let data: any = await this.mySqlDB.executeSql(POSITIONSQL.deletePosition, [
                positionID
            ])
        } catch (e) {
            throw e
        }
    };

    // 根据企业id返回招聘数组
    async getPositionListByCompanyId(companyID: string): Promise<Array<Position>> {
        try {
            let data: any = await this.mySqlDB.executeSql(POSITIONSQL.selectPositionByCompanyID, [
                companyID
            ])
            return data
        } catch (e) {
            throw e
        }
    }

    // 根据查询条件返回招聘数组
    async selectPositionList(pageSize: number, pageNumber: number, companyID: string = ''): Promise<Array<Position>> {
        try {
            const isCompanyID = companyID === '';
            const valueList = [
                companyID,
                Number(pageNumber),
                Number(pageSize)
            ];
            if (isCompanyID) {
                valueList.splice(0, 1);
            }
            let data: Array<Position> = await this.mySqlDB.executeSql(POSITIONSQL.selectPositionList(isCompanyID), valueList)
            return data
        } catch (e) {
            throw e
        }
    }
    // 根据条件统计统计
    async selectPositionCount(pageSize: number, pageNumber: number, companyID: string = ''): Promise<number> {
        try {
            const isCompanyID = companyID === ''
            const valueList = [
                companyID,
            ];
            if (isCompanyID) {
                valueList.splice(0, 1);
            }
            let data: Array<Position> = await this.mySqlDB.executeSql(POSITIONSQL.selectPositionCount(isCompanyID), valueList)
            return data[0]['COUNT(*)']
        } catch (e) {
            throw e
        }
    }
    // 根据id返回岗位
    async getPositionByPositionID(positionID: string): Promise<Position> {
        try {
            let data: any = await this.mySqlDB.executeSql(POSITIONSQL.selectPositionByPositionID, [
                positionID
            ])
            if(data.length > 1 || data.length === 0) {
                throw new Error('查询岗位信息失败')
            }
            return data[0]
        } catch (e) {
            throw e
        }
    }
}

const positionDAO = new PositionDAO();

export function getPositionDAO() {
    return positionDAO
}

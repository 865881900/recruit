import {Company} from "../../models/JobApplication/Company";
import {RESUMESQL} from "../sql";
import {getMySqlDB} from "../../db/mySql/mySql";
import {Resume} from "models/JobApplication/Resumes";
import {WorkExperience} from "models/JobApplication/WorkExperience";
import {EducationHistory} from "../../models/JobApplication/EducationHistory";
import {Application} from "../../models/JobApplication/Application";
import {PagingSearch} from "../../models/PagingSearch";

export class ResumeDAO {
    private mySqlDB: any;

    constructor() {
        this.mySqlDB = getMySqlDB();
    }

    /** 简历 */
    // 创建简历个人信息
    public async createResume(resume: Resume): Promise<void> {
        try {
            let data: any = await this.mySqlDB.executeSql(RESUMESQL.insertIntoResume, [
                resume.name,
                resume.avatar,
                resume.gender,
                resume.birthday,
                resume.email,
                resume.iDNumber,
                resume.phoneNumber,
                resume.weChat,
                resume.ethnicity,
                resume.politicalStatus,
                resume.earliestStartDate,
                resume.socialProfile,
                resume.jobSeekerStatus,
                resume.personalStatement,
                resume.resumeID,
            ])
            if (data.affectedRows !== 1) {
                throw Error('数据库操作失败')
            }
        } catch (e) {
            throw e
        }
    };

    // 根据id返回简历信息
    public async getResumeByResumeId(resumeID: string): Promise<Resume> {
        try {
            let data: any = await this.mySqlDB.executeSql(RESUMESQL.selectResumeByResumeID, [resumeID])
            return data[0]
        } catch (e) {
            throw e
        }
    };

    // 修改简历个人信息
    public async updateResume(resume: Resume): Promise<void> {
        try {
            let data: any = await this.mySqlDB.executeSql(RESUMESQL.updateResume, [
                resume.name,
                resume.avatar,
                resume.gender,
                resume.birthday,
                resume.email,
                resume.iDNumber,
                resume.phoneNumber,
                resume.weChat,
                resume.ethnicity,
                resume.politicalStatus,
                resume.earliestStartDate,
                resume.socialProfile,
                resume.jobSeekerStatus,
                resume.personalStatement,
                resume.resumeID
            ])
            if (data.affectedRows !== 1) {
                throw Error('数据库操作失败')
            }
        } catch (e) {
            throw e
        }
    };

    /** 教育经历 */
    // 添加教育经历
    public async addEducationHistory(educationHistory: EducationHistory): Promise<void> {
        try {

            let data: any = await this.mySqlDB.executeSql(RESUMESQL.insertIntoEducationHistory, [
                educationHistory.schoolName,
                educationHistory.major,
                educationHistory.degree,
                educationHistory.startDate,
                educationHistory.resumeID,
                educationHistory.city,
                educationHistory.endDate,
                educationHistory.educationDescription,
                educationHistory.educationID,
            ])
            if (data.affectedRows !== 1) {
                throw Error('数据库操作失败')
            }
        } catch (e) {
            throw e
        }
    };

    // 根据id返回教育经历
    public async getEducationHistoryByEducationID(educationID: string): Promise<EducationHistory> {
        try {
            let data: any = await this.mySqlDB.executeSql(RESUMESQL.selectEducationHistoryByEducationID, [educationID])
            return data[0]
        } catch (e) {
            throw e
        }
    };

    // 删除教育经历
    public async removeEducationHistory(educationID: string): Promise<void> {
        try {
            await this.mySqlDB.executeSql(RESUMESQL.deleteEducationHistory, [
                educationID,
            ])
        } catch (e) {
            throw e
        }
    };

    // 修改教育经历
    public async updateEducationHistory(educationHistory: EducationHistory): Promise<void> {
        try {
            let data: any = await this.mySqlDB.executeSql(RESUMESQL.updateEducationHistory, [
                educationHistory.schoolName,
                educationHistory.major,
                educationHistory.degree,
                educationHistory.startDate,
                educationHistory.city,
                educationHistory.endDate,
                educationHistory.educationDescription,
                educationHistory.educationID,
            ])

            if (data.affectedRows !== 1) {
                throw Error('数据库操作失败')
            }
        } catch (e) {
            throw e
        }
    };

    // 根据简历ID返回教育经历数组
    public async selectEducationHistoryByResumeID(resumeID: string): Promise<Array<EducationHistory>> {
        try {
            let data: any = await this.mySqlDB.executeSql(RESUMESQL.selectEducationHistoryByResumeID, [resumeID])
            return data
        } catch (e) {
            throw e
        }
    };

    /** 工作经历 */
    // 添加工作经历
    public async addWorkExperience(workExperience: WorkExperience): Promise<void> {
        try {
            let data: any = await this.mySqlDB.executeSql(RESUMESQL.insertIntoWorkExperience, [
                workExperience.jobType,
                workExperience.companyName,
                workExperience.positionTitle,
                workExperience.startDate,
                workExperience.resumeID,
                workExperience.city,
                workExperience.endDate,
                workExperience.jobDescription,
                workExperience.experienceID
            ])
            if (data.affectedRows !== 1) {
                throw Error('数据库操作失败')
            }
        } catch (e) {
            throw e
        }
    };

    // 根据id返回工作经历
    public async getWorkExperienceByExperienceID(experienceID: string): Promise<WorkExperience> {
        try {
            let data: any = await this.mySqlDB.executeSql(RESUMESQL.selectWorkExperienceByExperienceID, [experienceID])
            return data[0]
        } catch (e) {
            throw e
        }
    };

    // 删除工作经历
    public async removeWorkExperience(experienceID: string): Promise<void> {
        try {
            await this.mySqlDB.executeSql(RESUMESQL.deleteWorkExperience, [
                experienceID,
            ])
        } catch (e) {
            throw e
        }
    };

    // 修改工作经历
    public async updateWorkExperience(workExperience: WorkExperience): Promise<void> {
        try {
            let data: any = await this.mySqlDB.executeSql(RESUMESQL.updateWorkExperience, [
                workExperience.jobType,
                workExperience.companyName,
                workExperience.positionTitle,
                workExperience.startDate,
                workExperience.city,
                workExperience.endDate,
                workExperience.jobDescription,
                workExperience.experienceID
            ])
            if (data.affectedRows !== 1) {
                throw Error('数据库操作失败')
            }
        } catch (e) {
        }
    }

    // 根据简历ID返回工作经历数组
    public async selectWorkExperienceByResumeID(resumeID: string): Promise<Array<WorkExperience>> {
        try {
            let data: any = await this.mySqlDB.executeSql(RESUMESQL.selectWorkExperienceByResumeID, [resumeID])
            return data
        } catch (e) {
            throw e
        }
    };

    // 投递简历
    public async addApplication(application: Application): Promise<void> {
        try {
            let data: any = await this.mySqlDB.executeSql(RESUMESQL.insertIntoApplication, [
                application.companyID,
                application.positionID,
                application.resumeID,
                application.applicationID,
                application.applicationKey
            ])
            if (data.affectedRows !== 1) {
                throw Error('数据库操作失败')
            }
        } catch (e) {
            throw e
        }
    };
    public async selectApplicationByApplicationId(applicationID: string) {
        try {
            let data: any = await this.mySqlDB.executeSql(RESUMESQL.selectApplication, [
                applicationID
            ])
            return data[0]
        } catch (e) {
            throw e
        }
    }


    //根据企业id,简历id,岗位id返回投递详情
    public async getApplicationByApplicationKey(
        companyID: string,
        positionID: string,
        resumeID: string,
    ): Promise<Number> {
        try {
            let data: any = await this.mySqlDB.executeSql(RESUMESQL.selectApplicationByApplicationID, [
                companyID,
                positionID,
                resumeID
            ])
            return data[0]['COUNT(*)']
        } catch (e) {
            throw e
        }
    };

    //根据投递Id返回投递详情
    public async selectApplicationById(
        companyID: string,
        positionID: string,
        resumeID: string,
    ): Promise<Application> {
        try {
            let data: any = await this.mySqlDB.executeSql(RESUMESQL.selectApplicationById, [
                companyID,
                positionID,
                resumeID
            ])
            return data[0]
        } catch (e) {
            throw e
        }
    };

    async updateApplicationsCreatePdf(applicationID) {
        try {
            let data: any = await this.mySqlDB.executeSql(RESUMESQL.updateApplicationsCreatePdf, [applicationID])
            if (data.affectedRows !== 1) {
                throw Error('数据库操作失败')
            }
        } catch (e) {
            throw e
        }
    }

    // 根据企业id, 岗位id, 投递时间分页查询简历
    async selectResumeList(
        pagingSearch: PagingSearch<Application>,
        application: Application,
        positionType?: string
    ): Promise<Array<any>> {
        try {
            const _data: {
                sql: string,
                queryData: Array<Date | string | number>
            } = this._setSql(pagingSearch, application, positionType)
            _data.queryData.push(pagingSearch.pageNumber, pagingSearch.pageSize)
            const sql = RESUMESQL.selectResumeLike(_data.sql);
            let data: any = await this.mySqlDB.executeSql(sql, _data.queryData)
            return data
        } catch (e) {
            throw e
        }
    }

    // 统计
    async selectResumeCount(
        pagingSearch: PagingSearch<Application>,
        application: Application,
        positionType?: string
    ): Promise<number> {
        try {
            const _data: {
                sql: string,
                queryData: Array<Date | string | number>
            } = this._setSql(pagingSearch, application, positionType)
            const sql = RESUMESQL.selectResumeCount(_data.sql);
            let data: any = await this.mySqlDB.executeSql(sql, _data.queryData)
            return data[0]['COUNT(*)']
        } catch (e) {
            throw e
        }
    }


    _setSql(
        pagingSearch: PagingSearch<Application>,
        application: Application,
        positionType?: string
    ): {
        sql: string,
        queryData: Array<Date | string>
    } {
        const queryStr: Array<string> = [];
        const queryData: Array<Date | string> = [];
        const aQuery: Array<string> = ['companyID', 'positionID', 'applicationKey'];
        const pQuery: Array<string> = ['positionType'];

        if (pagingSearch.startData && pagingSearch.endData) {
            queryStr.push(`createDate BETWEEN ? AND ?`);
            queryData.push(pagingSearch.startData, pagingSearch.endData);
        }
        if(positionType) {
            queryStr.push(`p.positionType=?`);
            queryData.push(positionType)
        }
        aQuery.forEach(item => {
            if (application[item]) {
                queryStr.push(`a.${item}${item !== 'applicationKey' ? '=?' : ' LIKE ?'}`);
                queryData.push(item !== 'applicationKey' ? application[item] : `%${application[item]}%`)
            }
        })
        const sql = `${queryStr.length > 0 ? `WHERE ${queryStr.join(' AND ')}` : ''} `
        return {
            sql,
            queryData
        }
    }
}

const resumeDAO = new ResumeDAO();

export function getResumeDAO() {
    return resumeDAO
}

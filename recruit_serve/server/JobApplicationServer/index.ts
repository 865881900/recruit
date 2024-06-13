import {CompanyDAO, getCompanyDAO} from "../../DAO/JobApplicationDAO/CompanyDAO";
import {Company} from "../../models/JobApplication/Company";
import {Position} from "../../models/JobApplication/Position";
import {getPositionDAO, PositionDAO} from "../../DAO/JobApplicationDAO/PositionDAO";
import {PagingSearch} from "../../models/PagingSearch";
import {getResumeDAO, ResumeDAO} from "../../DAO/JobApplicationDAO/ResumeDAO";
import {Resume} from "../../models/JobApplication/Resumes";
import {WorkExperience} from "../../models/JobApplication/WorkExperience";
import {EducationHistory} from "../../models/JobApplication/EducationHistory";
import {Application} from "../../models/JobApplication/Application";
import Verify from "../../utils/verify";

export class JobApplicationServer {
    private companyDAO: CompanyDAO;
    private positionDAO: PositionDAO;
    private resumeDAO: ResumeDAO;

    constructor() {
        this.companyDAO = getCompanyDAO();
        this.positionDAO = getPositionDAO();
        this.resumeDAO = getResumeDAO();
    }

    /** 企业 */
    // 根据id返回企业的信息
    async getCompaniesByCompanyID(companyID: string, resumeID?: string): Promise<Company> {
        try {
            const company: Company = await this.companyDAO.getCompanyByCompanyId(companyID);
            if (!company) {
                throw new Error('企业不存在');
            }
            company.positionList = await this.positionDAO.getPositionListByCompanyId(companyID);
            if (resumeID) {
                const promiseList = [];
                for (let i = 0; i < company.positionList.length; i++) {
                    const position = company.positionList[i];
                    promiseList.push(new Promise(async (resolve, reject) => {
                        try {
                            const _application = await this.resumeDAO.selectApplicationById(companyID,position.positionID, resumeID);
                            resolve()
                            position.applicationKey = _application.applicationKey
                        }catch (e) {
                            reject(e)
                        }
                    }))
                }
                await Promise.all(promiseList)
            }
            return company
        } catch (e) {
            throw new Error(e.message)
        }
    }

    // 根据名称返回企业的信息
    async getCompaniesByCompanyName(companyName: string): Promise<Array<Company>> {
        try {
            const companyList: Array<Company> = await this.companyDAO.getCompanyByCompanyName(companyName);
            return companyList
        } catch (e) {
            throw new Error(e.message)
        }
    }

    // 新增企业
    async createCompany(company: Company): Promise<void> {
        try {
            await this.companyDAO.createCompany(company);
        } catch (e) {
            throw new Error(e.message)
        }
    }

    // 修改企业信息
    async updateCompany(company: Company): Promise<void> {
        try {
            await this.companyDAO.updateCompany(company);
        } catch (e) {
            throw new Error(e.message)
        }
    }

    // 根据<企业名称模糊查询, 企业类型> 查询企业分页列表
    async getCompanyList(pageSize: number, pageNumber: number, companyName?: string, companyType?: string): Promise<PagingSearch<Company>> {
        try {
            const pagingSearch = new PagingSearch<Company>(pageNumber, pageSize);

            const [data, pageCount] = await Promise.all([
                this.companyDAO.selectCompanyList(pagingSearch.pageSize, pagingSearch.pageNumber, companyName, companyType),
                this.companyDAO.selectCompanyCount(pagingSearch.pageSize, pagingSearch.pageNumber, companyName, companyType)
            ])
            pagingSearch.data = data as Array<Company>;
            for (let i = 0; i < pagingSearch.data.length; i++) {
                pagingSearch.data[i].positionList = await this.positionDAO.getPositionListByCompanyId(pagingSearch.data[i].companyID);
            }
            pagingSearch.pageCount = pageCount as number;
            return pagingSearch
        } catch (e) {
            throw new Error(e.message)
        }
    }


    /** 岗位 */
    // 新增岗位
    async createPosition(position: Position): Promise<void> {
        try {
            // 获取企业信息
            const _company: Company = await this.companyDAO.getCompanyByCompanyId(position.companyID);
            if (!_company) {
                throw new Error('关联企业不存在')
            }

            await this.positionDAO.createPosition(position);
        } catch (e) {
            throw new Error(e.message)
        }
    }

    // 修改岗位
    async updatePosition(position: Position): Promise<void> {
        try {
            await this.positionDAO.updatePosition(position);
        } catch (e) {
            throw new Error(e.message)
        }
    }

    // 根据id删除岗位
    async removePosition(positionID: string) {
        try {
            await this.positionDAO.deletePosition(positionID);
        } catch (e) {
            throw new Error(e.message)
        }
    }

    //根据查询条件<企业ID> 返回岗位的分页列表
    async getPositionList(pageSize: number, pageNumber: number, companyID: string): Promise<PagingSearch<Position>> {
        const pagingSearch = new PagingSearch<Position>(pageNumber, pageSize);
        const [data, pageCount] = await Promise.all([
            this.positionDAO.selectPositionList(pagingSearch.pageSize, pagingSearch.pageNumber, companyID),
            this.positionDAO.selectPositionCount(pagingSearch.pageSize, pagingSearch.pageNumber, companyID)
        ])
        pagingSearch.pageCount = pageCount as number;
        pagingSearch.data = data || [];
        return pagingSearch;
    }

    async getPositionByPositionID(positionID: string): Promise<undefined | Position> {
        return this.positionDAO.getPositionByPositionID(positionID)
    }

    /** 简历 */
    // 创建简历个人信息
    async createResume(resume: Resume): Promise<void> {
        try {
            await this.resumeDAO.createResume(resume);
        } catch (e) {
            throw new Error(e.message)
        }
    }

    // 修改简历个人信息
    async updateResume(resume: Resume): Promise<void> {
        try {
            const resumeID = resume.resumeID;
            const _resume: Resume = await this.resumeDAO.getResumeByResumeId(resumeID);
            if (!_resume) {
                throw new Error('通过resumeID没有查询到简历详情')
            }
            await this.resumeDAO.updateResume(resume);
        } catch (e) {
            throw new Error(e.message)
        }
    }

    // 根据id返回简历信息
    async getResumeByResumeID(resumeID: string): Promise<Resume> {
        try {
            const resume: Resume = await this.resumeDAO.getResumeByResumeId(resumeID);
            if (!resume) {
                throw new Error('通过resumeID没有查询到简历详情')
            }
            resume.workExperienceList = await this.getWorkExperienceList(resumeID);
            resume.educationHistoryList = await this.getEducationHistoryList(resumeID);
            return resume
        } catch (e) {
            throw new Error(e.message)
        }
    }


    /** 教育经历 */
    // 根据简历ID返回教育经历数组
    async getEducationHistoryList(resumeID: string): Promise<Array<EducationHistory>> {
        try {
            const educationHistoryList: Array<EducationHistory> = await this.resumeDAO.selectEducationHistoryByResumeID(resumeID);
            return educationHistoryList
        } catch (e) {
            throw new Error(e.message)
        }
    }

    // 添加教育经历
    async addEducationHistory(educationHistory: EducationHistory): Promise<void> {
        try {
            const resumeID = educationHistory.resumeID;
            const _resume: Resume = await this.resumeDAO.getResumeByResumeId(resumeID);
            if (!_resume) {
                throw new Error('通过resumeID没有查询到简历详情')
            }
            await this.resumeDAO.addEducationHistory(educationHistory);
        } catch (e) {
            throw new Error(e.message)
        }
    }

    // 删除教育经历
    async removeEducationHistory(educationID: string): Promise<void> {
        try {
            await this.resumeDAO.removeEducationHistory(educationID);
        } catch (e) {
            throw new Error(e.message)
        }
    }

    // 修改教育经历
    async updateEducationHistory(educationHistory: EducationHistory): Promise<void> {
        try {
            const {resumeID, educationID} = educationHistory;
            const _resume: Resume = await this.resumeDAO.getResumeByResumeId(resumeID);
            if (!_resume) {
                throw new Error('通过resumeID没有查询到简历详情')
            }
            const _education = await this.resumeDAO.getEducationHistoryByEducationID(educationID)
            if (!_education) {
                throw new Error('通过educationID没有查询到教育经历')
            }
            await this.resumeDAO.updateEducationHistory(educationHistory);
        } catch (e) {
            throw new Error(e.message)
        }
    }

    // 根据id返回教育详情
    async getEducationHistoryById(educationID: string): Promise<EducationHistory> {
        try {
            const educationHistory: EducationHistory = await this.resumeDAO.getEducationHistoryByEducationID(educationID);
            if (!educationHistory) {
                throw new Error('通过educationID 没有查询到教育经历')
            }
            return educationHistory
        } catch (e) {
            throw new Error(e.message)
        }
    }

    /** 工作经历 */
    // 根据简历ID返回工作经历数组
    async getWorkExperienceList(resumeID: string): Promise<Array<WorkExperience>> {
        try {
            const workExperienceList: Array<WorkExperience> = await this.resumeDAO.selectWorkExperienceByResumeID(resumeID);
            return workExperienceList
        } catch (e) {
            throw new Error(e.message)
        }
    }


    // 添加工作经历
    async addWorkExperience(workExperience: WorkExperience): Promise<void> {
        try {
            const resumeID = workExperience.resumeID;
            const _resume: Resume = await this.resumeDAO.getResumeByResumeId(resumeID);
            if (!_resume) {
                throw new Error('通过resumeID没有查询到简历详情')
            }
            await this.resumeDAO.addWorkExperience(workExperience);
        } catch (e) {
            throw new Error(e.message)
        }
    }

    // 删除工作经历
    async removeWorkExperience(experienceID: string): Promise<void> {
        try {
            await this.resumeDAO.removeWorkExperience(experienceID);
        } catch (e) {
            throw new Error(e.message)
        }
    }

    // 根据id返回教育详情
    async getWorkExperienceByExperienceID(experienceID: string): Promise<WorkExperience> {
        try {
            const workExperience: WorkExperience = await this.resumeDAO.getWorkExperienceByExperienceID(experienceID);
            if (!workExperience) {
                throw new Error('通过experienceID没有查询到工作经历')
            }
            return workExperience
        } catch (e) {
            throw new Error(e.message)
        }
    }


    // 修改工作经历
    async updateWorkExperience(workExperience: WorkExperience): Promise<void> {
        try {
            const {resumeID, experienceID} = workExperience;
            const _resume: Resume = await this.resumeDAO.getResumeByResumeId(resumeID);
            if (!_resume) {
                throw new Error('通过resumeID没有查询到简历详情')
            }
            const _experience = await this.resumeDAO.getWorkExperienceByExperienceID(experienceID);
            if (!_experience) {
                throw new Error('通过educationID没有查询到工作经历')
            }
            await this.resumeDAO.updateWorkExperience(workExperience);
        } catch (e) {
            throw new Error(e.message)
        }
    }

    // 投递简历
    async addApplication(application: Application): Promise<void> {
        try {
            const {companyID, positionID, resumeID} = application;
            // 检查企业
            const _company: Company = await this.companyDAO.getCompanyByCompanyId(companyID);
            if (!_company) {
                throw new Error('通过companyID没有查询到公司详情')
            }
            // 检查岗位
            const _position = await this.positionDAO.getPositionByPositionID(positionID)
            if (!_position) {
                throw new Error('通过positionID没有查询到岗位信息')
            }
            if (_position.positionType !== '1') {
                throw new Error('岗位已经关闭')
            }
            // 检查简历
            const resume: Resume = await this.resumeDAO.getResumeByResumeId(resumeID)
            const educationHistory: Array<EducationHistory> = await this.resumeDAO.selectEducationHistoryByResumeID(resumeID);
            const workExperience: Array<WorkExperience> = await this.resumeDAO.selectWorkExperienceByResumeID(resumeID);
            if (!resume) {
                throw new Error('通过resumeID没有查询到简历详情')
            }
            const verify = Verify.verifyObject(resume, {
                name: '姓名',
                avatar: '头像URL',
                gender: '性别',
                birthday: '生日',
                email: '邮箱',
                iDNumber: '身份证号',
                phoneNumber: '手机号',
                weChat: '微信号',
                ethnicity: '民族',
                politicalStatus: '政治面貌',
                earliestStartDate: '最早可入职时间',
                socialProfile: '个人社交主页',
                jobSeekerStatus: '求职身份',
                personalStatement: '个人说明',
            })
            if (verify || educationHistory.length === 0 || workExperience.length === 0) {
                throw new Error('请完善您的建立')
            }
            const pagingSearch = new PagingSearch<Application>(1, 1);
            // 根据岗位统计
            const num: Number = await this.resumeDAO.selectResumeCount(pagingSearch, application);
            application.applicationKey = `${_position.positionName}-${num}-${resume.phoneNumber}`

            const _applicationNum = await this.resumeDAO.getApplicationByApplicationKey(companyID, positionID, resumeID);
            if ((_applicationNum as number) !== 0) {
                throw new Error('您已经投递过了')
            }
            await this.resumeDAO.addApplication(application);
        } catch (e) {
            throw new Error(e.message)
        }
    }


    async selectEnumMap(tableList: Array<string>): Promise<Object> {
        const enumMap = {};
        try {
            for (let i = 0; i < tableList.length; i++) {
                const tableName = tableList[i];
                if (tableName === 'RegionEnum') {
                    const provinceList: Array<any> = await this.companyDAO.selectRegionEnum('0');
                    for (let j = 0; j < provinceList.length; j++) {
                        provinceList[j].childern = await this.companyDAO.selectRegionEnum(provinceList[j].id);
                    }
                    enumMap[tableName] = provinceList;
                } else {
                    enumMap[tableName] = await this.companyDAO.getAllCompany(tableName)
                }
            }
            return enumMap;
        } catch (e) {
            throw new Error(e.message)
        }


    }

    // 返回指定公司的所有投递
    async getResumeList(
        pagingSearch: PagingSearch<Application>,
        application: Application,
        positionType: string,
    ): Promise<PagingSearch<Application>> {
        try {
            const [data, pageCount] = await Promise.all([
                this.resumeDAO.selectResumeList(pagingSearch, application, positionType),
                this.resumeDAO.selectResumeCount(pagingSearch, application, positionType),
            ])
            let company: Company;
            let position: Position;
            if (application.companyID) {
                company = await this.companyDAO.getCompanyByCompanyId(application.companyID);
            }

            if (application.positionID) {
                position = await this.positionDAO.getPositionByPositionID(application.positionID);
            }


            //
            //                 await this.positionDAO.getPositionByPositionID(positionID)

            const promiseList: Array<Promise<any>> = data.map((item, index) => {
                return new Promise(async (resolve, reject) => {
                    try {
                        let _company: Company;
                        let _position: Position;
                        const resume: Resume = await this.resumeDAO.getResumeByResumeId(item.resumeID);
                        if (!application.companyID) {
                            _company = await this.companyDAO.getCompanyByCompanyId(item.companyID);
                        }
                        if (!application.positionID) {
                            _position = await this.positionDAO.getPositionByPositionID(item.positionID);
                        }
                        resolve({
                            resume,
                            company: company || _company,
                            position: position || _position,
                        })
                    } catch (e) {
                        reject(e)
                    }
                })
            })

            const _data = await Promise.all(promiseList)
            // const applicationList: Array<any> = data;
            // for (let i = 0; i < applicationList.length; i++) {
            //     if (!application.companyID) {
            //         company = await this.companyDAO.getCompanyByCompanyId(application.companyID);
            //     }
            //     if (!application.positionID) {
            //         position = await this.positionDAO.getPositionByPositionID(application.positionID);
            //     }
            //     applicationList[i].company = company
            //     applicationList[i].position = position
            //
            // }
            pagingSearch.data = data.map((item, index) => {
                return {
                    ...item,
                    ..._data[index]
                }
            });
            pagingSearch.pageCount = pageCount as number;
            return pagingSearch
        } catch (e) {
            throw new Error(e.message)
        }
    }
}

const jobApplicationServer = new JobApplicationServer();

export function getJobApplicationServer(): JobApplicationServer {
    return jobApplicationServer
}

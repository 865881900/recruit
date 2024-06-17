import {getJobApplicationServer, JobApplicationServer} from "../../server/JobApplicationServer";
import {Company} from "../../models/JobApplication/Company";
import SendData from "../../models/sendData";
import {Position} from "../../models/JobApplication/Position";
import Verify from "../../utils/verify";
import {PagingSearch} from "../../models/PagingSearch";
import {OperateData} from "../../utils/OperateData";
import {Resume} from "../../models/JobApplication/Resumes";
import {EducationHistory} from "../../models/JobApplication/EducationHistory";
import {WorkExperience} from "../../models/JobApplication/WorkExperience";
import {Application} from "../../models/JobApplication/Application";

export class JobApplicationController {
    private jobApplicationServer: JobApplicationServer

    constructor() {
        this.jobApplicationServer = getJobApplicationServer()
    }

    /** 企业 */
    // 根据id返回企业的详情
    async getCompaniesByCompanyID(req, res) {
        const sendData = new SendData()
        try {
            const companyID = req.query.companyID;
            const resumeID = req.query.resumeID;
            if (!companyID) {
                res.send(sendData.getNoSendData('企业companyID不能为空'))
                return
            }
            const company: Company = await this.jobApplicationServer.getCompaniesByCompanyID(companyID, resumeID);
            res.send(sendData.getOkSendData(company));
        } catch (e) {
            res.send(sendData.getNoSendData(e.message))
        }
    }

    // 新建企业
    async addCompany(req, res) {
        const sendData = new SendData()
        try {
            const {
                companyName,
                companyLogo,
                companyAddress,
                companySize,
                companyIntroduction,
                companyType,
            } = req.body;
            const company: Company = new Company(
                companyName,
                companyLogo,
                companyAddress,
                companySize,
                companyIntroduction,
                companyType,
            );
            const verify = Verify.verifyObject(company, {
                companyName: '企业名称',
                companyLogo: '企业logo图片URL',
                companyAddress: '企业地址',
                companySize: '企业规模',
                companyIntroduction: '企业介绍',
                companyType: '企业类型',
            })
            if (verify) {
                res.send(sendData.getNoSendData(`${verify}不能为空`));
                return
            }
            company.companyID = OperateData.createId('companyID')

            const companyList: Array<Company> = await this.jobApplicationServer.getCompaniesByCompanyName(companyName)
            if (companyList.length > 0) {
                res.send(sendData.getNoSendData('企业名称重复'));
                return
            }
            await this.jobApplicationServer.createCompany(company)
            res.send(sendData.getOkSendData(null, '创建成功'));
        } catch (e) {
            res.send(sendData.getNoSendData(e.message))
        }
    }

    // 修改企业信息
    async updateCompany(req, res) {
        const sendData = new SendData()
        try {
            const {
                companyName,
                companyLogo,
                companyAddress,
                companySize,
                companyIntroduction,
                companyType,
                companyID,
            } = req.body;
            const company: Company = new Company(
                companyName,
                companyLogo,
                companyAddress,
                companySize,
                companyIntroduction,
                companyType,
            );
            company.companyID = companyID;
            const verify = Verify.verifyObject(company, {
                companyID: '企业ID',
                companyName: '企业名称',
                companyLogo: '企业logo图片URL',
                companyAddress: '企业地址',
                companySize: '企业规模',
                companyIntroduction: '企业介绍',
                companyType: '企业类型',
            })
            if (verify) {
                res.send(sendData.getNoSendData(`${verify}不能为空`));
                return
            }
            const companyList: Array<Company> = await this.jobApplicationServer.getCompaniesByCompanyName(companyName)
            if (companyList.length > 0 && companyList[0].companyID !== companyID) {
                res.send(sendData.getNoSendData('企业名称重复'));
                return
            }

            await this.jobApplicationServer.updateCompany(company)
            res.send(sendData.getOkSendData(null, '修改企业成功'));
        } catch (e) {
            res.send(sendData.getNoSendData(e.message))
        }
    }

    // 根据条件筛选企业
    async getCompanyList(req, res) {
        const sendData = new SendData()
        try {
            const {
                companyName, // 企业名称查询
                companyType, // 企业类型查询
                pageSize, // 分页大小
                pageNumber // 第几页
            } = req.body;

            if ([companyType, companyType].includes(undefined)) {
                res.send(sendData.getNoSendData('企业名称或者企业类型为必传项'))
                return;
            }

            const data: PagingSearch<Company> = await this.jobApplicationServer.getCompanyList(pageSize, pageNumber, companyName, companyType)
            res.send(sendData.getOkSendData(data));
        } catch (e) {
            res.send(sendData.getNoSendData(e.message))
        }
    }

    /** 岗位 */
    // 创建岗位
    async addPosition(req, res) {
        const sendData = new SendData()
        try {
            const {
                positionName,
                positionDescription,
                recruitmentNumber,
                salaryRange,
                highlight,
                responsibilities,
                requirements,
                educationRequirement,
                companyID,
                positionType,
            } = req.body;
            if (!companyID) {
                res.send(sendData.getNoSendData('企业id不能为空'))
                return
            }
            const position: Position = new Position(
                positionName,
                positionDescription,
                recruitmentNumber,
                salaryRange,
                highlight,
                responsibilities,
                requirements,
                educationRequirement,
                companyID,
                positionType,
            );
            const verify = Verify.verifyObject(position, {
                "positionName": "岗位名称",
                "positionDescription": "岗位说明",
                "recruitmentNumber": "岗位招聘人数",
                "salaryRange": "岗位薪资范围",
                "highlight": "岗位亮点",
                "responsibilities": "岗位职责",
                "requirements": "岗位要求",
                "educationRequirement": "学历要求",
                "positionType": "岗位状态",
            })

            position.positionID = OperateData.createId('positionID')
            if (verify) {
                res.send(sendData.getNoSendData(`${verify}不能为空`));
                return
            }
            await this.jobApplicationServer.createPosition(position)
            res.send(sendData.getOkSendData(null, '创建岗位成功'));
        } catch (e) {
            res.send(sendData.getNoSendData(e.message))
        }
    }

    // 修改岗位
    async updatePosition(req, res) {
        const sendData = new SendData()
        try {
            const {
                positionName,
                positionDescription,
                recruitmentNumber,
                salaryRange,
                highlight,
                responsibilities,
                requirements,
                educationRequirement,
                companyID,
                positionID,
                positionType
            } = req.body;
            const position: Position = new Position(
                positionName,
                positionDescription,
                recruitmentNumber,
                salaryRange,
                highlight,
                responsibilities,
                requirements,
                educationRequirement,
                companyID,
                positionType
            );
            position.positionID = positionID;
            const verify = Verify.verifyObject(position, {
                "positionName": "岗位名称",
                "positionDescription": "岗位说明",
                "recruitmentNumber": "岗位招聘人数",
                "salaryRange": "岗位薪资范围",
                "highlight": "岗位亮点",
                "responsibilities": "岗位职责",
                "requirements": "岗位要求",
                "educationRequirement": "学历要求",
                "positionID": "岗位id",
                "positionType": "岗位状态",
            })
            if (verify) {
                res.send(sendData.getNoSendData(`${verify}不能为空`));
                return
            }
            await this.jobApplicationServer.updatePosition(position)
            res.send(sendData.getOkSendData(null, '修改岗位成功'));
        } catch (e) {
            res.send(sendData.getNoSendData(e.message))
        }
    }

    // 删除岗位
    async removePosition(req, res) {
        const sendData = new SendData()
        try {
            const positionID = req.query.positionID;
            if (!positionID) {
                res.send(sendData.getNoSendData('岗位positionID不能为空'))
                return
            }
            await this.jobApplicationServer.removePosition(positionID)
            res.send(sendData.getOkSendData('删除成功'));
        } catch (e) {
            res.send(sendData.getNoSendData(e.message))
        }
    }

    // 分页查询岗位
    async getPositionList(req, res) {
        const sendData = new SendData()
        try {
            const {
                companyID, // 企业名称查询
                pageSize, // 分页大小
                pageNumber // 第几页
            } = req.body;
            const data: PagingSearch<Position> = await this.jobApplicationServer.getPositionList(pageSize, pageNumber, companyID)
            res.send(sendData.getOkSendData(data));
        } catch (e) {
            res.send(sendData.getNoSendData(e.message))
        }
    }

    async getPositionByPositionID(req, res) {
        const sendData = new SendData()
        try {
            const {positionID} = req.query;
            const data: Position = await this.jobApplicationServer.getPositionByPositionID(positionID);
            if (!data) {
                res.send(sendData.getNoSendData('查询失败'));
                return
            }
            res.send(sendData.getOkSendData(data));
        } catch (e) {
            res.send(sendData.getNoSendData(e.message))
        }
    }

    /** 简历 */
    // 根据id查询简历信息
    async getResumeByResumeID(req, res) {
        const sendData = new SendData()
        try {
            const resumeID = req.query.resumeID;
            if (!resumeID) {
                res.send(sendData.getNoSendData('简历id不能为空'))
                return
            }
            const resume: Resume = await this.jobApplicationServer.getResumeByResumeID(resumeID);
            res.send(sendData.getOkSendData(resume));
        } catch (e) {
            res.send(sendData.getNoSendData(e.message))
        }
    }

    // 创建简历个人信息
    async createResume(req, res) {
        const sendData = new SendData()
        try {
            const {
                name,
                avatar,
                gender,
                birthday,
                email,
                iDNumber,
                phoneNumber,
                weChat,
                ethnicity,
                politicalStatus,
                earliestStartDate,
                socialProfile,
                jobSeekerStatus,
                personalStatement,
            } = req.body;
            const resume: Resume = new Resume(
                name,
                avatar,
                gender,
                birthday,
                email,
                iDNumber,
                phoneNumber,
                weChat,
                ethnicity,
                politicalStatus,
                earliestStartDate,
                socialProfile,
                jobSeekerStatus,
                personalStatement,
            )

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
            if (verify) {
                res.send(sendData.getNoSendData(`${verify}不能为空`));
                return
            }
            resume.resumeID = OperateData.createId('resumeID')

            await this.jobApplicationServer.createResume(resume)
            res.send(sendData.getOkSendData({
                resumeID: resume.resumeID
            }, '创建成功'));
        } catch (e) {
            res.send(sendData.getNoSendData(e.message))
        }
    }

    // 修改简历个人信息
    async updateResume(req, res) {
        const sendData = new SendData()
        try {
            const {
                name,
                avatar,
                gender,
                birthday,
                email,
                iDNumber,
                phoneNumber,
                weChat,
                ethnicity,
                politicalStatus,
                earliestStartDate,
                socialProfile,
                jobSeekerStatus,
                personalStatement,
                resumeID,
            } = req.body;
            const resume: Resume = new Resume(
                name,
                avatar,
                gender,
                birthday,
                email,
                iDNumber,
                phoneNumber,
                weChat,
                ethnicity,
                politicalStatus,
                earliestStartDate,
                socialProfile,
                jobSeekerStatus,
                personalStatement,
            )
            resume.resumeID = resumeID;
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
                resumeID: '简历id',
            })
            if (verify) {
                res.send(sendData.getNoSendData(`${verify}不能为空`));
                return
            }
            await this.jobApplicationServer.updateResume(resume)
            res.send(sendData.getOkSendData(null, '修改成功'));
        } catch (e) {
            res.send(sendData.getNoSendData(e.message))
        }
    }

    // 添加教育经历
    async addEducationHistory(req, res) {
        const sendData = new SendData()
        try {
            const {
                schoolName,
                major,
                degree,
                startDate,
                resumeID,
                city,
                endDate,
                educationDescription,
            } = req.body;
            const educationHistory: EducationHistory = new EducationHistory(
                schoolName,
                major,
                degree,
                startDate,
                resumeID,
                city,
                endDate,
                educationDescription,
            )
            const verify = Verify.verifyObject(educationHistory, {
                schoolName: '学校名称',
                major: '专业',
                degree: '学历',
                startDate: '开始时间',
                resumeID: '简历id',
                city: '城市',
                endDate: '结束时间',
                educationDescription: '教育描述',
            })
            if (verify) {
                res.send(sendData.getNoSendData(`${verify}不能为空`));
                return
            }
            educationHistory.educationID = OperateData.createId('educationID');
            await this.jobApplicationServer.addEducationHistory(educationHistory)
            res.send(sendData.getOkSendData(null, '添加成功'));
        } catch (e) {
            res.send(sendData.getNoSendData(e.message))
        }
    }

    // 删除教育经历
    async removeEducationHistory(req, res) {
        const sendData = new SendData()
        try {
            const educationID = req.query.educationID;
            if (!educationID) {
                res.send(sendData.getNoSendData('教育educationID不能为空'))
                return
            }
            await this.jobApplicationServer.removeEducationHistory(educationID)
            res.send(sendData.getOkSendData(null, '删除成功'));
        } catch (e) {
            res.send(sendData.getNoSendData(e.message))
        }
    }

    // 修改教育经历
    async updateEducationHistory(req, res) {
        const sendData = new SendData()
        try {
            const {
                schoolName,
                major,
                degree,
                startDate,
                resumeID,
                city,
                endDate,
                educationDescription,
                educationID
            } = req.body;
            const educationHistory: EducationHistory = new EducationHistory(
                schoolName,
                major,
                degree,
                startDate,
                resumeID,
                city,
                endDate,
                educationDescription,
            )
            educationHistory.educationID = educationID;
            const verify = Verify.verifyObject(educationHistory, {
                educationID: '教育id',
                resumeID: '简历id',
                schoolName: '学校名称',
                major: '专业',
                degree: '学历',
                city: '城市',
                startDate: '开始时间',
                endDate: '结束时间',
                educationDescription: '教育描述',
            })
            if (verify) {
                res.send(sendData.getNoSendData(`${verify}不能为空`));
                return
            }
            await this.jobApplicationServer.updateEducationHistory(educationHistory)
            res.send(sendData.getOkSendData(null, '修改成功'));
        } catch (e) {
            res.send(sendData.getNoSendData(e.message))
        }
    }

    // 根据id返回简历信息
    async getEducationHistoryById(req, res) {
        const sendData = new SendData()
        try {
            const { educationID } = req.query;
            if(!educationID) {
                res.send(sendData.getNoSendData(`educationID不能为空`));
            }
            const educationHistory: EducationHistory  = await this.jobApplicationServer.getEducationHistoryById(educationID)
            res.send(sendData.getOkSendData(educationHistory));
        } catch (e) {
            res.send(sendData.getNoSendData(e.message))
        }
    }

    // 添加工作经历
    async addWorkExperience(req, res) {
        const sendData = new SendData()
        try {
            const {
                jobType,
                companyName,
                positionTitle,
                startDate,
                resumeID,
                city,
                endDate,
                jobDescription,
            } = req.body;
            const workExperience: WorkExperience = new WorkExperience(
                jobType,
                companyName,
                positionTitle,
                startDate,
                resumeID,
                city,
                endDate,
                jobDescription,
            )

            const verify = Verify.verifyObject(workExperience, {
                jobType: '工作类型',
                companyName: '企业名称',
                positionTitle: '岗位',
                startDate: '工作开始时间',
                resumeID: '简历id',
                city: '城市',
                endDate: '工作结束时间',
                jobDescription: '工作内容',
            })
            if (verify) {
                res.send(sendData.getNoSendData(`${verify}不能为空`));
                return
            }
            workExperience.experienceID = OperateData.createId('experienceID');
            await this.jobApplicationServer.addWorkExperience(workExperience)
            res.send(sendData.getOkSendData(null, '添加成功'));
        } catch (e) {
            res.send(sendData.getNoSendData(e.message))
        }
    }

    // 删除工作经历
    async removeWorkExperience(req, res) {
        const sendData = new SendData()
        try {
            const experienceID = req.query.experienceID;
            if (!experienceID) {
                res.send(sendData.getNoSendData('工作经历experienceID不能为空'))
                return
            }
            await this.jobApplicationServer.removeWorkExperience(experienceID)
            res.send(sendData.getOkSendData(null, '删除成功'));
        } catch (e) {
            res.send(sendData.getNoSendData(e.message))
        }
    }

    // 修改工作经历
    async updateWorkExperience(req, res) {
        const sendData = new SendData()
        try {
            const {
                jobType,
                companyName,
                positionTitle,
                startDate,
                resumeID,
                city,
                endDate,
                jobDescription,
                experienceID,
            } = req.body;
            const workExperience: WorkExperience = new WorkExperience(
                jobType,
                companyName,
                positionTitle,
                startDate,
                resumeID,
                city,
                endDate,
                jobDescription,
            )
            workExperience.experienceID = experienceID;
            const verify = Verify.verifyObject(workExperience, {
                jobType: '工作类型',
                companyName: '企业名称',
                positionTitle: '岗位',
                city: '城市',
                startDate: '工作开始时间',
                endDate: '工作结束时间',
                jobDescription: '工作内容',
                resumeID: '简历id',
                experienceID: '工作id',
            })
            if (verify) {
                res.send(sendData.getNoSendData(`${verify}不能为空`));
                return
            }
            await this.jobApplicationServer.updateWorkExperience(workExperience)
            res.send(sendData.getOkSendData(null, '修改成功'));
        } catch (e) {
            res.send(sendData.getNoSendData(e.message))
        }
    }

    async getWorkExperienceByExperienceID(req, res) {
        const sendData = new SendData()
        try {
            const { experienceID } = req.query;
            if(!experienceID) {
                res.send(sendData.getNoSendData(`experienceID不能为空`));
            }
            const workExperience: WorkExperience  = await this.jobApplicationServer.getWorkExperienceByExperienceID(experienceID)
            res.send(sendData.getOkSendData(workExperience));
        } catch (e) {
            res.send(sendData.getNoSendData(e.message))
        }
    }


    /** 投递简历 */
    // 投递简历
    async addApplication(req, res) {
        const sendData = new SendData()
        try {
            const {
                companyID,
                positionID,
                resumeID
            } = req.body;
            const application: Application = new Application(
                companyID,
                positionID,
                resumeID
            )
            const verify = Verify.verifyObject(application, {
                companyID: '企业ID',
                positionID: '岗位ID',
                resumeID: '简历ID',
            })
            if (verify) {
                res.send(sendData.getNoSendData(`${verify}不能为空`));
                return
            }
            application.applicationID = OperateData.createId('applicationID');

            await this.jobApplicationServer.addApplication(application)
            res.send(sendData.getOkSendData({
                applicationID: application.applicationID
            }, '投递成功'));
        } catch (e) {
            if(e.message === '请完善您的建立') {
                res.send(sendData.getNoSendData(e.message, 301))
            } else {
                res.send(sendData.getNoSendData(e.message))
            }

        }
    }

    // 根据条件筛选投递记录
    async getResumeList(req, res) {
        const sendData = new SendData()
        try {
            const {
                pageSize, // 分页大小
                pageNumber, // 第几页
                companyID, // 企业ID
                positionID, // 岗位id
                startData, //  时间筛选开始
                endData, // 时间筛选结束
                positionType, // 时间筛选结束
                applicationKey, //
            } = req.body;
            const pagingSearch = new PagingSearch<Application>(Number(pageNumber), Number(pageSize), startData, endData);
            const application = new Application(
                companyID,
                positionID,
                '',
                applicationKey,
            );

            const data: PagingSearch<Application> = await this.jobApplicationServer.getResumeList(pagingSearch, application, positionType)
            res.send(sendData.getOkSendData(data));
        } catch (e) {
            res.send(sendData.getNoSendData(e.message))
        }
    }
    // 根据投递ID返回简历详情
    async getApplication(req, res) {
        const sendData = new SendData()
        try {
            const applicationID = req.query.applicationID;
            if (!applicationID) {
                res.send(sendData.getNoSendData('投递applicationID不能为空'))
                return
            }
            const application: Application = await this.jobApplicationServer.getApplication(applicationID);

            const resume: Resume = await this.jobApplicationServer.getResumeByResumeID(application.resumeID);
            resume.key = application.applicationKey;
            res.send(sendData.getOkSendData(resume));
        } catch (e) {
            res.send(sendData.getNoSendData(e.message))
        }
    }

    // 返回所有的枚举
    async getEnumMap(req, res) {
        const sendData = new SendData();
        try {
            const tableList: Array<string> = req.body.tableList.split(',');
            const enumMap: Object = await this.jobApplicationServer.selectEnumMap(tableList);
            res.send(sendData.getOkSendData(enumMap, '获取枚举成功'))
        } catch (e) {
            res.send(sendData.getNoSendData(e.message))
        }
    }
}

const jobApplicationController = new JobApplicationController();

export function getJobApplicationController() {
    return jobApplicationController
}

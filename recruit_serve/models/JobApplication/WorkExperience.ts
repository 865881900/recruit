import { IsString, IsDate } from 'class-validator';

/**
 * 工作经验实体类
 */
export class WorkExperience {
    /**
     * 经验ID，自增主键
     */
    experienceID: string;

    /**
     * 工作类型，必填
     */
    @IsString()
    jobType: string;

    /**
     * 企业名称，必填
     */
    @IsString()
    companyName: string;

    /**
     * 岗位，必填
     */
    @IsString()
    positionTitle: string;

    /**
     * 城市
     */
    city?: string;

    /**
     * 工作开始时间，必填
     */
    @IsDate()
    startDate: Date;

    /**
     * 工作结束时间
     */
    endDate?: Date;

    /**
     * 工作内容
     */
    jobDescription?: string;

    /**
     * 关联的简历ID，外键
     */
    resumeID: string;

    private createDate: string;

    private updateDate: string;
    /**
     * 构造函数，初始化工作经验实体
     */
    constructor(
        jobType: string,
        companyName: string,
        positionTitle: string,
        startDate: Date,
        resumeID: string,
        city: string,
        endDate: Date,
        jobDescription: string
    ) {
        this.jobType = jobType;
        this.companyName = companyName;
        this.positionTitle = positionTitle;
        this.startDate = startDate;
        this.city = city;
        this.endDate = endDate;
        this.jobDescription = jobDescription;
        this.resumeID = resumeID;
    }
}
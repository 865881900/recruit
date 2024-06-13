import {IsString, IsDate} from 'class-validator';

/**
 * 教育经历实体类
 */
export class EducationHistory {
    /**
     * 教育经历ID，自增主键
     */
    educationID: string;

    /**
     * 学校名称，必填
     */
    @IsString()
    schoolName: string;

    /**
     * 专业名称，必填
     */
    @IsString()
    major: string;

    /**
     * 学历，必填，取值为本科、硕士、博士
     */
    @IsString()
    degree: string;

    /**
     * 城市
     */
    city?: string;

    /**
     * 在校开始时间，必填
     */
    @IsDate()
    startDate: Date;

    /**
     * 在校结束时间
     */
    endDate?: Date;

    /**
     * 教育描述
     */
    educationDescription?: string;

    /**
     * 关联的简历ID，外键
     */
    resumeID: string;

    private createDate: string;

    private updateDate: string;

    /**
     * 构造函数，初始化教育经历实体
     */
    constructor(
        schoolName: string,
        major: string,
        degree: string,
        startDate: Date,
        resumeID: string,
        city: string,
        endDate: Date,
        educationDescription: string
    ) {
        this.schoolName = schoolName;
        this.major = major;
        this.degree = degree;
        this.startDate = startDate;
        this.city = city;
        this.endDate = endDate;
        this.educationDescription = educationDescription;
        this.resumeID = resumeID;
    }
}
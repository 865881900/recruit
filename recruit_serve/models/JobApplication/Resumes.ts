// CREATE TABLE IF NOT EXISTS Resume (
//     resumeID INT AUTO_INCREMENT PRIMARY KEY,
//     name VARCHAR(100) NOT NULL COMMENT '姓名',
//     avatar VARCHAR(255) COMMENT '头像URL',
//     gender VARCHAR(100) COMMENT '性别',
//     birthday DATE COMMENT '生日',
//     email VARCHAR(255) COMMENT '邮箱',
//     iDNumber CHAR(18) COMMENT '身份证号',
//     phoneNumber VARCHAR(15) COMMENT '手机号',
//     weChat VARCHAR(50) COMMENT '微信号',
//     ethnicity VARCHAR(50) COMMENT '民族',
//     politicalStatus VARCHAR(50) COMMENT '政治面貌',
//     earliestStartDate DATE COMMENT '最早可入职时间',
//     socialProfile VARCHAR(255) COMMENT '个人社交主页',
//     jobSeekerStatus VARCHAR(50) COMMENT '求职身份',
//     personalStatement TEXT COMMENT '个人说明'
// );
import {IsNotEmpty, IsString, IsDate, IsEmail, IsPhoneNumber, MaxLength} from 'class-validator';
import {WorkExperience} from "./WorkExperience";
import {EducationHistory} from "./EducationHistory";

/**
 * 简历实体类
 */
export class Resume {
    get birthday(): Date {
        return this._birthday;
    }

    set birthday(value: Date) {
        this._birthday = value;
    }
    key: string
    /**
     * 简历ID，自增主键
     */
    @IsNotEmpty()
    resumeID: string;

    /**
     * 姓名，必填
     */
    @IsNotEmpty()
    @IsString()
    name: string;

    /**
     * 头像URL
     */
    avatar: string;

    /**
     * 性别
     */
    gender: string;

    /**
     * 生日
     */
    @IsDate() private _birthday: Date;

    /**
     * 邮箱，必填
     */
    @IsNotEmpty()
    @IsEmail()
    email: string;

    /**
     * 身份证号，必填，长度固定为18位
     */
    @IsNotEmpty()
    iDNumber: string;

    /**
     * 手机号，必填
     */
    @IsNotEmpty()
    @IsPhoneNumber()
    phoneNumber: string;

    /**
     * 微信号
     */
    weChat: string;

    /**
     * 民族
     */
    ethnicity: string;

    /**
     * 政治面貌
     */
    politicalStatus: string;

    /**
     * 最早可入职时间
     */
    @IsDate()
    earliestStartDate: Date;

    /**
     * 个人社交主页
     */
    socialProfile: string;

    /**
     * 求职身份，必填
     */
    @IsNotEmpty()
    @MaxLength(50)
    jobSeekerStatus: string;

    /**
     * 个人说明，必填
     */
    @IsNotEmpty()
    @IsString()
    personalStatement: string;

    private createDate: string;

    private updateDate: string;

    public workExperienceList: Array<WorkExperience>

    public educationHistoryList: Array<EducationHistory>

    /**
     * 构造函数，初始化简历实体
     * 注意：resumeID通常由数据库自动生成，因此这里不包括在构造函数中
     */
    constructor(
        name: string,
        avatar: string,
        gender: string,
        birthday: Date,
        email: string,
        iDNumber: string,
        phoneNumber: string,
        weChat: string,
        ethnicity: string,
        politicalStatus: string,
        earliestStartDate: Date,
        socialProfile: string,
        jobSeekerStatus: string,
        personalStatement: string,
    ) {
        this.name = name;
        this.email = email;
        this.iDNumber = iDNumber;
        this.phoneNumber = phoneNumber;
        this.jobSeekerStatus = jobSeekerStatus;
        this.personalStatement = personalStatement;
        this.avatar = avatar;
        this.gender = gender;
        this._birthday = birthday;
        this.weChat = weChat;
        this.ethnicity = ethnicity;
        this.politicalStatus = politicalStatus;
        this.earliestStartDate = earliestStartDate;
        this.socialProfile = socialProfile;
    }
}

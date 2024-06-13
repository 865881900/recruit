// CREATE TABLE IF NOT EXISTS Positions (
//     positionID INT AUTO_INCREMENT PRIMARY KEY,
//     positionName VARCHAR(255) NOT NULL COMMENT '岗位名称', 1
//     positionDescription TEXT COMMENT '岗位说明',
//     recruitmentNumber INT COMMENT '岗位招聘人数',
//     salaryRange VARCHAR(100) COMMENT '岗位薪资范围',
//     highlight VARCHAR(255) COMMENT '岗位亮点',
//     responsibilities TEXT COMMENT '岗位职责',
//     requirements TEXT COMMENT '岗位要求',
//     educationRequirement VARCHAR(255) COMMENT '学历要求'
//     companyID INT COMMENT '学历要求'
// );

import {IsNotEmpty, IsString, IsInt} from 'class-validator';
import s from "connect-redis"; // 确保已安装 class-validator 库

/**
 * 岗位实体类
 */
export class Position {
    applicationKey: string;

    get positionID(): string {
        return this._positionID;
    }

    set positionID(value: string) {
        this._positionID = value;
    }

    get positionName(): string {
        return this._positionName;
    }

    set positionName(value: string) {
        this._positionName = value;
    }

    get positionDescription(): string {
        return this._positionDescription;
    }

    set positionDescription(value: string) {
        this._positionDescription = value;
    }

    get recruitmentNumber(): number {
        return this._recruitmentNumber;
    }

    set recruitmentNumber(value: number) {
        this._recruitmentNumber = value;
    }

    get salaryRange(): string {
        return this._salaryRange;
    }

    set salaryRange(value: string) {
        this._salaryRange = value;
    }

    get highlight(): string {
        return this._highlight;
    }

    set highlight(value: string) {
        this._highlight = value;
    }

    get responsibilities(): string {
        return this._responsibilities;
    }

    set responsibilities(value: string) {
        this._responsibilities = value;
    }

    get requirements(): string {
        return this._requirements;
    }

    set requirements(value: string) {
        this._requirements = value;
    }

    get educationRequirement(): string {
        return this._educationRequirement;
    }

    set educationRequirement(value: string) {
        this._educationRequirement = value;
    }

    get companyID(): string {
        return this._companyID;
    }

    set companyID(value: string) {
        this._companyID = value;
    }

    /**
     * 岗位ID，自增主键
     */
    @IsNotEmpty() private _positionID: string;

    /**
     /**
     * 岗位名称，必填
     */
    @IsNotEmpty()
    @IsString() private _positionName: string;

    /**
     * 岗位说明
     */
    @IsNotEmpty()
    @IsString() private _positionDescription: string;

    /**
     * 岗位招聘人数
     */
    @IsNotEmpty()
    @IsInt() private _recruitmentNumber: number;

    /**
     * 岗位薪资范围
     */
    @IsNotEmpty()
    @IsString() private _salaryRange: string;

    /**
     * 岗位亮点
     */
    @IsNotEmpty()
    @IsString() private _highlight: string;

    /**
     * 岗位职责
     */
    @IsNotEmpty()
    @IsString() private _responsibilities: string;

    /**
     * 岗位要求
     */
    @IsNotEmpty()
    @IsString() private _requirements: string;

    /**
     * 学历要求
     */
    @IsNotEmpty()
    @IsString() private _educationRequirement: string;

    /**
     * 企业id
     */
    @IsNotEmpty()
    @IsString() private _companyID: string;

    private createDate: string;

    private updateDate: string;

    // 岗位状态: 0: 关闭; 1: 招聘;  2: 删除
    private _positionType: string;
    get positionType(): string {
        return this._positionType;
    }

    set positionType(value: string) {
        this._positionType = value;
    }

    /**
     * 构造函数，初始化岗位实体
     * @param positionName 岗位名称
     * @param positionDescription 岗位说明
     * @param recruitmentNumber 岗位招聘人数
     * @param salaryRange 岗位薪资范围
     * @param highlight 岗位亮点
     * @param responsibilities 岗位职责
     * @param requirements 岗位要求
     * @param educationRequirement 学历要求
     * @param companyID 企业id
     * @param companyID 岗位状态
     */
    constructor(
        positionName: string,
        positionDescription: string,
        recruitmentNumber: number,
        salaryRange: string,
        highlight: string,
        responsibilities: string,
        requirements: string,
        educationRequirement: string,
        companyID: string,
        positionType?: string
    ) {
        this._positionName = positionName;
        this._positionDescription = positionDescription;
        this._recruitmentNumber = recruitmentNumber;
        this._salaryRange = salaryRange;
        this._highlight = highlight;
        this._responsibilities = responsibilities;
        this._requirements = requirements;
        this._educationRequirement = educationRequirement;
        this._companyID = companyID;
        positionType && (this._positionType = positionType);
        // 注意：positionID通常由数据库自动生成，因此这里不包含在构造函数中
    }
}

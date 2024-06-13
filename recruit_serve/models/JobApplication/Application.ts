// CREATE TABLE IF NOT EXISTS Applications (
//     applicationID INT AUTO_INCREMENT PRIMARY KEY,
//     applyTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '投递时间',
//     applicantID INT COMMENT '投递者ID',
//     companyID INT COMMENT '企业ID',
//     positionID INT COMMENT '岗位ID',
//     resumeID INT COMMENT '简历ID',
//     FOREIGN KEY (resumeID) REFERENCES Resumes(resumeID),
//     FOREIGN KEY (companyID) REFERENCES Companies(companyID),
//     FOREIGN KEY (positionID) REFERENCES Positions(positionID)
// );
import { IsInt, IsDateString } from 'class-validator';

/**
 * 申请实体类
 */
export class Application {
    /**
     * 申请ID，自增主键
     */
    @IsInt()
    applicationID: string;

    /**
     * 企业ID，必填
     */
    @IsInt()
    companyID: string;

    /**
     * 岗位ID，必填
     */
    @IsInt()
    positionID: string;

    /**
     * 简历ID，必填
     */
    @IsInt()
    resumeID: string;

    // 简历的key
    applicationKey: string

    private createDate: string;

    private updateDate: string;

    /**
     * 构造函数，初始化申请实体
     * 注意：applicationID和applyTime通常由数据库自动生成或管理，因此这里不包括applyTime在构造函数中
     */
    constructor(
        companyID?: string,
        positionID?: string,
        resumeID?: string,
        applicationKey?: string
    ) {
        companyID && (this.companyID = companyID);
        positionID && (this.positionID = positionID);
        resumeID && (this.resumeID = resumeID);
        applicationKey && (this.applicationKey = applicationKey);
    }
}

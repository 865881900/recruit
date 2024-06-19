// CREATE TABLE IF NOT EXISTS Company (
//     companyID INT AUTO_INCREMENT PRIMARY KEY,
//     companyName VARCHAR(255) NOT NULL COMMENT '企业名称',
//     companyLogo VARCHAR(255) COMMENT '企业logo图片URL',
//     companyAddress VARCHAR(255) COMMENT '企业地址',
//     companySize VARCHAR(100) COMMENT '企业规模',
//     companyIntroduction TEXT COMMENT '企业介绍'
// );
// 根据上面的sql, 生成node的ts实例对象, 每个字段都是必填项,构造函数 并且添加注解,


// 导入必要的库（例如，如果你打算使用这些类进行数据库操作）
import {IsArray, IsNotEmpty, IsString} from 'class-validator';
import {Position} from "./Position"; // 需要安装class-validator库来使用验证装饰器

/**
 * Company实体类
 */
export class Company {
  /**
   * 企业ID，自增主键
   */
  @IsNotEmpty() private _companyID: string;

  get companyID(): string {
    return this._companyID;
  }

  set companyID(value: string) {
    this._companyID = value;
  }

  /**
   * 企业名称，必填
   */
  @IsNotEmpty()
  @IsString() private _companyName: string;

  /**
   * 企业类型，必填
   */
  @IsNotEmpty()
  @IsString() private _companyType: string;

  /**
   * 企业logo图片URL
   */
  @IsNotEmpty()
  @IsString() private _companyLogo: string;

  /**
   * 企业地址
   */
  @IsNotEmpty()
  @IsString() private _companyAddress: string;

  /**
   * 企业规模
   */
  @IsNotEmpty()
  @IsString() private _companySize: string;

  /**
   * 企业介绍
   */
  @IsNotEmpty()
  @IsString() private _companyIntroduction: string;


  @IsArray()
  private _positionList: Array<Position>;

  private createDate: string;

  private updateDate: string;

  private _qrcode: string;


  get qrcode(): string {
    return this._qrcode;
  }

  set qrcode(value: string) {
    this._qrcode = value;
  }

  get positionList(): Array<Position> {
    return this._positionList;
  }

  set positionList(value: Array<Position>) {
    this._positionList = value;
  }

  /**
   * 构造函数，初始化企业实体
   * @param companyName 企业名称
   * @param companyLogo 企业logo图片URL
   * @param companyAddress 企业地址
   * @param companySize 企业规模
   * @param companyIntroduction 企业介绍
   * @param companyType 企业类型
   */
  constructor(
      companyName: string,
      companyLogo: string,
      companyAddress: string,
      companySize: string,
      companyIntroduction: string,
      companyType: string
  ) {
    this._companyName = companyName;
    this._companyLogo = companyLogo;
    this._companyAddress = companyAddress;
    this._companySize = companySize;
    this._companyIntroduction = companyIntroduction;
    this._companyType = companyType;
  }

  get companyName(): string {
    return this._companyName;
  }

  set companyName(value: string) {
    this._companyName = value;
  }

  get companyLogo(): string {
    return this._companyLogo;
  }

  set companyLogo(value: string) {
    this._companyLogo = value;
  }

  get companyAddress(): string {
    return this._companyAddress;
  }

  set companyAddress(value: string) {
    this._companyAddress = value;
  }

  get companySize(): string {
    return this._companySize;
  }

  set companySize(value: string) {
    this._companySize = value;
  }

  get companyIntroduction(): string {
    return this._companyIntroduction;
  }

  set companyIntroduction(value: string) {
    this._companyIntroduction = value;
  }

  get companyType(): string {
    return this._companyType;
  }

  set companyType(value: string) {
    this._companyType = value;
  }
}

import * as puppeteer from 'puppeteer'
import {v1} from "node-uuid";
import {getOSSController, OSSController} from '../userController/OSSController'
import {DIR} from "../../config/default";
import {Readable} from 'stream'
import {Browser} from "puppeteer";
import {GoogleBrowserServer, getBrowser} from "../../server/GoogleBrowserServer";
import {RequestData} from "../../utils/classList";
import SendData from "../../models/sendData";
import {getJobApplicationServer, JobApplicationServer} from "../../server/JobApplicationServer";


/**
 *爬取指定页面数据转为pdf,并上传到OSS中储存
 */
class CGetPDFFilByUrl {
    oss: OSSController
    browser: GoogleBrowserServer
    private jobApplicationServer: JobApplicationServer

    constructor() {
        this.jobApplicationServer = getJobApplicationServer()
        this.oss = getOSSController();
        this.browser = getBrowser()
    }

    //生成pdf文件,并上传到服务器
    async getPdfByFileId(req, res) {
        const sendData = new SendData();
        try {
            let that: CGetPDFFilByUrl = this;
            const applicationID: string = req.body.applicationID;
            let time = new Date().getTime() + '';
            const pdfBuffer: Buffer = await that.browser.getPagePdfOrBuffer(`http://localhost:9528/#/resumeInfo?applicationID=${applicationID}&time=${time}`, time)
            // pdfBuffer = await that.browser.getPagePdfOrBuffer(`http://test.qxlyun.com/#/${navString}?ids=${fileId}&time=${time}&type=pdf`, time)
            // pdfBuffer = await that.browser.getPagePdfOrBuffer(`http://localhost:8089/#/${navString}?ids=${fileId}&time=${time}`,time)
            // const pdfBuffer: Buffer = await that.browser.getPagePdfOrBuffer(`http://qxlyun.com/jsqxpc/#/${navString}?ids=${fileId}&time=${time}&type=pdf`,time)
            const readable: Readable = Readable.from(pdfBuffer);
            let {code}: RequestData = await that.oss.upLoadingOss(`${applicationID}.pdf`, readable);
            if (code == 200) {
                await this.jobApplicationServer.setCreatePdf(applicationID)
                res.send(sendData.getOkSendData({
                    filePath: `${applicationID}.pdf`
                }))
            } else {
                res.send(sendData.getNoSendData('存储错误'));
            }
        } catch (e) {
            res.send(sendData.getNoSendData(e.message));
        }
    }


    async getFileUrl(req, res) {
        const sendData = new SendData();
        try {
            let that: CGetPDFFilByUrl = this;
            const applicationKey: string = req.query.applicationKey;
            let url = await that.oss.uploadFile(applicationKey);
            if (url) {
                res.send(sendData.getOkSendData({
                    url: url
                }))
            } else {
                res.send(sendData.getNoSendData('返回错误'));
            }
        } catch (e) {
            res.send(sendData.getNoSendData(e.message));
        }
    }

    /**
     * 生成oss资源储存的路径
     */
    _generateFilenameBuV1() {
        let date = new Date(),
            y = date.getFullYear(),
            m = date.getMonth() + 1

        // return `text/${DIR}${y}${m > 9 ? m : `0${m}`}/${v1()}.pdf`
        return `${DIR}${y}${m > 9 ? m : `0${m}`}/${v1()}.pdf`
    }

    /**
     * 返回文件ID,并进行校验
     * @throws 没有id,抛出异常
     * @param body
     */
    _getFileIdByRequestBody(query) {
        let fileId: string,
            productName: string;
        fileId = query.fileId;
        productName = query.productName;
        if (!fileId || !productName) {
            throw '没有文件编号 or 没有文件名称'
        }
        return {
            productName,
            fileId
        }
    }

    /**
     * 根据 productName 返回需要绘制的页面的导航
     * @param productName 人员分类名称
     */
    _getUrlNavString(productName): string {
        let url: string
        switch (productName) {
            case '企事业员工心理健康体检系统':
            case '企事业招聘心理健康测评系统':
                url = 'businessStaff'
                break;
            case '用人单位员工心理体检评估系统':
            case '用人单位招聘心理素质测评系统':
            case 'TEST-招聘产品':
                url = 'staffTemplate'
                break
            case '学生心理品质发展性评价系统':
            case '学生学业与心理发展评价系统':
            case '学生心理与学业发展评价系统':
                url = 'psychological'
                break
            case '学生心理状态测评预警系统':
            case '注意力问题测试':
            case '厌学问题测试':
            case '学生心理健康筛查与预警系统':
                url = 'behavior'
                break
            case '寸金学院四年级测试':
            case '寸金学院二年级 - 三年级测试':
            case '用人单位招聘心理素质测评系统-基础':
                url = 'staffTemplateBasics'
                break
            case '职业兴趣测试':
                url = 'report'
                break
            case '部队官兵心理素质综合测评':
                url = 'soldiers'
                break
            default:
                throw `'${productName}' 该类型暂不支持获取pdf`
        }
        return url
    }

}

let pdfFilByUrl = new CGetPDFFilByUrl()

export function getPDFFilByUrl() {
    return pdfFilByUrl
}

interface getPdfBody {
    fileId: string,
    productName: string
}

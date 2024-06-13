/**
 *爬取指定页面数据转为pdf,并上传到OSS中储存
 */
import {DownloadWord} from "../../server/DownloadWord";
import {FetchHttp, getFetchHttp} from "../../utils/fetchHttp";

const fs = require('fs');

let i = 0;

class WordController {
    fetchHttp: FetchHttp = getFetchHttp()

    aliyunHead(req, res) {
        res.send()
    }

    //生成word文件
    async generateWordFile(req, res) {
        try {
            const id = req.query.pid || req.body.pid;
            const name = this._getFileName(req.query.name || req.body.name)
            if (!id) {
                res.send({
                    code: 500,
                    message: 'id不能为空'
                })
                return
            }
            const {code, questions, message} = await this._getFileDataById(id)
            if (code !== '200') {
                res.send({
                    code: 500,
                    message: '获取改测评产品的信息失败:' + message
                })
                return
            }
            const downloadWord: DownloadWord = new DownloadWord()

            await downloadWord.getFileByName(JSON.parse(questions), res)

            res.writeHead(200, {
                "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                'Content-disposition': `attachment; filename=${name}.docx;`,
            });
        } catch (e) {
            res.send({
                code: 500,
                message: e.toString()
            })
        }
    }


    _getFileName(name: string = 'paper') {
        try {
            return Buffer.from(name).toString('binary')
        } catch (e) {
            console.log(e)
            return 'paper'
        }

    }

    async _getFileDataById(id: string) {
        const {
            resultData: {questions},
            code,
            message
            // } = await this.fetchHttp.post(`http://test.qxlyun.com/admin/webapp-admin/productWeb/testBeforeComplete/${id}`, {});
        } = await this.fetchHttp.post(`http://qxlyun.com:8089/admin/webapp-admin/productWeb/testBeforeComplete/${id}`, {});

        return {
            questions,
            code,
            message
        }
    }


    //生成word文件
    async test(req, res) {
        setTimeout(() => {
            res.send({
                code: i++,
                message: 'id不能为空'
            })
        }, 3000)
    }

}

let wordController = new WordController()

export function getWordController() {
    return wordController
}


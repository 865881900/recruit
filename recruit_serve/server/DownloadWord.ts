import {
    changeNum,
    changeNumMap,
    parsingHTML,
    toChinesNum,
} from "../utils/util";

const moment = require("moment");
const officegen = require('officegen');
const path = require('path');
const fs = require('fs');

export class DownloadWord {
    fs: any = fs
    docx: any = officegen('docx')

    constructor() {
    }

    getFileByName(data: any, res) {
        //处理data中的html
        data.Description_Summary = parsingHTML(data.Description_Summary)

        data.Parts = data.Parts.map(item => {
            item.Description = parsingHTML(item.Description)
            item.type = item.Questions[0].Question_Type_Id
            return item
        })
        const docx = this.docx
        //生成封面
        this.createCover(data.Name)
        //注意事项
        this.createNotice(data.Parts, data.Expect_Answer_Time, data.Description_Summary)

        for (let i = 0; i < data.Parts.length; i++) {
            this.noticeTitle(data.Parts[i], i, data.Parts.length)

        }
        docx.generate(res)
    }

    //创建封面
    createCover(titleText: string) {
        const title = this.docx.createP({
            align: 'center'
        })
        this._addLineBreak(title, 7).addText(titleText, {
            font_size: 36,
            font_face: '宋体',
            bold: true,
        })
        this._addLineBreak(title, 10).addText('考试编号:_______________', {
            font_size: 18,
            font_face: '微软雅黑',
        })

        const timeData: Array<String> = moment().format('YYYY-MM-DD').split('-').map(item => toChinesNum(item))

        this._addLineBreak(title, 10)
        const time = this.docx.createP({
            align: 'right',
        })
        time.addText(`${timeData[0]}年${timeData[1]}月${timeData[2]}日`, {
            font_size: 16,
            font_face: '宋体',
        });
        this.docx.putPageBreak()
    }

    /**
     *创建注意事项页面
     * @param Parts 题目信息
     * @param time 做题时间
     */
    createNotice(parts: Array<any>, time: number, hintList: Array<string>) {
        let notice = this.docx.createP({
            align: 'center'
        })
        const reg: RegExp = /&nbsp;/gi
        let topicSum = 0; //总题数
        notice.addText('测验说明', {
            font_size: 20,
            bold: true,
            font_face: '宋体',
        })

        notice = this.docx.createP({
            align: 'left'
        })
        this._addLineBreak(notice, 1)
        hintList.map(t => {
            notice.addText(t.replace(reg, ' ').split('&gt;').join('>').split('&lt;').join('<'), {
                font_size: 16,
                font_face: '宋体',
            })
            this._addLineBreak(notice, 1)
        })
        this._addLineBreak(notice, 2)
        if (parts.length > 0) {
            notice.addText(`本测验包括${changeNumMap[parts.length]}部分内容`, {
                font_size: 16,
                bold: true,
                font_face: '宋体',
            })
            this._addLineBreak(notice, 1)
            for (let i = 0; i < parts.length; i++) {
                const item = parts[i].Questions
                let type = item[0].Question_Type_Id
                notice.addText(`${changeNum[i + 1]}、${parts[i].Part_Name}    (${item.length}题)`, {
                    font_size: 16,
                    font_face: '宋体',
                })
                topicSum += item.length
                this._addLineBreak(notice, 1)
            }
        }
        this._addLineBreak(notice, 4)
        notice.addText(`共计${topicSum}题，作答时间为${time}分钟`, {
            font_size: 16,
            font_face: '宋体',
        })
        this._addLineBreak(notice, 4)
        notice.addText(`请注意合理安排作答进度。`, {
            font_size: 16,
            font_face: '宋体',
            bold: true,
        })
        this.docx.putPageBreak()
    }

    //创建大题的说明
    noticeTitle(partsItem, i, length) {
        const reg: RegExp = /&nbsp;/gi
        const description = partsItem.Description
        const questions = partsItem.Questions
        let p = this.docx.createP({
            align: 'center',
        })
        //大题名称
        p.addText(`${changeNum[i + 1]}、${partsItem.Part_Name}    (${questions.length}题)`, {
            font_size: '16',
            bold: true,
            font_face: '宋体',
        })
        this._addLineBreak(p, 1)
        //大题说明
        p.addText(`填写说明`, {
            font_size: '24',
            bold: true,
            font_face: '宋体',
        })
        p = this.docx.createP({
            align: 'left',
        })
        this._addLineBreak(p, 1)
        for (let j = 0; j < description.length; j++) {
            let item = description[j]
            p.addText(item.replace(reg, ' ').split('&gt;').join('＜').split('&lt;').join('＞'), {
                font_face: '宋体',
                font_size: '16',
            })
            this._addLineBreak(p, 1)
        }
        switch (partsItem.type) {
            case 1:
                this.radioLikert(questions)
                break
            case 2:
                this.radioText(questions)
                break
            case 5:
                this.twoSelectOne(questions)
                break
        }
        if (i < length - 1) {
            this.docx.putPageBreak()
        }
    }

    //单选题（文字）
    radioText(questions) {
        const p = this.docx.createP({
            align: 'left',
        })
        for (let j = 0; j < questions.length; j++) {
            const item = questions[j];
            const options = item.Options
            p.addText(`${j + 1}、${item.Content}`, {
                font_size: '16',
                font_face: '宋体',
            })
            this._addLineBreak(p, 1)
            for (let k = 0; k < options.length; k++) {
                const items = options[k]
                p.addText(`      ${items.Option_Tag}、${items.Option_Describe}`, {
                    font_size: '16',
                    font_face: '宋体',
                })
                this._addLineBreak(p, 1)
            }
            this._addLineBreak(p, 1)
        }

    }

    //Likert
    radioLikert(questions) {
        const array = []
        array[0] = [
            {
                val: '',
                opts: {
                    align: "center",
                    vAlign: "center",
                    sz: '24',
                    bold: true,
                }
            },
            {
                val: '',
                opts: {
                    align: "center",
                    vAlign: "center",
                    sz: '24',
                    bold: true,
                }
            },
            {
                val: '完全不符合',
                opts: {
                    align: "center",
                    vAlign: "center",
                    sz: '24',
                    bold: true,
                    color: '000000'
                }
            },
            {
                val: '不太符合',
                opts: {
                    align: "center",
                    bold: true,
                    vAlign: "center",
                    sz: '24',
                    color: '000000'
                }
            },
            {
                val: '不确定',
                opts: {
                    align: "center",
                    bold: true,
                    vAlign: "center",
                    sz: '24',
                    color: '000000'
                }
            },
            {
                val: '比较符合',
                opts: {
                    align: "center",
                    bold: true,
                    vAlign: "center",
                    sz: '24',
                    color: '000000'
                }
            },
            {
                val: '完全符合',
                opts: {
                    align: "center",
                    bold: true,
                    vAlign: "center",
                    sz: '24',
                    color: '000000'
                }
            }
        ]
        for (let i = 0; i < questions.length; i++) {
            const quest = questions[i]
            let isFill: boolean = i % 2 === 0
            array.push([
                {
                    val: i + 1,
                    opts: {
                        shd: isFill && {
                            fill: "FAFAFA",
                            "themeFillTint": "10"
                        },
                        color: '000000'
                    }
                },
                {
                    val: quest.Content,
                    opts: {
                        shd: isFill && {
                            fill: "FAFAFA",
                            "themeFillTint": "10"
                        },
                        color: '000000'
                    }
                },
                {
                    val: 1,
                    opts: {
                        shd: isFill && {
                            fill: "FAFAFA",
                            "themeFillTint": "10"
                        },
                        color: '000000'
                    }
                },
                {
                    val: 2,
                    opts: {
                        shd: isFill && {
                            fill: "FAFAFA",
                            "themeFillTint": "10"
                        },
                        color: '000000'
                    }
                },
                {
                    val: 3,
                    opts: {
                        shd: isFill && {
                            fill: "FAFAFA",
                            "themeFillTint": "10"
                        },
                        color: '000000'
                    }
                },
                {
                    val: 4,
                    opts: {
                        shd: isFill && {
                            fill: "FAFAFA",
                            "themeFillTint": "10"
                        },
                        color: '000000'
                    }
                },
                {
                    val: 5,
                    opts: {
                        shd: isFill && {
                            fill: "FAFAFA",
                            "themeFillTint": "10"
                        },
                        color: '000000'
                    }
                },
            ])
        }
        this.docx.createTable(array, {
            tableSize: 24,
            tableColor: "ada",
            tableAlign: "left",
            tableFontFamily: "宋体",
            spacingBefor: 10, // default is 100
            spacingAfter: 10, // default is 100
            spacingLine: 10, // default is 240
            spacingLineRule: 'atLeast', // default is atLeast
            indent: 0, // table indent, default is 0
            fixedLayout: false, // default is false
            borders: true, // default is false. if true, default border size is 4
            borderSize: 2, // To use this option, the 'borders' must set as true, default is 4
            columns: [{width: 200}, {width: 1200}, {width: 200}, {width: 200}, {width: 200}, {width: 200}, {width: 200}], // Table logical columns
        })
    }

    //2选1
    twoSelectOne(questions) {
        const array = []
        for (let i = 0; i < questions.length; i++) {
            let isFill: boolean = i % 2 === 0
            const quest = questions[i].Options
            array.push([
                {
                    val: i + 1,
                    opts: {
                        shd: isFill && {
                            fill: "FAFAFA",
                            "themeFillTint": "10"
                        },
                        color: '000000'
                    }
                },
                {
                    val: quest[0].Option_Tag,
                    opts: {
                        shd: isFill && {
                            fill: "FAFAFA",
                            "themeFillTint": "10"
                        },
                        color: '000000'
                    }
                },
                {
                    val: quest[0].Option_Describe,
                    opts: {
                        shd: isFill && {
                            fill: "FAFAFA",
                            "themeFillTint": "10"
                        },
                        color: '000000'
                    }
                }])
            array.push([
                {
                    val: null,
                    opts: {
                        shd: isFill && {
                            fill: "FAFAFA",
                            "themeFillTint": "10"
                        },
                        color: '000000'
                    }
                }, {
                    val: quest[1].Option_Tag,
                    opts: {
                        shd: isFill && {
                            fill: "FAFAFA",
                            "themeFillTint": "10"
                        },
                        color: '000000'
                    }
                }, {
                    val: quest[1].Option_Describe,
                    opts: {
                        shd: isFill && {
                            fill: "FAFAFA",
                            "themeFillTint": "10"
                        },
                        color: '000000'
                    }
                }])
        }
        this.docx.createTable(array, {
            tableSize: 24,
            tableColor: "ada",
            tableAlign: "left",
            tableFontFamily: "等线",
            spacingBefor: 10, // default is 100
            spacingAfter: 10, // default is 100
            spacingLine: 10, // default is 240
            spacingLineRule: 'atLeast', // default is atLeast
            indent: 0, // table indent, default is 0
            fixedLayout: false, // default is false
            borders: true, // default is false. if true, default border size is 4
            borderSize: 2, // To use this option, the 'borders' must set as true, default is 4
            columns: [{width: 200}, {width: 200}, {width: 2000}], // Table logical columns

        })
    }

    /**
     * 添加换行符
     * @param pObj 需要换行的段落对象
     * @param num 需要换行的次数
     */
    _addLineBreak(pObj, num) {
        while (num >= 1) {
            pObj.addLineBreak()
            num--
        }
        return pObj
    }


}


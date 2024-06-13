
export const changeNumMap = ['〇', '一', '两', '三', '四', '五', '六', '七', '八', '九'];
export const changeNum = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
export const changeNum2 = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'G'];
export const topicTypeNameMap ={
    1:"likert",
    2:"单选题（文字）",
    3:"单选题（图片）",
    4:"形容词量表",
    5:"迫选二选一",
    6:"主观题",
    7:"likert组合题",
    8:"多选题",
    9:"单选题（题干图片，选项文字）",
    10:"表格题",
    11:"排序题"
}



/**
 * 把数字变为汉字
 * @param num
 */
export function toChinesNum(num: string | number) {
    num = typeof num === 'string' && parseInt(num);
    let overWan = Math.floor(num / 10000);
    let noWan: string | number = num % 10000;
    if (noWan.toString().length < 4) {
        noWan = "0" + noWan;
    }
    return overWan ? getWan(overWan) + "万" + getWan(noWan) : getWan(num);
}

function getWan(temp) {

    const unit = ["", "十", "百", "千", "万"];
    let strArr = temp.toString().split("").reverse();
    let newNum = "";
    for (var i = 0; i < strArr.length; i++) {
        newNum = (i == 0 && strArr[i] == 0 ? "" : (i > 0 && strArr[i] == 0 && strArr[i - 1] == 0 ? "" : changeNum[strArr[i]])) + newNum;
    }
    return newNum;

}


//反解析html标签
export function parsingHTML(str: string) {
    let list: Array<string>;
    try {
        const rgb1: RegExp = new RegExp(/<p>(.*?)<\/p>/g),
            reg2: RegExp = new RegExp('<[^>]+>', 'gi');
        list = str.split(rgb1)
        list = list.map(item => item.replace(reg2, '').trim()).filter(item => item !== '');
    }catch (err){
        console.error(err);
    }
    return list
}


//判断是否为http开头的
const isUrlExpReg = /^http:\/\//
export function isUrl(str){
    return isUrlExpReg.test(str)
}
const fs = require('fs');

//删除文件夹
export function async (imgSrc){
    fs.rmdir(imgSrc)
}



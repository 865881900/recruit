import {Browser, Page, PDFOptions} from "puppeteer";
import * as puppeteer from "puppeteer";

// page的状态管理, 等待中, 使用中, 错误,
enum PageState {
    waiting = 'waiting',
    using = 'using',
    error = 'error'
}

type Pages = {
    page: Page,
    state: PageState
}


/**
 * 用来操作浏览器的类
 */
export class GoogleBrowserServer {
    // 浏览器实例
    browser: Browser// 生成PDF配置
    pageMap: Map<string, Array<Pages>>

    constructor() {
        this.pageMap = new Map<string, Array<Pages>>();
    }

    // 初始化浏览器实例
    async init(): Promise<Browser> {
        if (!this.browser) {
            const browserFetcher = puppeteer.createBrowserFetcher();
            //获取当期主机的所有浏览器的版本
            let browserList: Array<string> = await browserFetcher.localRevisions();
            if (!browserList.includes('809590')) {
                console.log('下载浏览器');
                //没有下载该版本
                await browserFetcher.download('809590');
                console.log('下载成功');
            }
            console.log('启动浏览器');

            // 创建浏览器实例
            this.browser = await puppeteer.launch({
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
                headless: true
            });
            // 监听浏览器销毁事件, 销毁后清空实例
            this.browser.once('disconnected', () => {
                this.browser = undefined
            })
        }
        return this.browser
    }

    // 创建页面,
    async createPage(key, url) {
        let pagePool: Array<Pages>;
        let page: Page;
        if (this.pageMap.has(key)) {
            pagePool = this.pageMap.get(key);
        } else {
            pagePool = new Array<Pages>();
            page = await this.browser.newPage();
            pagePool.push({
                state: PageState.waiting,
                page: page,
            })
            this.pageMap.set(key, pagePool)
        }

        page = pagePool.find(_page => _page.state === PageState.waiting);
        if (page) {

        }


        return page;
    }


    //生成pdf文件,并上传到服务器
    async getPagePdfOrBuffer(url, time: string, options: PDFOptions = {}): Promise<Buffer> {
        let page;
        try {
            const hintData = this._getHintData(url);
            await this.init()
            console.log(hintData.hint);
            page = await this.browser.newPage();
            await page.goto(url, {
                waitUntil: 'networkidle0',
                timeout: 0
            });
            //这里监听页面的window.xuanran 属性发生变化后,再执行pdf函数, Vue页面在渲染完毕后会修改window.xuanran ,再执行绘制页面
            let data = await page.waitForFunction(`window.n${time} == true`, {
                polling: 'mutation', // 执行函数的调用频率,
                timeout: 30 * 1000 // 最长时间
            })
            const pdfBuffer = await page.pdf({
                printBackground: true,
                width: '1080px',
                height: '1528px',
                format: 'A4',
                preferCSSPageSize: true,
                ...options,
            });
            await page.close();
            return pdfBuffer
        } catch (e) {
            console.log(`生成错误,关闭页面`, e.message)
            await page && page.close();
            throw e
        }

    }

    //关闭浏览器
    async exit() {
        if (!this.browser) {
            return
        }
        await this.browser.close()
    }

    //返回控制台打印信息
    _getHintData(url): HintData {
        let date: Date;
        date = new Date()
        return {
            hint: `生成路径:${url},生成时间:${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
            time: date.getTime()
        }
    }
}

let browser = new GoogleBrowserServer()

//退出时结束浏览器，防止内存泄漏
process.on('exit', () => {
    browser.exit()
})

export function getBrowser() {
    return browser
}

interface HintData {
    hint: string
    time: number
}

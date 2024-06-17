type PageTaskQueue = {
    url: string, // 路径地址
    callback: string // 回调处理函数
}


class PuppeteerGooglePage {
    GOOGLE_MAX: number = 10
    GOOGLE_M: number = 1
    taskQueue: PageTaskQueue
}

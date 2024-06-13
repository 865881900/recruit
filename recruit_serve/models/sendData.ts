export default class SendData {
    private message: string = ''
    private data: any = null
    private success: boolean = true
    private code: number = 200

    getOkSendData(data: any = null, message: string = '请求成功'): SendData {
        this.data = data;
        message && (this.message = message);
        return this
    }

    getNoSendData(message: string, code: number = 500): SendData {
        this.message = message;
        this.code = code;
        this.success = false;
        return this
    }

    get401SendData(): SendData {
        this.message = '登录过期';
        this.code = 401;
        this.success = false;
        return this
    }
}

import {FetchHttp, getFetchHttp} from "./fetchHttp";
import {SECRET, APPID} from "../config/default";

export class WXUtil {
    private fetchHttp: FetchHttp;

    constructor() {
        this.fetchHttp = getFetchHttp();
    };

    //获取token 签名
    public async getWXAccessToken() {
        try {
            return this.fetchHttp.get('https://api.weixin.qq.com/cgi-bin/token', {
                grant_type: 'client_credential',
                appid: APPID,
                secret: SECRET
            })
        } catch (e) {
            throw e;
        }
    };


    public async createQRCode(path: string, width: number = 280): Promise<any> {
        try {
            let data: any = await this.getWXAccessToken();

            if (data.access_token) {
                return this.fetchHttp.fetchs(`https://api.weixin.qq.com/cgi-bin/wxaapp/createwxaqrcode?access_token=${data.access_token}`,
                    "POST", "buffer", {
                        'path': path,
                        'width': width,
                        'access_token': data.access_token
                    });
            }
        } catch (e) {
            throw e
        }
    }
}

const wxUtil = new WXUtil();

export function getWXUtil() {
    return wxUtil
}

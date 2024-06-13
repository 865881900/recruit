import {MpUploadOssHelper} from "../../models/MpUploadOssHelper";
import {ACCESSKEYID, ACCESSKEYSECRET, DIR, HOST, OSSConfig} from "../../config/default";
import * as OSS from "ali-oss";
import {OperateData} from "../../utils/OperateData";
export class OSSController {
    private oss: OSS;

    constructor() {
        this.oss = new OSS(OSSConfig)
    };

    /**
     * 返回OSS 的签名信息
     * @param req
     * @param res
     * @param next
     */
    public getSignature(req, res, next) {
        try {
            let {policy, signature} = new MpUploadOssHelper(ACCESSKEYID, ACCESSKEYSECRET, 1, 10).createUploadParams();
            res.send({
                code: 200,
                data: {
                    policy: policy,
                    signature: signature,
                    accessid: ACCESSKEYID,
                    host: HOST,
                    dir: DIR,
                }
            })
        } catch (e) {
            res.send({
                code: 500,
                mesg: e.message
            })
        }
    }


    /**
     * 返回查看签名
     * @param url
     */
    public signatureUrl(url): string {
        return this.oss.signatureUrl(url, {
            expires: 3600
        });
    };


    /**
     * 上传本地buff文件,冰岛返回加了令牌的地址
     *
     */
    public async unLoadingFile(data: Buffer) {
        let images: any = await this.oss.put(`code/${OperateData.createId('url')}.jpeg`, data);
        return this.signatureUrl(images.name)
    }


    public async upLoadingOss(name: string, buffer){
        // const result = await this.oss.listBuckets(null);
        // console.log(result);
        let {res: {status}}: any = await this.oss.putStream(`${name}`, buffer);
        if (status != 200) {
            throw 'oss上传失败'
        }
        return {
            code: 200
        }
    }


}

let oSSController = new OSSController();

export function getOSSController(): OSSController {
    return oSSController
}

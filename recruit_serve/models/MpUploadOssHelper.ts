
import * as crypto  from 'crypto';
export interface UploadParams {
    policy:string,
    signature:string,
}
export class MpUploadOssHelper {
    private accessKeyId: string;
    private accessKeySecret: string;
    private timeOut: number;
    private maxSize: number;

    /**
     *
     * @param accessKeyId  id
     * @param accessKeySecret 秘钥
     * @param timeOut 限制参数的有效时间(单位: 小时)
     * @param maxSize 限制上传文件大小(单位: Mb)
     */
    constructor(accessKeyId: string, accessKeySecret:string, timeOut: number = 1, maxSize: number = 10) {
        this.accessKeyId = accessKeyId;
        this.accessKeySecret = accessKeySecret;
        this.timeOut = timeOut;
        this.maxSize = maxSize;
    }

    createUploadParams():UploadParams{
        const policy = this.getPolicyBase64();
        const signature = this.signature(policy);
        const objectKey = Date.now().toString();
        return {
            policy: policy,
            signature: signature
        }
    }

    getPolicyBase64():string{
        let date = new Date();
        // 设置 policy 过期时间
        date.setHours(date.getHours() + this.timeOut);
        let srcT = date.toISOString();
        const policyText = {
            expiration: srcT,
            conditions: [
                // 限制上传大小
                ['content-length-range', 0, this.maxSize * 1024 * 1024]
            ]
        };
        const buffer = Buffer.from(JSON.stringify(policyText));
        return buffer.toString('base64');
    }

    signature(policy) :string{
        return crypto.createHmac('sha1', this.accessKeySecret).update(policy).digest().toString('base64');
    }
}

import {getWXUtil, WXUtil} from "../../utils/WXUtil";
import {getOSSController, OSSController} from "./OSSController";


export class WxController {
    wxUtil: WXUtil;
    ossController: OSSController;

    constructor() {
        this.wxUtil = getWXUtil();
        this.ossController = getOSSController();
    };


    async getORcode(req, res) {
            let {path} = req.body, data: any;
        try {
            data = await this.wxUtil.createQRCode(path);
            res.send({
                code: 200,
                wxCodeImage: await this.ossController.unLoadingFile(data)
            })
        } catch (e) {
            res.send({
                code: 500,
                mesg: e.message
            })
        }


    };


}

let wxController = new WxController();

export function getWxController(): WxController {
    return wxController
}

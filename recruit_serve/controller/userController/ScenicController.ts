import {ScenicDAO, getScenicDAO} from "../../DAO/ScenicDAO";
import {Scenic} from "../../models/Scenic";

export class ScenicController {
    scenicADO: ScenicDAO;

    constructor() {
        this.scenicADO = getScenicDAO()
    }


    /**
     * 返回景点的信息
     * @param req
     * @param res
     */
    public async getScenicList(req, res) {
        try {
            res.send({
                data: await this.scenicADO.getScenicList(),
                code: 200
            })
        } catch (e) {
            res.send({
                code: 500,
                mesg: e.message
            })
        }
    };


    /**
     * 返回景点信息,并且返回该用户是否去打卡
     * @param req
     * @param res
     */
    public async getScenicListBySessionId(req, res) {
        let  scenicList: Array<Scenic>, scenicClock: any,{userId} = req.body;
        try {
            scenicList = await this.scenicADO.getScenicList();
            scenicClock = await this.scenicADO.getScenicClock(userId);
            if (scenicClock.length > 0) {
                for (let i = 0; i < scenicClock.length; i++) {
                    for (let j = 0; j < scenicList.length; j++) {
                        if(scenicClock[i].scenicId == scenicList[j].getScenicId()){
                            scenicList[j].setGray(true);
                            continue
                        }
                    }
                }
            }
            res.send({
                code: 200,
                data: scenicList
            })
        } catch (e) {
            res.send({
                code: 500,
                mesg: e.message
            })
        }
    };


};

const scenicController = new ScenicController()

export function getScenicController(): ScenicController {
    return scenicController
}

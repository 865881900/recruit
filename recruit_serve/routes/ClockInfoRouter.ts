import {Router} from 'express'
import {getClockInfoController, ClockInfoController} from "../controller/userController/ClockInfoController"
import {UserCheck,getUserCheck} from  '../middlewares/UserCheck'
const router = Router();

let  clockInfoController:ClockInfoController = getClockInfoController();
let  userCheck:UserCheck = getUserCheck();
router.post('/saveClock', userCheck.checkLogin.bind(userCheck),clockInfoController.saveUserClock.bind(clockInfoController));
router.post('/getClockListByScenicId', userCheck.checkLogin.bind(userCheck),clockInfoController.getClockListByScenicId.bind(clockInfoController));
router.post('/saveClockCanvasImage', userCheck.checkLogin.bind(userCheck),clockInfoController.saveClockCanvasImage.bind(clockInfoController));
router.post('/isSessionEqueiUserId', userCheck.checkLogin.bind(userCheck),clockInfoController.isSessionEqueiUserId.bind(clockInfoController));
router.post('/gotoGiveLike', userCheck.checkLogin.bind(userCheck),clockInfoController.gotoGiveLike.bind(clockInfoController));
router.post('/getClockGiveLikeList', userCheck.checkLogin.bind(userCheck),clockInfoController.getClockGiveLikeList.bind(clockInfoController));
router.post('/getClockDetails', clockInfoController.getClockDetailsByClockInfoId.bind(clockInfoController));
export = router

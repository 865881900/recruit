import {Router} from 'express'

const router = Router();
import {ScenicController, getScenicController} from '../controller/userController/ScenicController'
import {UserCheck, getUserCheck} from '../middlewares/UserCheck'

//,userCheck.checkLogin.bind(userCheck) 查看登陆是否过期
let userCheck: UserCheck = getUserCheck();
let scenicController: ScenicController = getScenicController()

//可以进行连续的回调
router.post('/scenic', scenicController.getScenicList.bind(scenicController));
router.post('/getScenicListBySessionId', userCheck.checkLogin.bind(userCheck),scenicController.getScenicListBySessionId.bind(scenicController));
export = router

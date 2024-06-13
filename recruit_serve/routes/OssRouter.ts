
import {Router} from 'express'
import {getOSSController, OSSController} from '../controller/userController/OSSController'
import {UserCheck,getUserCheck} from  '../middlewares/UserCheck'
const router = Router();

let  oSSController:OSSController = getOSSController();
let  userCheck:UserCheck = getUserCheck();
//,userCheck.checkLogin.bind(userCheck) 查看登陆是否过期

//可以进行连续的回调
router.post('/getSignature',userCheck.checkLogin.bind(userCheck),oSSController.getSignature.bind(oSSController));
export = router

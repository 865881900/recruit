
import {Router} from 'express'
import {WxController, getWxController} from '../controller/userController/WxController'
import {UserCheck,getUserCheck} from  '../middlewares/UserCheck'
const router = Router();

let  wxController:WxController = getWxController();
let  userCheck:UserCheck = getUserCheck();

//可以进行连续的回调
router.post('/getORcode',userCheck.checkLogin.bind(userCheck),wxController.getORcode.bind(wxController));
export = router

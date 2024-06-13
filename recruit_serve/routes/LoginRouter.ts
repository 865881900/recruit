import {Router} from 'express'
// import {getLogin, LoginController} from '../controller/userController/LoginController'
import {UserCheck,getUserCheck} from  '../middlewares/UserCheck'
const router = Router();

// let  login:LoginController = getLogin();
let  userCheck:UserCheck = getUserCheck();


// 查看登陆是否过期
// userCheck.checkLogin.bind(userCheck)

import {getLogins} from "../controller/userController/LoginController";

const logins = getLogins();
//可以进行连续的回调
// router.post('/loginwx', login.newLogin.bind(login));
// router.post('/login', login.login.bind(login));


// 用户相关
router.post('/signIn', logins.signIn.bind(logins));
router.post('/login', logins.login.bind(logins));
router.get('/logOut', logins.logOut.bind(logins));
router.get('/getUserinfo', logins.getUserinfo.bind(logins));
router.post('/bindingResumeID', logins.bindingResumeID.bind(logins));

export = router

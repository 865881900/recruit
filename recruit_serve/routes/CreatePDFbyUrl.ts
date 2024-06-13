import {Router} from 'express'

const router = Router();
import {getPDFFilByUrl} from "../controller/qiYeWeiXinController/CGetPDFFilByUrl"
import {getWordController} from "../controller/CreadWordController/WordController";
import {FileSectionToUpload} from "../controller/FileSectionToUpload";

const pdfFilByUrl = getPDFFilByUrl()
const wordController = getWordController()
const fileSectionToUpload = new FileSectionToUpload()
router.post('/getP', pdfFilByUrl.getPdfByFileId.bind(pdfFilByUrl));
// router.head('/aliyunHead', wordController.aliyunHead.bind(wordController))
// router.get('/getWordFile', wordController.generateWordFile.bind(wordController))
// router.post('/getWordFile', wordController.generateWordFile.bind(wordController))
// router.get('/test', wordController.test.bind(wordController))
// router.get('/test', wordController.test.bind(wordController))
// router.post('/upload', fileSectionToUpload.unload.bind(fileSectionToUpload))
export = router

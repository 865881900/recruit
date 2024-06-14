import {Router} from 'express'
import {getJobApplicationController, JobApplicationController} from "../controller/JobApplicationCortroller";
import {getUpload, Upload} from "../controller/upload";

const router = Router();
const jobApplicationController: JobApplicationController = getJobApplicationController();
const upload: Upload = getUpload();
// 企业
router.get('/getCompaniesByCompanyID', jobApplicationController.getCompaniesByCompanyID.bind(jobApplicationController));
router.post('/addCompany', jobApplicationController.addCompany.bind(jobApplicationController));
router.post('/updateCompany', jobApplicationController.updateCompany.bind(jobApplicationController));
router.post('/getCompanyList', jobApplicationController.getCompanyList.bind(jobApplicationController));
// 岗位
router.post('/addPosition', jobApplicationController.addPosition.bind(jobApplicationController));
router.get('/removePosition', jobApplicationController.removePosition.bind(jobApplicationController));
router.post('/updatePosition', jobApplicationController.updatePosition.bind(jobApplicationController));
router.post('/getPositionList', jobApplicationController.getPositionList.bind(jobApplicationController));
router.get('/getPositionByPositionID', jobApplicationController.getPositionByPositionID.bind(jobApplicationController));
// 简历
router.post('/createResume', jobApplicationController.createResume.bind(jobApplicationController));
router.post('/updateResume', jobApplicationController.updateResume.bind(jobApplicationController));
router.get('/getResumeByResumeID', jobApplicationController.getResumeByResumeID.bind(jobApplicationController));

// 教育经历
router.post('/addEducationHistory', jobApplicationController.addEducationHistory.bind(jobApplicationController));
router.get('/removeEducationHistory', jobApplicationController.removeEducationHistory.bind(jobApplicationController));
router.post('/updateEducationHistory', jobApplicationController.updateEducationHistory.bind(jobApplicationController));
router.get('/getEducationHistoryById', jobApplicationController.getEducationHistoryById.bind(jobApplicationController));

router.post('/addWorkExperience', jobApplicationController.addWorkExperience.bind(jobApplicationController));
router.get('/removeWorkExperience', jobApplicationController.removeWorkExperience.bind(jobApplicationController));
router.post('/updateWorkExperience', jobApplicationController.updateWorkExperience.bind(jobApplicationController));
router.get('/getWorkExperienceByExperienceID', jobApplicationController.getWorkExperienceByExperienceID.bind(jobApplicationController));

// 投递简历
router.post('/addApplication', jobApplicationController.addApplication.bind(jobApplicationController));
router.post('/getResumeList', jobApplicationController.getResumeList.bind(jobApplicationController));
router.get('/getApplication', jobApplicationController.getApplication.bind(jobApplicationController));

// 其他
router.post('/getEnumMap', jobApplicationController.getEnumMap.bind(jobApplicationController));
router.post('/uploads', upload.uploads.bind(upload));
router.get('/download', upload.download.bind(upload));


export = router

import {politicalStatusOptions} from "@/utils/dictionary";


export default [
  {
    'title': '头像',
    'key': 'avatar',
    'type': 'image'
  },
  {
    'title': '姓名',
    'key': 'name',
    'type': 'input',
    'maxlength': '10'
  },
  {
    'title': '身份证号',
    'key': 'iDNumber',
    'type': 'input',
    'maxlength': '18'
  },
  {
    'title': '性别',
    'key': 'gender',
    'type': 'picker',
    'options': [
      {
        value: '男',
        key: '1'
      },
      {
        value: '女',
        key: '0'
      }
    ]
  },
  {
    'title': '生日',
    'key': 'birthday',
    'type': 'date'
  },
  {
    'title': '邮箱',
    'key': 'email',
    'type': 'input',
    'maxlength': '20'
  },
  {
    'title': '手机号',
    'key': 'phoneNumber',
    'type': 'input',
    'maxlength': '11'
  },
  {
    'title': '微信号',
    'key': 'weChat',
    'type': 'input',
    'maxlength': '20'
  },
  {
    'title': '民族',
    'key': 'ethnicity',
    'type': 'input',
    'maxlength': '10'
  },
  {
    'title': '政治面貌',
    'key': 'politicalStatus',
    'type': 'picker',
    'options': politicalStatusOptions
  },
  {
    'title': '最早入职日期',
    'key': 'earliestStartDate',
    'type': 'date'
  },
  {
    'title': '个人社交主页',
    'key': 'socialProfile',
    'type': 'input',
    'maxlength': '20'
  },
  {
    'title': '求职身份',
    'key': 'jobSeekerStatus',
    'type': 'picker',
  },
  {
    'title': '个人说明',
    'key': 'personalStatement',
    'type': 'textarea',
    'maxlength': '100'
  },
]
// "ExperienceID": "EXPERIENCEID51feaa10x262ex11efxaa4bx8d95e57dbb73",
//   "JobType": "工作类型",
//   "CompanyName": "企业名称",
//   "PositionTitle": "岗位",
//   "City": "城市",
//   "StartDate": "2022-12-11T16:00:00.000Z",
//   "EndDate": "2022-12-11T16:00:00.000Z",
//   "JobDescription": "工作内容",
//   "resumeID": "RESUMEID670f27b0x2271x11efx9aa9xdf71c8a27c79"

export const resumeWork = [
  {
    'title': '企业名称',
    'key': 'companyName',
    'type': 'input',
    'maxlength': '20'
  },
  {
    'title': '工作类型',
    'key': 'jobType',
    'type': 'input',
    'maxlength': '10'
  },
  {
    'title': '岗位',
    'key': 'positionTitle',
    'type': 'input',
    'maxlength': '10'
  },
  {
    'title': '城市',
    'key': 'city',
    'type': 'region',

  },
  {
    'title': '入职日期',
    'key': 'startDate',
    'type': 'date',
  },
  {
    'title': '离职日期',
    'key': 'endDate',
    'type': 'date',
  },
  {
    'title': '工作内容',
    'key': 'jobDescription',
    'type': 'textarea',
    'maxlength': '100'
  },
]


// "educationID": "EDUCATIONID9464fd70x2271x11efx9aa9xdf71c8a27c79",
// 				"schoolName": "学校名称",
// 				"major": "专业",
// 				"degree": "学历",
// 				"city": "城市",
// 				"startDate": "2022-12-11T16:00:00.000Z",
// 				"endDate": "2022-12-11T16:00:00.000Z",
// 				"educationDescription": "教育描述",
// 				"resumeID": "RESUMEID670f27b0x2271x11efx9aa9xdf71c8a27c79"
export const resumeEducation = [
  {
    'title': '学校名称',
    'key': 'schoolName',
    'type': 'input',
    'maxlength': '10'
  },
  {
    'title': '专业',
    'key': 'major',
    'type': 'input',
    'maxlength': '10'
  },
  {
    'title': '学历',
    'key': 'degree',
    'type': 'picker',
  },
  {
    'title': '城市',
    'key': 'city',
    'type': 'region',
  },
  {
    'title': '入学日期',
    'key': 'startDate',
    'type': 'date',
  },
  {
    'title': '毕业日期',
    'key': 'endDate',
    'type': 'date',
  },
  {
    'title': '教育描述',
    'key': 'educationDescription',
    'type': 'textarea',
    'maxlength': '100'
  },
]

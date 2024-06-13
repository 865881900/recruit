import {request} from "./utils";

let enumMap;
export const API = {
  // 退出登录
  logOut(data) {
    return request(`/logOut`, 'GET')
  },
  //用户注册
  signIn(data) {
    return request(`/signIn`, 'POST', data)
  },
  //用户登录
  login(data) {
    return request(`/login`, 'POST', data)
  },

  //用户信息
  getUserinfo() {
    return request(`/getUserinfo`, 'GET')
  },

  //用户信息
  bindingResumeID(data) {
    return request(`/bindingResumeID`, 'POST', data)
  },


  //根据code 获取用户的信息
  getCompaniesByCompanyID(data) {
    return request(`/jobApplication/getCompaniesByCompanyID`, 'GET', data)
  },
  //根据code 获取用户的信息
  async getEnumMap() {
    if (!enumMap) {
      enumMap = await request(`/jobApplication/getEnumMap`, 'POST', {
        tableList: `PoliticalStatusEnum,JobSeekerStatusEnum,EducationRequirementEnum,CompanyTypeEnum,RegionEnum`
      })
    }
    return enumMap;
  },


  //根据code 获取用户的信息
  getResumeByResumeID(data) {
    return request(`/jobApplication/getResumeByResumeID`, 'GET', data)
  },





  //新增简历
  addApplication(data) {
    return request(`/jobApplication/addApplication`, 'POST', data)
  },
  createResume(data) {
    return request(`/jobApplication/createResume`, 'POST', data)
  },

  //修改简历
  updateResume(data) {
    return request(`/jobApplication/updateResume`, 'POST', data)
  },

  // 工作
  getWorkExperienceByExperienceID(data) {
    return request(`/jobApplication/getWorkExperienceByExperienceID`, 'GET', data)
  },

  addWorkExperience(data) {
    return request(`/jobApplication/addWorkExperience`, 'POST', data)
  },

  updateWorkExperience(data) {
    return request(`/jobApplication/updateWorkExperience`, 'POST', data)
  },

  removeWorkExperience(data) {
    return request(`/jobApplication/removeWorkExperience`, 'GET', data)
  },


  // 教育
  getEducationHistoryById(data) {
    return request(`/jobApplication/getEducationHistoryById`, 'GET', data)
  },

  updateEducationHistory(data) {
    return request(`/jobApplication/updateEducationHistory`, 'POST', data)
  },
  addEducationHistory(data) {
    return request(`/jobApplication/addEducationHistory`, 'POST', data)
  },

  removeEducationHistory(data) {
    return request(`/jobApplication/removeEducationHistory`, 'GET', data)
  },


}

import request from '@/utils/request'

export function login(data) {
  return request.post('/login', data)
}

export function getInfo(token) {
  return request({
    url: '/getUserinfo',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/logOut',
    method: 'get'
  })
}

export function getEnumMap() {
  return request({
    url: '/jobApplication/getEnumMap',
    method: 'post',
    data: {
      tableList: 'PoliticalStatusEnum,JobSeekerStatusEnum,EducationRequirementEnum,CompanyTypeEnum,RegionEnum'
    }
  })
}

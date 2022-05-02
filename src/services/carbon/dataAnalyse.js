import request from '@/utils/request'
import { stringify } from 'qs'

export function getIndustryList(params) {
  return request.post('/matrix/common/biz/statistic', {
    body: {
      ...params,
      scenario: 'admin_industry_analysis'
    }
  })
}

export function getCompanyList(params) {
  return request.post('/matrix/common/biz/statistic', {
    body: {
      ...params,
      scenario: 'company_summary2'
    }
  })
}

export function getGreenCompanyList(params) {
  return request.post('/matrix/common/biz/statistic', {
    body: {
      ...params,
      scenario: 'company_green_honour'
    }
  })
}

export function getPointCompanyList(params) {
  return request.post('/matrix/common/biz/statistic', {
    body: {
      ...params,
      scenario: 'company_key_point'
    }
  })
}

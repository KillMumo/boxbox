import request from '@/utils/request'
import { stringify } from 'qs'

// 获取下拉框数据
export function getSelectData(params) {
  return request.post('/matrix/common/biz/statistic', {
    body: {
      ...params,
      scenario: 'data_import_selection'
    }
  })
}

// 下拉框数据，版本2
export function getSelectData2(params) {
  return request.post('/matrix/common/biz/statistic', {
    body: {
      ...params,
      scenario: 'selection2'
    }
  })
}

export function getreportlistdata(params) {
  return request.post('/matrix/common/biz/statistic', {
    body: {
      ...params,
      // energyType: '碳排',
      size:10,
      // scenario: 'carbon_rank_list',
    }
  })
}

export function getpart1(params) {
  return request.post('/matrix/common/biz/handle', {
    body: {
      ...params,
      scenario: 'auth_query_asset'
    }
  })
}

export function getpart2(params) {
  return request.post('/matrix/common/biz/handle', {
    body: {
      ...params,
      scenario: 'auth_carbon_count_month'
    }
  })
}

export function getpart3(params) {
  return request.post('/matrix/common/biz/handle', {
    body: {
      ...params,
      scenario: 'auth_org_carbon_rank'
    }
  })
}

export function getpart4(params) {
  return request.post('/matrix/common/biz/statistic', {
    body: {
      ...params,
      scenario: 'source_scale'
    }
  })
}

export function getUrl(p) {
  return request.get(`/matrix/biz-file/downloadFile?${stringify(p)}`)
}

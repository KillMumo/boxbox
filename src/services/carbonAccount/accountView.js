import request from '@/utils/request'
import { stringify } from 'qs'

export function getCount(params) {
  return request.post('/matrix/common/biz/handle', {
    body: {
      ...params,
      scenario: 'auth_query_asset'
    }
  })
}

export function saveYear(param){
  localStorage.setItem("gailanyear",JSON.stringify(param))
}

export function fetchYear(){
    return JSON.parse(localStorage.getItem('gailanyear') )|| ''
}

export function saveCompanyname(param){
  localStorage.setItem("gailancompany",JSON.stringify(param))
}

export function fetchCompanyname(){
  return JSON.parse(localStorage.getItem('gailancompany') )|| ''
}

// export function getCount(params) {
//   return request.post('/matrix/common/biz/statistic', {
//     body: {
//       ...params,
//       scenario: 'query_asset'
//     }
//   })
// }


export function getselectlist(params) {
  return request.post('/matrix/common/biz/statistic', {
    body: {
      ...params,
      scenario: 'data_import_selection',
    }
  })
}



export function getCOutWaterList(params) {
  return request.post('/matrix/common/biz/handle', {
    body: {
      ...params,
      scenario: 'auth_water_data_list',
      energyType:'碳排'
    }
  })
}

export function getCReduceWaterList2(params) {
  return request.post('/matrix/common/biz/handle', {
    body: {
      ...params,
      scenario: 'auth_water_data_list',
      energyType:'碳减排'
    }
  })
}

export function getCReduceWaterList(params) {
  return request.post('/matrix/common/biz/handle', {
    body: {
      ...params,
      scenario: 'carbon_reduce_water'
    }
  })
}

export function addCarbonConfig(params) {
  return request.post('/matrix/common/form/submit', {
    body: {
      ...params,
      scenario: 'carbon_config_save',
      formKey: 'carbon_config',
      formName: '碳配额'
    }
  })
}

export function getProveWaterList(params) {
  return request.post('/matrix/common/biz/handle', {
    body: {
      ...params,
      scenario: 'exchange_list',
      assetType:'certMgr'
    }
  })
}


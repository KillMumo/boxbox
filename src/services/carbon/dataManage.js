import request from '@/utils/request'
import { stringify } from 'qs'


export function getDataList(params) {
  return request.post('/matrix/common/biz/handle', {
    body: {
      ...params,
      scenario: 'auth_company_summary',
      energyType: '碳全部'
    }
  })
}

// export function getDataList(params) {
//   return request.post('/matrix/common/biz/statistic', {
//     body: {
//       ...params,
//       scenario: 'company_summary',
//       energyType: '碳全部'
//     }
//   })
// }

export function getDataDetail(params) {
  return request.post('/matrix/common/biz/handle', {
    body: {
      ...params,
      scenario: 'company_detail'
    }
  })
}

export function submitData(params) {
  return request.post('/matrix/common/form/submit', {
    body: {
      ...params,
      scenario: 'form_submit'
    }
  })
}

export function uploadFile(file) {
  return request.post('/matrix/common/form/excel', {
    type: 'FILE',
    body: file
  })
}

export function deleteData(params) {
  return request.post('/matrix/common/biz/handle', {
    body: {
      ...params,
      scenario: 'rawToken_del'
    }
  })
}

export function deleteDataall(params) {
  return request.post('/matrix/common/biz/handle', {
    body: {
      ...params,
      scenario: 'delete_data_water'
    }
  })
}

export function dynamicExcel(params) {
  return request.post('/matrix/common/form/dynamicExcel', {
    body: {
      ...params
    }
  })
}

export function dynamicMapExcel(params) {
  return request.post('/matrix/common/form/dynamicExcel', {
    body: {
      ...params
    }
  })
}


export function getWaterList(params) {
  return request.post('/matrix/common/biz/handle', {
    body: {
      ...params,
      scenario: 'auth_water_data_list',
      energyType: '碳排'
    }
  })
}

export function getWaterDetails(params) {
  return request.post('/matrix/common/biz/handle', {
    body: {
      ...params,
      scenario: 'rawToken_details'
    }
  })
}

export function getMethodList(params) {
  return request.post('/matrix/common/form/getList', {
    body: {
      ...params,
      scenario: 'method_list',
      formKey:'methodMgr'
    }
  })
}

export function deleteMethods(params) {
  return request.post('/matrix/common/form/delete', {
    body: {
      ...params,
      scenario: 'form_delete',
    }
  })
}

export function getOrgById(params) {
  return request.post('/matrix/org/getById', {
    body: {
      ...params
    }
  })
}

export function saveshujudata(param){
  localStorage.setItem("shujulistdata",JSON.stringify(param))
}

export function getshujudata(){
    return  JSON.parse(localStorage.getItem('shujulistdata') )|| ''
}

export function savemethoddata(param){
  localStorage.setItem("fangfadata",JSON.stringify(param))
}

export function getmethoddata(){
    return  JSON.parse(localStorage.getItem('fangfadata') )|| ''
}



import request from '@/utils/request'
//新增减排信息
export function addReduction(params) {
  return request.post('/matrix/common/form/submit', {
    body: {
      ...params,
      scenario: 'reduce_add',
      formKey: 'form_reduction',
      formName: '减排信息'
    }
  })
}
//获取列表
export function fetchList(params) {
  return request.post('/matrix/common/form/getList', {
    body: {
      ...params,
      scenario: 'redu_page_list',
      formKey: 'form_reduction'
    }
  })
}
//新增减排信息
export function updateReduction(params) {
  return request.post('/matrix/common/form/update', {
    body: {
      ...params,
      scenario: 'form_update',
      formKey: 'form_reduction',
      formName: '减排信息'
    }
  })
}




//查询详情
export function fetchDetail(params) {
  return request.post('/matrix/common/form/details', {
    body: {
      ...params,
      scenario: 'form_details',
      formKey: 'form_reduction'
    }
  })
}

export  function saveItem(item){
  localStorage.setItem("reductionItem",JSON.stringify(item))
}
export  function getItem(){
 return  JSON.parse(localStorage.getItem('reductionItem') )|| ''
}


export function deleteReduction(params) {
  return request.post('/matrix/common/form/delete', {
    body: {
      ...params,
      scenario: 'form_delete'
    }
  })
}
//存取一行数据
export function saveRow(item) {
  localStorage.setItem('reduction_row', JSON.stringify(item))
  console.log(item)
}
export function fetchRow() {
 return JSON.parse(localStorage.getItem('reduction_row'))||""
}
export function saveNo(bizNo) {
  localStorage.setItem('reduction_bizno', JSON.stringify(bizNo))
}

function getNo() {
 return  localStorage.getItem('reduction_bizno')
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

export function getreducdetail(params) {
  return request.post('/matrix/common/biz/handle', {
    body: {
      ...params,
      scenario: 'carbon_sink_details',
    }
  })
}


export function getSceneList(params) {
  return request.post('/matrix/common/biz/handle', {
    body: {
      ...params,
      scenario: 'scene_list',
    }
  })
}



import request from '@/utils/request'

export function getDeviceList(params) {
  return request.post('/matrix/common/biz/handle', {
    body: {
      ...params,
      scenario: 'assetInfo_list',
      assetType: 'device'
    }
  })
}

//获取减排项目列表
export function fetchProList(params) {
  return request.post('/matrix/common/form/getList', {
    body: {
      ...params,
      scenario: 'reduction_list',
      formKey: 'form_reduction'
    }
  })
}



//添加碳汇信息
export function save(params) {
  return request.post('/matrix/common/biz/handle', {
    body: {
      ...params,
      // scenario: 'rawToken_submit',
      scenario: 'cs_add',
      assetType: 'CarbonSink',
      assetName: '碳汇'
    }
  })
}

export function  setParam(param){
  localStorage.setItem("param",JSON.stringify(param))
}

export function  getParam(){
    return  JSON.parse(localStorage.getItem('param') )|| ''
}

export function getDevice(params) {
  return request.post('/matrix/common/biz/handle', {
    body: {
      ...params,
      scenario: 'device_name_count',
    }
  })
}

export function getDeviceFlow(params) {
  return request.post('/matrix/common/biz/handle', {
    body: {
      ...params,
      scenario: 'device_flow',
    }
  })
}
export function getTotalDeviceFlow(params) {
  return request.post('/matrix/common/biz/handle', {
    body: {
      ...params,
      scenario: 'total_device_flow',
    }
  })
}


//碳汇列表
export function getList(params) {
  return request.post('/matrix/common/form/getList', {
    body: {
      ...params,
      // scenario: 'rawToken_list',
      scenario: 'carbon_sink_list',
      formKey:'carbonSink'
      // assetName:'碳汇',
      // assetType: 'CarbonSink',
      // param:getParam()||''
    }
  })
}
export function getcertList(params) {
  return request.post('/matrix/common/form/getList', {
    body: {
      ...params,
      // scenario: 'rawToken_list',
      scenario: 'carbon_sink_list',
      formKey:'carbonSink',
      'eq&isDeal':0,
      'eq&checkStatus':1
      // assetName:'碳汇',
      // assetType: 'CarbonSink',
      // param:getParam()||''
    }
  })
}

//碳汇列表
export function fetchDetail(params) {
  return request.post('/matrix/common/biz/handle', {
    body: {
      ...params,
      scenario: 'rawToken_details',
      assetName: '碳汇',
      assetType: 'CarbonSink'
    }
  })
}
//定时任务
export function addJob(params) {
  return request.post('/matrix/job/add', {
    body: {
      ...params,
    }
  })
}
//获取组织机构id
export function getOrgId(params) {
  return request.post('/matrix/common/biz/handle', {
    body: {
      ...params,
      scenario: 'org_id',
    }
  })
}


export function saveduihuan(param){
  localStorage.setItem("duihuanzhengming",JSON.stringify(param))
}

export function fetchduihuan(){
    return JSON.parse(localStorage.getItem('duihuanzhengming') )|| ''
}

export function fetchcarbonItem(){
    return JSON.parse(localStorage.getItem('carbonItem') )|| ''
}

export function getMonthList(params) {
  return request.post('/matrix/common/biz/handle', {
    body: {
      ...params,
      scenario: 'get_month_list',
    }
  })
}

export function addSink(params) {
  return request.post('/matrix/common/biz/handle', {
    body: {
      ...params,
      scenario: 'carbon_sink_add',
    }
  })
}

export function gettabledata(params) {
  return request.post('/matrix/common/biz/handle', {
    body: {
      ...params,
      scenario: 'carbon_sink_water',
    }
  })
}

//通过 or  驳回
export function handleOperation(params) {
  return request.post('/matrix/common/form/update', {
    body: {
      ...params,
      scenario: 'check_carbon',
    }
  })
}

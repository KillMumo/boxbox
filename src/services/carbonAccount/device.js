import request from '@/utils/request'
import { stringify } from 'qs'

export function getList(params) {
  return request.post('/matrix/common/biz/handle', {
    body: {
      ...params,
      scenario: 'device_list',
      assetType: 'device'
    }
  })
}

export function getLoglist(params) {
  return request.post('/matrix/common/form/getList', {
    body: {
      ...params,
      scenario: 'form_list',
      formKey:"import_log"
    }
  })
}

export function addDevice(params) {
  return request.post('/matrix/common/biz/handle', {
    body: {
      ...params,
      scenario: 'device_submit',
      assetType: 'device',
      assetName: '碳设备'
    }
  })
}

export function updateDevice(params) {
  return request.post('/matrix/common/biz/handle', {
    body: {
      ...params,
      scenario: 'assetInfo_update'
    }
  })
}


export function deleteDevice(params) {
  return request.post('/matrix/common/biz/handle', {
    body: {
      ...params,
      scenario: 'assetInfo_del'
    }
  })
}

export function detailsDevice(params) {
  return request.post('/matrix/common/biz/handle', {
    body: {
      ...params,
      scenario: 'assetInfo_details'
    }
  })
}


export function waterList(params) {
  return request.post('/matrix/common/biz/handle', {
    body: {
      ...params,
      scenario: 'assetRawData_list',
      assetType:'设备流水'
    }
  })
}

export function saveDevice(no) {
  localStorage.setItem('devicexx', JSON.stringify(no))
}


export function getCacheDevice() {
  return JSON.parse(localStorage.getItem('devicexx') || '""')
}

export function addMethods(params) {
  return request.post('/matrix/common/form/submit', {
    body: {
      ...params,
      scenario: 'method_add',
      formKey:'methodMgr',
      formName:'方法学管理'
    }
  })
}

export function editMethods(params) {
  return request.post('/matrix/common/form/update', {
    body: {
      ...params,
      scenario: 'form_update',
      // formKey:'methodMgr',
      // formName:'方法学管理'
    }
  })
}


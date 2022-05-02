import request from '@/utils/request'

export function getCertInfo(params) {
  return request.post('/matrix/common/biz/handle', {
    body: {
      ...params,
      scenario: 'cert_list'
    }
  })
}

export function getcount(params) {
  return request.post('/matrix/common/biz/handle', {
    body: {
      ...params,
      scenario: 'cert_count',
    }
  })
}

export function fetchList(params) {
  return request.post('/matrix/common/biz/handle', {
    body: {
      ...params,
      scenario: 'exchange_list',
      // assetName: '兑换记录',
      assetType: 'certMgr'
    }
  })
}

export function addCertInfo(params) {
  return request.post('/matrix/common/biz/handle', {
    body: {
      ...params,
      scenario: 'exchange_submit',
      assetName:'兑换记录',
      assetType:'兑换记录'
    }
  })
}

export function getItem(){
  return JSON.parse(localStorage.getItem('item'))
}

// 兑换
export function exchange(params){
  return request.post('/matrix/common/biz/handle', {
    body: {
      ...params,
      scenario: 'cert_add',
      assetName:'兑换记录',
      assetType:'兑换记录'
    }
  })
}

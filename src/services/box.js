import request from '@/utils/request'
import { stringify } from 'qs'

// 
export function getList(params) {
  return request.post('/matrix/moqie/list', {
    body: params
  })
}

export function addBox(params) {
  return request.post('/matrix/moqie/add', {
    body: params
  })
}

export function saveshuju(params) {
  localStorage.setItem("boxshuju",JSON.stringify(params))
}

export function getshuju() {
  return  JSON.parse(localStorage.getItem('boxshuju') )|| ''
}
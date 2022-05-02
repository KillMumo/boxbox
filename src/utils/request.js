import request, { ResponseError } from '@dragon/request'
import router from 'umi/router'
import { fetchToken, removeToken, saveToken } from '@/common/token'
import { Modal, Icon } from 'antd'
import React from 'react'

const logout = () => {
  removeToken()
  // 回登录页面再清空store数据
  window.g_app._store.dispatch({
    type: 'USER_LOGOUT'
  })
  router.replace('/user/login')
}

const waring = (function() {
  let isShow = false
  return function(option) {
    if (!isShow) {
      isShow = true
      Modal.warning({
        ...option,
        onOk: () => {
          option.onOk()
          isShow = false
        }
      })
    }
  }
})()

const confirm = (function() {
  let isShow = false
  return function(option) {
    if (!isShow) {
      isShow = true
      Modal.confirm({
        ...option,
        icon: <Icon type="exclamation-circle" />,
        onOk: () => {
          option.onOk()
          isShow = false
        },
        onCancel: () => {
          isShow = false
        }
      })
    }
  }
})()

const configuredRequest = request(
  {
    credentials: 'include',
    type: 'JSON',
    method: 'get', // 直接调用使用get方法
    throw: true, // 抛出异常时是否提示弹框
    enableInterceptors: false, // 是否使用拦截器
    timeout: 120000, // 超时时间
    errorHandler: (code, res) => {
      if (code === 500 || code === 502) {
        router.replace('/exception/500')
      }
    }
  },
  // 输入token的键与值
  ['Authorization', () => fetchToken(), saveToken]
)

// 注入业务代码
configuredRequest.injectBusinessHandler([
  {
    code: 20000,
    // throw: true, 可对单个接口设置（抛出异常时是否提示弹框）
    action: () => {}
  },
  {
    code: [40000, 40007, 40008, 40010],
    action: (data) => {
      logout()
      throw new ResponseError(data.message, data)
    }
  },
  {
    code: 40015,
    throw: false,
    action: (data) => {
      waring({
        title: '下线通知',
        content: data.message,
        onOk: () => logout()
      })
      throw new ResponseError(data.message, data)
    }
  },
  {
    code: 40009,
    throw: false,
    action: (data) => {
      waring({
        title: '温馨提示',
        content: data.message,
        onOk: () => logout()
      })
      throw new ResponseError(data.message, data)
    }
  },
  {
    code: 40016,
    throw: false,
    action: (data) => {
      // 字符串转化为Object
      const obj = JSON.parse(data?.message)
      console.log(obj)
      confirm({
        title: '企业已存在，请直接登录',
        content: (
          <div>
            <div>如需开通此平台请联系企业默认管理员：</div>
            <div>
              {obj?.adminName}（{obj?.adminPhone}）。
            </div>
            {obj?.tpList && (
              <div style={{ marginTop: 10 }}>
                <div style={{ color: 'rgba(0,0,0,0.45)', fontSize: 12 }}>已开通如下平台：</div>
                {obj?.tpList?.map((value) => (
                  <div>{value.tpName}</div>
                ))}
              </div>
            )}
          </div>
        ),
        onOk: () => logout()
      })
      throw new ResponseError(data.message, data)
    }
  }
])

// // 设置全局loading
// const interceptors = (function() {
//   let div = null
//   let count = 0
//   return {
//     request: () => {
//       count = count + 1
//       if (!div) {
//         div = document.createElement('div')
//         document.body.appendChild(div)
//         ReactDOM.render(<Loading loading={true} />, div)
//       }
//     },
//     response: () => {
//       count = count - 1
//       if (count === 0) {
//         const unmountResult = ReactDOM.unmountComponentAtNode(div)
//         if (unmountResult) {
//           div.parentNode.removeChild(div)
//           div = null
//         }
//       }
//     }
//   }
// })()
// configuredRequest.interceptors.request(interceptors.request)
// configuredRequest.interceptors.response(interceptors.response)

export default configuredRequest

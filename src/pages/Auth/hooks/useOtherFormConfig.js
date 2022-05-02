import React from 'react'
import Upload from '@/components/Upload'
import WarnTip from '@/components/WarnTip'
import { Checkbox } from 'antd'
import { fetchToken } from '@/common/token'
import { validateFiles } from '@/utils/fieldValidator'

const uploadAccept = 'jpg,jpeg,png'

const validator = (r, v, cb) => {
  if (v === true) {
    cb()
  } else {
    cb('请阅读并同意《认证用户服务协议》')
  }
}

const useFormConfig = (form, data = {}) => {
  return [
    {
      itemProps: {
        label: '营业执照复印件',
        extra: WarnTip('请加盖公章后上传')
      },
      validateTrigger: 'onChange',
      rules: [{ required: true, message: '请上传营业执照复印件' }, { validator: validateFiles }],
      name: 'socialCreditCodeUrl',
      children: <Upload accept={uploadAccept} />
    },
    {
      itemProps: {
        label: '法人身份证复印件',
        extra: WarnTip('请上传加盖公章的身份证正反面复印件')
      },
      validateTrigger: 'onChange',
      rules: [{ required: false, message: '请上传法人身份证复印件' }, { validator: validateFiles }],
      name: 'legalPersonIdCardUrl',
      children: <Upload accept={uploadAccept} length={2} />
    },
    {
      itemProps: {
        label: '管理员身份证复印件',
        extra: WarnTip('请上传加盖公章的身份证正反面复印件')
      },
      rules: [
        { required: true, message: '请上传管理员身份证复印件' },
        { validator: validateFiles }
      ],
      validateTrigger: 'onChange',
      name: 'orgAdminIdCardUrl',
      children: <Upload accept={uploadAccept} length={2} />
    },
    {
      itemProps: { wrapperCol: { offset: 5 } },
      name: 'isAgree',
      rules: [{ validator }],
      validateTrigger: 'onChange',
      valuePropName: 'checked',
      children: (
        <div>
          <Checkbox />
          &nbsp;&nbsp;请阅读并同意
          <a
            href={`/matrix/agreement/registration?token=${fetchToken()}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            《认证用户服务协议》
          </a>
        </div>
      )
    }
  ]
}

export default useFormConfig

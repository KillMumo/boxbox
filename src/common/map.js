// 企业认证状态
export const CompanyStatus = format({
  '1': '已审核',
  '2': '未认证',
  '3': '待审核',
  '4': '已驳回'
})

// 企业相对关系
export const CompanyTypeRelative = format({
  CORE: '核心企业',
  MEMBER: '成员企业',
  SUPPLY: '供应链企业'
})

export const LimitStatus = format({
  '0': '待生效',
  '1': '已生效',
  '-1': '已驳回',
  '-2': '已冻结'
})

// 事项状态
export const EventStatus = format({
  '-1': '驳回',
  '0': '进行中',
  '1': '已完成'
})

// 格式化map和enum
function format(obj) {
  const mapRes = {}
  const enumRes = {}
  Object.entries(obj).forEach(([code, desc]) => {
    mapRes[code] = desc
    enumRes[desc] = code
  })
  return {
    map: mapRes,
    enum: enumRes
  }
}

// 模拟股权穿透数据
export const graphData = {
  name: 'Modeling Methods',
  children: [
    {
      name: 'Models diversity',
      children: [
        { name: 'Different modeling methods' },
        { name: 'Different training sets' },
        { name: 'Different feature sets' }
      ]
    },
    {
      name: '经销商',
      children: [{ name: 'Classifier selection' }, { name: 'Classifier fusion' }]
    },
    {
      name: '供应商',
      children: [{ name: 'Bagging' }, { name: 'Boosting' }, { name: 'AdaBoost' }]
    },
    {
      name: '测试',
      children: [{ name: 'Bagging' }, { name: 'Boosting' }, { name: 'AdaBoost' }]
    },
    {
      name: '1111111',
      children: [{ name: 'Bagging' }, { name: 'Boosting' }, { name: 'AdaBoost' }]
    }
  ]
}

// 企业&自然人搜索链接(天眼查)
export const searchUrl = {
  human: 'https://www.tianyancha.com/humansearch/',
  company: 'https://www.tianyancha.com/search?key='
}

export const dataList = [
  { label: '农业银行农业银行农业银行', companyAmount: 2800, companyNum: 212 },
  { label: '建设银行建设银行', companyAmount: 1800, companyNum: 389 },
  { label: '但是返回俩施工方爬上度过', companyAmount: 1950, companyNum: 509 },
  { label: '司法独立开关哈都放假啦就发觉', companyAmount: 1500, companyNum: 198 },
  { label: '到家佛撒就跟i啊哦积分高级撒回复大法师', companyAmount: 2170, companyNum: 123 },
  { label: '都会发胖会更怕任何噶人发工地干活', companyAmount: 1790, companyNum: 453 },
  { label: '1但撒拆速度和狗爱速滑噶回到宿舍的时光', companyAmount: 1070, companyNum: 73 },
  { label: '2带来丰厚啊u化工爱u和深入搞好娃u发的哈', companyAmount: 170, companyNum: 193 },
  { label: '3丹佛哈佛i啊hi', companyAmount: 1270, companyNum: 321 },
  { label: '4的发和iashdifpgahgia大福大吼啊', companyAmount: 1970, companyNum: 238 },
  { label: '5大还是分开后啊大海u哈嘎斯u个', companyAmount: 1234, companyNum: 230 },
  { label: '6农业银行农业银行农业银行', companyAmount: 2800, companyNum: 212 },
  { label: '7建设银行建设银行建设银行建设银行建设银行', companyAmount: 1800, companyNum: 389 },
  { label: '8但是返回俩施工方爬上度过', companyAmount: 1950, companyNum: 509 },
  { label: '9司法独立开关哈都放假啦就发觉', companyAmount: 1500, companyNum: 198 },
  { label: '10到家佛撒就跟i啊哦积分高级撒回复大法师', companyAmount: 2170, companyNum: 123 },
  { label: '11都会发胖会更怕任何噶人发工地干活', companyAmount: 1790, companyNum: 453 },
  { label: '12但撒拆速度和狗爱速滑噶回到宿舍的时光', companyAmount: 1070, companyNum: 73 },
  { label: '13带来丰厚啊u化工爱u和深入搞好娃u发的哈', companyAmount: 170, companyNum: 193 }
  // { label: '丹佛哈佛i啊hi', companyAmount: 1270, companyNum: 321 },
  // { label: '的发和iashdifpgahgia大福大吼啊', companyAmount: 1970, companyNum: 238 },
  // { label: '大还是分开后啊大海u哈嘎斯u个', companyAmount: 1234, companyNum: 230 }
]

//邀请码和认证路由对应关系
export const authMap = {
  c4FnhQp3: '/msAuth' //海曙
}

// 邀请码和修改认证信息路由对应关系
export const authEditMap = {
  c4FnhQp3: '/msAuth/edit' //海曙
}

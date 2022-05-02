// 业务员融资状态
export const financeStatus = {
  已暂存: { name: '已暂存', color: 'blue' },
  待业务员审批: { name: '待业务员审批', color: 'gold' },
  待风控审批: { name: '待风控审批', color: 'gold' },
  待总经理审批: { name: '待总经理审批', color: 'gold' },
  待委员会审批: { name: '待委员会审批', color: 'gold' },
  待业务员提交: { name: '待业务员提交', color: 'gold' },
  待企业提交: { name: '待企业提交', color: 'gold' },
  待放款: { name: '待放款', color: 'green' },
  待还款: { name: '待还款', color: 'blue' },
  逾期未还清: { name: '逾期未还清', color: 'red' },
  逾期已还清: { name: '逾期已还清', color: 'green' },
  已还清: { name: '已还清', color: 'green' }
}

// 预警因子
export const warning = {
  高: { name: '高', color: 'red' },
  中: { name: '中', color: 'blue' },
  低: { name: '低', color: 'green' }
}

// 企业融资状态
export const companyFinanceStatus = {
  已暂存: { name: '已暂存', color: 'blue' },
  待审批: { name: '待审批', color: 'gold' },
  待企业提交: { name: '待企业提交', color: 'gold' },
  待放款: { name: '待放款', color: 'green' },
  待还款: { name: '待还款', color: 'blue' },
  逾期未还清: { name: '逾期未还清', color: 'red' },
  逾期已还清: { name: '逾期已还清', color: 'green' },
  已还清: { name: '已还清', color: 'green' }
}

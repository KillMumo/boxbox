export default [
  {
    children: [
      {
        children: [
          {
            children: null,
            code: 'A0402',
            hasEmpty: false,
            level: 2,
            name: '受理金票融资申请',
            own: true,
            parentCode: 'A04',
            seq: 4,
            url: ''
          },
          {
            children: null,
            code: 'A0404',
            hasEmpty: false,
            level: 2,
            name: '确认收缴金票融资费用',
            own: true,
            parentCode: 'A04',
            seq: 5,
            url: ''
          },
          {
            children: null,
            code: 'A0405',
            hasEmpty: false,
            level: 2,
            name: '金票融资放款',
            own: true,
            parentCode: 'A04',
            seq: 6,
            url: ''
          }
        ],
        code: 'A04',
        hasEmpty: false,
        level: 1,
        name: '金票融资',
        own: true,
        parentCode: 'A',
        seq: 2,
        url: '/bill/imprest'
      },
      {
        children: [
          {
            children: null,
            code: 'A0701',
            hasEmpty: false,
            level: 2,
            name: '原单回款',
            own: true,
            parentCode: 'A07',
            seq: 1,
            url: ''
          }
        ],
        code: 'A07',
        hasEmpty: false,
        level: 1,
        name: '原单托收',
        own: true,
        parentCode: 'A',
        seq: 4,
        url: '/bill/master_collection'
      },
      {
        children: [
          {
            children: null,
            code: 'A0802',
            hasEmpty: false,
            level: 2,
            name: '子单兑付',
            own: true,
            parentCode: 'A08',
            seq: 2,
            url: ''
          }
        ],
        code: 'A08',
        hasEmpty: false,
        level: 1,
        name: '子单托收',
        own: true,
        parentCode: 'A',
        seq: 5,
        url: '/bill/sub_collection'
      },
      {
        children: [
          {
            children: null,
            code: 'A0601',
            hasEmpty: false,
            level: 2,
            name: '发起再融资',
            own: true,
            parentCode: 'A06',
            seq: 1,
            url: ''
          },
          {
            children: null,
            code: 'A0602',
            hasEmpty: false,
            level: 2,
            name: '受理再融资',
            own: true,
            parentCode: 'A06',
            seq: 2,
            url: ''
          }
        ],
        code: 'A06',
        hasEmpty: false,
        level: 1,
        name: '金票再融资',
        own: true,
        parentCode: 'A',
        seq: 6,
        url: '/bill/refinance'
      },
      {
        children: null,
        code: 'A01',
        hasEmpty: false,
        level: 1,
        name: '金票查询',
        own: true,
        parentCode: 'A',
        seq: 7,
        url: '/bill/query'
      }
    ],
    code: 'A',
    hasEmpty: false,
    level: 0,
    name: '金票业务',
    own: true,
    parentCode: null,
    seq: 1,
    url: 'bill'
  },
  {
    children: [
      {
        children: [
          {
            children: null,
            code: 'A0204',
            hasEmpty: false,
            level: 2,
            name: '开票复审',
            own: true,
            parentCode: 'D05',
            seq: 3,
            url: ''
          }
        ],
        code: 'D05',
        hasEmpty: false,
        level: 1,
        name: '开票复审',
        own: true,
        parentCode: 'D',
        seq: 3,
        url: '/todo/issue'
      }
    ],
    code: 'D',
    hasEmpty: false,
    level: 0,
    name: '待办事项',
    own: true,
    parentCode: null,
    seq: 2,
    url: 'todo'
  },
  {
    children: [
      {
        children: null,
        code: 'J02',
        hasEmpty: false,
        level: 1,
        name: '收费',
        own: true,
        parentCode: 'J',
        seq: 1,
        url: '/fee/receive'
      }
    ],
    code: 'J',
    hasEmpty: false,
    level: 0,
    name: '费用管理',
    own: true,
    parentCode: null,
    seq: 3,
    url: 'fee'
  },
  {
    children: [
      {
        children: [
          {
            children: null,
            code: 'B0101',
            hasEmpty: false,
            level: 2,
            name: '额度设置',
            own: true,
            parentCode: 'B01',
            seq: 1,
            url: '/limit/setting/member'
          },
          {
            children: null,
            code: 'B0102',
            hasEmpty: false,
            level: 2,
            name: '额度冻结',
            own: true,
            parentCode: 'B01',
            seq: 2,
            url: ''
          }
        ],
        code: 'B01',
        hasEmpty: false,
        level: 1,
        name: '额度设置',
        own: true,
        parentCode: 'B',
        seq: 1,
        url: '/limit/setting'
      },
      {
        children: null,
        code: 'B03',
        hasEmpty: false,
        level: 1,
        name: '额度查询',
        own: true,
        parentCode: 'B',
        seq: 3,
        url: '/limit/search'
      }
    ],
    code: 'B',
    hasEmpty: false,
    level: 0,
    name: '额度管理',
    own: true,
    parentCode: null,
    seq: 4,
    url: 'limit'
  },
  {
    children: [
      {
        children: null,
        code: 'K01',
        hasEmpty: false,
        level: 1,
        name: '业务流水',
        own: true,
        parentCode: 'K',
        seq: 1,
        url: '/history/business'
      },
      {
        children: null,
        code: 'K02',
        hasEmpty: false,
        level: 1,
        name: '操作流水',
        own: true,
        parentCode: 'K',
        seq: 2,
        url: '/history/operation'
      },
      {
        children: null,
        code: 'K03',
        hasEmpty: false,
        level: 1,
        name: '费用流水',
        own: true,
        parentCode: 'K',
        seq: 3,
        url: '/history/fee'
      }
    ],
    code: 'K',
    hasEmpty: false,
    level: 0,
    name: '历史流水',
    own: true,
    parentCode: null,
    seq: 5,
    url: 'history'
  },
  {
    children: [
      {
        children: [
          {
            children: null,
            code: 'Z0201',
            hasEmpty: false,
            level: 2,
            name: '操作员操作银行账户',
            own: true,
            parentCode: 'C02',
            seq: 2,
            url: ''
          }
        ],
        code: 'C02',
        hasEmpty: false,
        level: 1,
        name: '银行账户',
        own: true,
        parentCode: 'C',
        seq: 2,
        url: '/product/bank'
      },
      {
        children: [
          {
            children: null,
            code: 'Z0701',
            hasEmpty: false,
            level: 2,
            name: '操作员查看电子签章',
            own: true,
            parentCode: 'C07',
            seq: 2,
            url: ''
          }
        ],
        code: 'C07',
        hasEmpty: false,
        level: 1,
        name: '电子签章',
        own: true,
        parentCode: 'C',
        seq: 7,
        url: '/product/anxinSign'
      }
    ],
    code: 'C',
    hasEmpty: false,
    level: 0,
    name: '用户中心',
    own: true,
    parentCode: null,
    seq: 6,
    url: 'product'
  },
  {
    children: [
      {
        children: null,
        code: 'H01',
        hasEmpty: false,
        level: 1,
        name: '数据总览',
        own: true,
        parentCode: 'H',
        seq: 1,
        url: '/blockchain/summary'
      },
      {
        children: null,
        code: 'H02',
        hasEmpty: false,
        level: 1,
        name: '区块列表',
        own: true,
        parentCode: 'H',
        seq: 2,
        url: '/blockchain/block'
      },
      {
        children: null,
        code: 'H03',
        hasEmpty: false,
        level: 1,
        name: '交易列表',
        own: true,
        parentCode: 'H',
        seq: 3,
        url: '/blockchain/trade'
      },
      {
        children: null,
        code: 'H04',
        hasEmpty: false,
        level: 1,
        name: '金票列表',
        own: true,
        parentCode: 'H',
        seq: 4,
        url: '/blockchain/bill'
      }
    ],
    code: 'H',
    hasEmpty: false,
    level: 0,
    name: '链上信息',
    own: true,
    parentCode: null,
    seq: 7,
    url: 'blockchain'
  }
]

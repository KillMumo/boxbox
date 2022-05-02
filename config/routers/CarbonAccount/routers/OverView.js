export default {
  path: '/overview',
  routes: [
    {
      path: '/overview',
      routes: [
        {
          path: '/overview',
          name: '账户概览',
          exact: true,
          component: './CarbonAccount/Overview/AssetCount.js'
        },
        { path: '/overview/co2EmissionsList', exact: true, name: '碳排放流水', component: './CarbonAccount/Overview/Co2EmissionsWaterList.js' },
        { path: '/overview/list', exact: true, name: '购入减排证明流水', component: './CarbonAccount/Overview/List.js' },
        { path: '/overview/carbonReduceList', exact: true, name: '碳减排流水', component: './CarbonAccount/Overview/CarbonReduceWaterList.js' },
        { path: '/overview/greenCornProveWaterList', exact: true, name: '绿币证明流水', component: './CarbonAccount/Overview/GreenCornProveWaterList.js' },
        { path: '/overview/carbonNeutralWaterList', exact: true, name: '碳中和证明流水', component: './CarbonAccount/Overview/CarbonNeutralWaterList.js' },
        { path: '/overview/reduceProveWaterList', exact: true, name: '减排证明流水', component: './CarbonAccount/Overview/ReduceProveWaterList.js' },
        { path: '/overview/count', exact: true, name: '账户概览', component: './CarbonAccount/Overview/AssetCount.js' }
      ]
    }
  ]
}


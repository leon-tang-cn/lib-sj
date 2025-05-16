export function getMenus() {
  const menus = [
    {
      id: 1,
      name: "auditModels",
      meta: {
        menuName: "审计模型",
        icon: "models"
      },
      children: [
        {
          id: 11,
          name: "saftyFoundingAudit",
          path: "/saftyFoundingAudit",
          meta: {
            menuName: "安全生产经费计提"
          }
        },
        {
          id: 12,
          name: "illegalFundsHandling",
          path: "/illegalFundsHandling",
          meta: {
            menuName: "违规资金操作"
          }
        },
        {
          id: 13,
          name: "fictitiousProjIncome",
          path: "/fictitiousProjIncome",
          meta: {
            menuName: "虚增项目营业收入"
          }
        },
        {
          id: 14,
          name: "unpaidFiveAssetTax",
          path: "/unpaidFiveAssetTax",
          meta: {
            menuName: "五类资产应纳未纳"
          }
        },
        {
          id: 15,
          name: "depositProvCheck",
          path: "/depositProvCheck",
          meta: {
            menuName: "质保金计提核查"
          }
        }
      ]
    },
    {
      id: 98,
      name: "dataCollections",
      meta: {
        menuName: "数据抓取",
        icon: "spyder"
      },
      children: [
        {
          id: 981,
          name: "spyderPcajxxExecute",
          path: "/spyderPcajxxExecute",
          meta: {
            menuName: "企业破产重整案件"
          }
        },
        {
          id: 982,
          name: "spyderPcajxxParam",
          path: "/spyderPcajxxParam",
          meta: {
            menuName: "目标单位"
          }
        }
      ]
    },
    {
      id: 99,
      name: "configCenter",
      meta: {
        menuName: "配置中心",
        icon: "params"
      },
      children: [
        {
          id: 991,
          name: "pjParam",
          path: "/pjParam",
          meta: {
            menuName: "项目参数"
          }
        },
        {
          id: 992,
          name: "commonParam",
          path: "/commonParam",
          meta: {
            menuName: "公共参数"
          }
        }
      ]
    }
  ]
  return menus;
}
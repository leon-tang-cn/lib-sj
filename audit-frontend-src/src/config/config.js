import pjParams from '@/config/modules/pjParams.js';
import commonParams from '@/config/modules/commonParams.js';
import saftyProdExpense from '@/config/modules/saftyProdExpense.js';
import illegalFundsHandling from '@/config/modules/illegalFundsHandling.js';
import fictitiousPjIncome from '@/config/modules/fictitiousPjIncome.js';
import unpaidAssetTax from '@/config/modules/unpaidAssetTax.js';
import depositProvCheck from '@/config/modules/depositProvCheck.js';
import spyderPcaj from '@/config/modules/spyderPcaj.js';
import spyderCompany from '@/config/modules/spyderCompany.js';

export function getConfigs(moduleName) {

  const configs = {
    // 项目参数
    pjParams,
    // 公共参数
    commonParams,
    // 安全生产经费
    saftyProdExpense,
    // 违规资金操作
    illegalFundsHandling,
    // 虚增项目营业收入
    fictitiousPjIncome,
    // 未纳长账龄工程债权
    unpaidAssetTax,
    // 质保金计提
    depositProvCheck,
    // 数据抽取
    spyderPcaj,
    // 数据抽取目标单位
    spyderCompany
  };

  return configs[moduleName]
}
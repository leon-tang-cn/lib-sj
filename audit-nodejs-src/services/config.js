const pjParams = require("./configs/pjParams");
const commonParams = require("./configs/commonParams");
const saftyProdExpense = require("./configs/saftyProdExpense");
const illegalFundsHandling = require("./configs/illegalFundsHandling");
const fictitiousPjIncome = require("./configs/fictitiousPjIncome");
const unpaidAssetTax = require("./configs/unpaidAssetTax");
const depositProvCheck = require("./configs/depositProvCheck");
const spyderPcaj = require("./configs/spyderPcaj");
const spyderCompany = require("./configs/spyderCompany");


const config = {
  pjParams,
  commonParams,
  saftyProdExpense,
  illegalFundsHandling,
  fictitiousPjIncome,
  unpaidAssetTax,
  depositProvCheck,
  spyderPcaj,
  spyderCompany
};

module.exports = config;
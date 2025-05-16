const dataOperators = {
  "REGEXP_EXTRACT": (text, pattern, groupIndex) => {
    if (!text || !pattern) {
      return 0;
    }
    const match = text.match(new RegExp(pattern));
    if (match && match.length > groupIndex) {
      return match[groupIndex];
    }
    return 0;
  }
}

const createWhereClause = (queryConfig, reqQuery) => {
  let whereClauses = "";
  let queryExpressList = [];
  if (queryConfig.params && queryConfig.params.length > 0) {
    for (var i = 0; i < queryConfig.params.length; i++) {
      let paramValue = reqQuery[queryConfig.params[i].paramName] || "";
      if (paramValue) {
        let queryExpress = whereExpressDecorator(queryConfig.params[i], paramValue);
        queryExpressList.push(`${queryConfig.params[i].name} ${queryExpress}`);
      }
    }
    if (queryExpressList.length > 0) {
      whereClauses = `${queryExpressList.join(" AND ")}`;
    }
  }
  return whereClauses;
}

const whereExpressDecorator = (queryConfig, paramValue) => {
  if (queryConfig.logic === "LIKE") {
    return `LIKE '%${paramValue}%'`;
  }
  if (queryConfig.logic === "LLIKE") {
    return `LIKE '%${paramValue}'`;
  }
  if (queryConfig.logic === "RLIKE") {
    return `LIKE '${paramValue}'`;
  }
  return `= '${paramValue}'`;
}

const formatExcel = (ws, configs) => {
  if (!configs || configs.length === 0) {
   return ws; 
  }
  if (!ws["!cols"]) {
    ws["!cols"] = [];
  }
  for (var n = 0; n < configs.length; n++) {
    if (!ws["!cols"][n]) {
      ws["!cols"][n] = { wch: configs[n].width };
    }
  }
  return ws;
}

module.exports = {
  dataOperators,
  createWhereClause,
  formatExcel
};
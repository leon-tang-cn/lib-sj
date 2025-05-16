function formatNumber(num) {
  const parts = num.toString().split('.');
  let integerPart = parts[0];
  const decimalPart = parts[1] ? '.' + parts[1] : '';

  return Number(integerPart).toLocaleString() + decimalPart;
}

export function converExcelData(data, ignoreDataKeyWhenEmpty) {
  const allData = [];
  var headerArr = Object.keys(data[0]);

  const headers = headerArr.map(header => header.toString().replace(/\s/g, ''));
  data.map(row => {
    if (ignoreDataKeyWhenEmpty && (!row[ignoreDataKeyWhenEmpty] || row[ignoreDataKeyWhenEmpty] === '')) {
      return; // 忽略空值的行
    }
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[headerArr[index]];
    });
    allData.push(obj);
  });
  return allData;
};

export function cellFormatter(row, column, cellValue) {
  if (cellValue === null || cellValue === undefined) {
    return ''; // 处理 null 和 undefined 的情况
  }
  const numVal = Number(cellValue);
  if (isNaN(numVal)) {
    return cellValue.toLocaleString(); // 如果不是数字，则返回原始值
  } else {
    return formatNumber(numVal);
  }
}

export function voidFormatter(row, column, cellValue) {
  return cellValue;
}

export function percentageFormatter(row, column, cellValue) {
  if (cellValue === null || cellValue === undefined) {
    return ''; // 处理 null 和 undefined 的情况
  }
  const formattedValue = (Math.round(cellValue * 100 * 100) / 100) + '%';
  return formattedValue;
}

export function dateFormatter(row, column, cellValue) {
  if (cellValue === null || cellValue === undefined) {
    return ''; // 处理 null 和 undefined 的情况
  }
  if (typeof cellValue === 'string' && /^\d{8}$/.test(cellValue)) {
    const year = cellValue.substring(0, 4);
    const month = cellValue.substring(4, 6);
    const day = cellValue.substring(6, 8);
    return `${year}-${month}-${day}`;
  } else {
    const dateVal = new Date(cellValue);
    if (dateVal instanceof Date && !isNaN(dateVal)) {
      return dateVal.toLocaleDateString();
    }
  }
  return cellValue;
}
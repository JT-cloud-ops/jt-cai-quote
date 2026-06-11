/**
 * 格式化數字為千分位字串
 */
export const formatCurrency = (num: number): string => {
  return num > 0 ? num.toLocaleString() : '';
};

/**
 * 格式化數字為千分位字串（保留 0 或空）
 */
export const formatNumber = (num: number | string): string => {
  const n = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(n)) return '';
  return n.toLocaleString();
};

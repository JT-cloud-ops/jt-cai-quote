import type { QuotationData } from '../types';

export interface QuotationTotals {
  totalSubtotal: number;
  totalTax: number;
  grandTotal: number;
}

export interface LayoutScales {
  layoutScale: number;
  lineScale: number;
  rowScale: number;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/**
 * 計算報價單合計、稅額與總計
 */
export const calculateTotals = (data: QuotationData): QuotationTotals => {
  let totalSubtotal = 0;
  let totalTax = 0;
  let grandTotal = 0;

  if (data.quotationType === 'single') {
    data.items.forEach(item => {
      const qty = parseFloat(item.quantity) || 0;
      const price = parseFloat(item.unitPrice) || 0;
      const itemAmount = item.manualAmount ? (parseFloat(item.manualAmount) || 0) : Math.round(qty * price);
      
      if (item.taxType === 'include') {
        const itemTotal = itemAmount;
        const itemSub = Math.round(itemTotal / 1.05);
        const itemTax = itemTotal - itemSub;
        totalSubtotal += itemSub;
        totalTax += itemTax;
        grandTotal += itemTotal;
      } else {
        const itemSub = itemAmount;
        const itemTax = Math.round(itemSub * 0.05);
        totalSubtotal += itemSub;
        totalTax += itemTax;
        grandTotal += (itemSub + itemTax);
      }
    });
  } else {
    data.bookletJobs.forEach(job => {
      const qty = parseFloat(job.quantity) || 0;
      const price = parseFloat(job.unitPrice) || 0;
      const itemSub = Math.round(qty * price);
      const itemTax = Math.round(itemSub * 0.05);
      totalSubtotal += itemSub;
      totalTax += itemTax;
      grandTotal += (itemSub + itemTax);
    });
  }

  return { totalSubtotal, totalTax, grandTotal };
};

/**
 * 計算版面密度分數，用於決定 A4 列印時的縮放比例
 */
export const calculateDensityScore = (data: QuotationData): number => {
  const textLength = (value?: string) => (value?.trim().length ?? 0);
  
  const getCurrentRowCount = () => {
    if (data.quotationType === 'single') return data.items.length;
    if (data.quotationType === 'booklet' || data.quotationType === 'dept') {
      return data.bookletJobs.reduce((count, job) => {
        const hasHQ = data.quotationType === 'dept' && job.hqQuantity;
        return count + 1 + job.parts.length + (hasHQ ? 1 : 0);
      }, 0);
    }
    return 0;
  };

  const currentRowCount = getCurrentRowCount() + (data.remarks ? 1 : 0);
  const textLoad =
    (textLength(data.customerName) + textLength(data.contactPerson) + textLength(data.phone) + textLength(data.mobile) + textLength(data.fax)) / 90 +
    (textLength(data.paymentMethod) + textLength(data.deliveryLocation) + textLength(data.salesName) + textLength(data.salesMobile)) / 70 +
    textLength(data.remarks) / 140 +
    (data.quotationType === 'single'
      ? data.items.reduce((sum, item) => {
          return sum
            + textLength(item.jobName) / 45
            + textLength(item.sheetSize) / 55
            + textLength(item.printColor) / 55
            + textLength(item.specialColor) / 70
            + textLength(item.paperName) / 55
            + textLength(item.processingDetails) / 85;
        }, 0)
      : data.bookletJobs.reduce((sum, job) => {
          const partLoad = job.parts.reduce((partSum, part) => {
            return partSum
              + textLength(part.partName) / 45
              + textLength(part.sheetSize) / 55
              + textLength(part.printColor) / 55
              + textLength(part.specialColor) / 70
              + textLength(part.paperName) / 55
              + textLength(part.processingDetails) / 85;
          }, 0);

          return sum
            + textLength(job.jobName) / 45
            + textLength(job.jobSheetSize) / 55
            + textLength(job.bindingMethod) / 70
            + partLoad;
        }, 0));

  return (currentRowCount / (data.quotationType === 'single' ? 6 : 7)) + textLoad;
};

/**
 * 根據密度分數獲取縮放比例
 */
export const getLayoutScales = (densityScore: number): LayoutScales => {
  return {
    layoutScale: clamp(1.3 - densityScore * 0.08, 0.82, 1.26),
    lineScale: clamp(1.13 - densityScore * 0.035, 0.86, 1.12),
    rowScale: clamp(1.12 - densityScore * 0.06, 0.64, 1.1),
  };
};

/**
 * 計算應顯示的空白行數
 */
export const calculateEmptyRowCount = (data: QuotationData): number => {
  const getCurrentRowCount = () => {
    if (data.quotationType === 'single') return data.items.length;
    return data.bookletJobs.reduce((count, job) => {
      const hasHQ = data.quotationType === 'dept' && job.hqQuantity;
      return count + 1 + job.parts.length + (hasHQ ? 1 : 0);
    }, 0);
  };
  const currentRowCount = getCurrentRowCount() + (data.remarks ? 1 : 0);
  // 根據密度分數與當前行數決定空白行數 ( densityScore 暫不直接參與計算，保留介面彈性)
  return clamp(Math.round(2 - currentRowCount * 0.25), 0, 2);
};


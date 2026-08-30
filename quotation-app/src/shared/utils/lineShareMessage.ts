export const buildQuotationShareMessage = (customerName: string, jobName: string): string => {
  return `這是來自捷采印刷的報價單：${customerName || '未命名客戶'} - ${jobName || '未命名印件'}`;
};

/**
 * 取得當前或指定日期的民國日期資訊
 */
export const getMinguoDateInfo = (date: Date = new Date()) => {
  const year = date.getFullYear() - 1911;
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dateStr = `${year}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`;
  
  return { year, month, day, dateStr };
};

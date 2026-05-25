import React from 'react';
import type { QuotationData } from '../types';

interface Props {
  data: QuotationData;
}

const QuotationPreview: React.FC<Props> = ({ data }) => {
  const today = new Date();
  const year = today.getFullYear() - 1911; // 民國年
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const dateStr = `${year}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`;

  // 當資料變更時，自動更新網頁標題
  React.useEffect(() => {
    const customer = data.customerName || '未命名客戶';
    const firstJob = data.quotationType === 'single' ? data.items[0]?.jobName : data.bookletJobs[0]?.jobName;
    document.title = `捷采報價單_${customer}_${firstJob || '報價單'}_${dateStr}`;
  }, [data, dateStr]);

  // 計算總計
  let subtotal = 0;
  if (data.quotationType === 'single') {
    subtotal = data.items.reduce((sum, item) => {
      const qty = parseFloat(item.quantity) || 0;
      const price = parseFloat(item.unitPrice) || 0;
      return sum + Math.round(qty * price);
    }, 0);
  } else if (data.quotationType === 'booklet' || data.quotationType === 'dept') {
    subtotal = data.bookletJobs.reduce((sum, job) => {
      const qty = parseFloat(job.quantity) || 0;
      const price = parseFloat(job.unitPrice) || 0;
      return sum + Math.round(qty * price);
    }, 0);
  }
  
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;

  const formatNumber = (num: number) => {
    return num > 0 ? num.toLocaleString() : '';
  };

  // 計算目前顯示的總列數，用來補足 7 列
  const getCurrentRowCount = () => {
    if (data.quotationType === 'single') return data.items.length;
    if (data.quotationType === 'booklet' || data.quotationType === 'dept') {
      // 每個 Job 佔 1 行(標題) + N 行(Part) + (百貨類可能有的 1 行 HQ量)
      return data.bookletJobs.reduce((count, job) => {
        const hasHQ = data.quotationType === 'dept' && job.hqQuantity;
        return count + 1 + job.parts.length + (hasHQ ? 1 : 0);
      }, 0);
    }
    return 0;
  };

  return (
    <div className="preview-container">
      <div className="company-header">
        <h1 className="company-name">捷 采 印 刷 事 業 (股) 公 司</h1>
        <div className="company-info">
          <p>總公司:台中市西屯區工業區31路1-1號 TEL:04-23580040  FAX:04-23580042</p>
          <p>台北分公司:新北市永和區保生路1號17樓 TEL:02-25792911  FAX:02-25792771</p>
          <p>台南分公司:台南市南區大成路二段10號 TEL:06-2613176  FAX:06-2613176</p>
          <p>高雄分公司:高雄市三min區克武路139號 TEL:07-3852219  FAX:07-3962480</p>
        </div>
        <h2 className="main-title">報 價 單</h2>
      </div>

      <div className="quotation-meta-grid">
        <div className="meta-item"><span className="label">客戶名稱：</span><span className="value">{data.customerName}</span></div>
        <div className="meta-item"><span className="label">聯絡人：</span><span className="value">{data.contactPerson}</span></div>
        <div className="meta-item"><span className="label">電話：</span><span className="value">{data.phone}</span></div>
        <div className="meta-item"><span className="label">行動電話：</span><span className="value">{data.mobile}</span></div>
        <div className="meta-item"><span className="label">傳真：</span><span className="value">{data.fax}</span></div>
        <div className="meta-item"><span className="label">日期：</span><span className="value">{year} 年 {month} 月 {day} 日</span></div>
        <div className="meta-item"><span className="label">訂印日期：</span><span className="value">{data.orderYear || '   '} 年 {data.orderMonth || '  '} 月 {data.orderDay || '  '} 日</span></div>
        <div className="meta-item"><span className="label">交貨日期：</span><span className="value">{data.deliveryYear || '   '} 年 {data.deliveryMonth || '  '} 月 {data.deliveryDay || '  '} 日</span></div>
      </div>
      
      <table className="quotation-table-main">
        <thead>
          <tr>
            <th style={{ width: '15%' }}>印件名稱</th>
            <th style={{ width: '10%' }}>開數</th>
            <th style={{ width: '10%' }}>印色</th>
            <th style={{ width: '15%' }}>用紙</th>
            <th style={{ width: '20%' }}>其他明細</th>
            <th style={{ width: '10%' }}>數量</th>
            <th style={{ width: '10%' }}>單價</th>
            <th style={{ width: '10%' }}>金額</th>
          </tr>
        </thead>
        <tbody>
          {/* 單張類渲染 */}
          {data.quotationType === 'single' && data.items.map((item) => {
            const amount = Math.round((parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0));
            return (
              <tr key={item.id}>
                <td>{item.jobName}</td>
                <td>{item.sheetSize}</td>
                <td>{item.printColor}</td>
                <td>{item.paperName}</td>
                <td className="multi-line">{item.processingDetails}</td>
                <td className="text-center">{item.quantity}{item.unit}</td>
                <td className="text-right">{formatNumber(parseFloat(item.unitPrice) || 0)}</td>
                <td className="text-right">{formatNumber(amount)}</td>
              </tr>
            );
          })}

          {/* 冊子/百貨類渲染 */}
          {(data.quotationType === 'booklet' || data.quotationType === 'dept') && data.bookletJobs.map((job) => {
            const amount = Math.round((parseFloat(job.quantity) || 0) * (parseFloat(job.unitPrice) || 0));
            const hasHQ = data.quotationType === 'dept' && job.hqQuantity;
            const totalRowsForJob = 1 + job.parts.length + (hasHQ ? 1 : 0);
            
            return (
              <React.Fragment key={job.id}>
                {/* 第一列：總摘要 */}
                <tr>
                  <td style={{ fontWeight: 'bold' }}>{job.jobName}</td>
                  <td>{job.jobSheetSize}</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>{job.bindingMethod}</td>
                  <td rowSpan={totalRowsForJob} className="text-center">{job.quantity}{job.unit}</td>
                  <td rowSpan={totalRowsForJob} className="text-right">{formatNumber(parseFloat(job.unitPrice) || 0)}</td>
                  <td rowSpan={totalRowsForJob} className="text-right">{formatNumber(amount)}</td>
                </tr>
                {/* 後續列：詳細結構部分 */}
                {job.parts.map((part) => (
                  <tr key={part.id}>
                    <td className="text-right" style={{ paddingRight: '10pt' }}>{part.partName}</td>
                    <td>{part.sheetSize}</td>
                    <td>{part.printColor}</td>
                    <td>{part.paperName}</td>
                    <td className="multi-line">{part.processingDetails}</td>
                  </tr>
                ))}
                {/* 百貨類專用：總公司量列 */}
                {hasHQ && (
                  <tr>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td className="multi-line" style={{ fontWeight: 'bold' }}>總公司量：{job.hqQuantity}{job.unit}</td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}

          {/* 填充空白列 */}
          {Array.from({ length: Math.max(0, 7 - getCurrentRowCount()) }).map((_, index) => (
            <tr key={`empty-${index}`}>
              <td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>
            </tr>
          ))}

          {/* 備註列 */}
          {data.remarks && (
            <tr>
              <td colSpan={1} style={{ backgroundColor: '#f9f9f9', fontWeight: 'bold', textAlign: 'center' }}>備註</td>
              <td colSpan={7} className="multi-line">{data.remarks}</td>
            </tr>
          )}

          <tr className="total-row">
            <td colSpan={5}>合計 (未稅)</td>
            <td colSpan={3} className="text-right">{formatNumber(subtotal)}</td>
          </tr>
          <tr className="total-row">
            <td colSpan={5}>營業稅 (5%)</td>
            <td colSpan={3} className="text-right">{formatNumber(tax)}</td>
          </tr>
          <tr className="total-row" style={{ fontSize: '14pt' }}>
            <td colSpan={5}>總計 (含稅)</td>
            <td colSpan={3} className="text-right">{formatNumber(total)}</td>
          </tr>
        </tbody>
      </table>

      <div className="quotation-terms-grid">
        <div className="term-row">
          <div className="term-item">印訂日期：{data.orderYear || '      '} 年 {data.orderMonth || '   '} 月 {data.orderDay || '   '} 日</div>
          <div className="term-item">付款辦法：{data.paymentMethod}</div>
        </div>
        <div className="term-row">
          <div className="term-item">交貨日期：{data.deliveryYear || '      '} 年 {data.deliveryMonth || '   '} 月 {data.deliveryDay || '   '} 日</div>
          <div className="term-item">交貨地點：{data.deliveryLocation}</div>
        </div>
      </div>

      <div className="quotation-footer-section">
        <div className="notice">
          <p>※ 備註說明：</p>
          <ol className="custom-notice-list">
            <li>報價有效期間 _______ 天，本報價單經貴我雙方簽章認可後，轉作委印成印契約書。</li>
            <li>若因客戶更改而需重新 or 局部重製作，本公司須追加費用並展延交貨日期。</li>
            <li>本印件之網片，依慣例保存期限以半年為限，逾期本公司得逕行作廢銷毀。</li>
            <li>貴公司委託製作之印刷品，圖片等版權若有問題應自行負責。</li>
            <li>本印件依一般印刷慣例製作，如有涉訟，雙方同意以台中地方法院為管轄法院。</li>
          </ol>
        </div>
        <div className="contract-section">
          <p className="contract-title">立合約書人</p>
          <div className="contract-grid">
            <div className="contract-party">
              <p>甲&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;方：捷采印刷事業(股)公司</p>
              <p>法&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;代：傅 延 本</p>
              <p>住&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;址：台中工業區31路1之1號</p>
              <p>統一編號：23518409</p>
              <p>電&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;話：04-23580040 &nbsp;&nbsp; 傳真：04-23580042</p>
              <p>業務代表：{data.salesName} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 行動電話：{data.salesMobile}</p>
            </div>
            <div className="contract-party"><p>乙&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;方：</p><p>法&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;代：</p><p>住&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;址：</p><p>統一編號：</p><p>電&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;話：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 傳真：</p></div>
          </div>
        </div>
        <div className="doc-footer"><span>JT-QRP-S01-01A1</span><span>保存年限：2年</span></div>
      </div>
    </div>
  );
};

export default QuotationPreview;

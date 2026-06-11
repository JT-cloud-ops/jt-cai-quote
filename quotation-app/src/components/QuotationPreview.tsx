import React from 'react';
import type { QuotationData } from '../types';
import { calculateTotals, calculateDensityScore, getLayoutScales, calculateEmptyRowCount } from '../domain/quotationCalculations';
import { companies } from '../config/companies';
import { formatCurrency } from '../shared/utils/formatCurrency';
import { getMinguoDateInfo } from '../shared/utils/dateUtils';

interface Props {
  data: QuotationData;
}

const QuotationPreview: React.FC<Props> = ({ data }) => {
  const { year, month, day, dateStr } = getMinguoDateInfo();

  // 當資料變更時，自動更新網頁標題
  React.useEffect(() => {
    const customer = data.customerName || '未命名客戶';
    const firstJob = data.quotationType === 'single' ? data.items[0]?.jobName : data.bookletJobs[0]?.jobName;
    document.title = `捷采報價單_${customer}_${firstJob || '報價單'}_${dateStr}`;
  }, [data, dateStr]);

  // 使用抽離的計算邏輯
  const { totalSubtotal, totalTax, grandTotal } = calculateTotals(data);
  const densityScore = calculateDensityScore(data);
  const { layoutScale, lineScale, rowScale } = getLayoutScales(densityScore);
  const emptyRowCount = calculateEmptyRowCount(data);

  const previewStyle = {
    '--layout-scale': layoutScale,
    '--layout-line-scale': lineScale,
    '--layout-row-scale': rowScale,
  } as React.CSSProperties;

  const getCompanyHeader = () => {
    const company = companies[data.companyId] || companies['jie-cai'];
    
    if (data.companyId === 'jie-cai') {
      return (
        <>
          <h1 className="company-name">{company.fullName}</h1>
          <div className="company-info">
            <p>總公司:台中市西屯區工業區31路1-1號 TEL:04-23580040  FAX:04-23580042</p>
            <p>台北分公司:新北市永和區保生路1號17樓 TEL:02-25792911  FAX:02-25792771</p>
            <p>台南分公司:台南市南區大成路二段10號 TEL:06-2613176  FAX:06-2613176</p>
            <p>高雄分公司:高雄市三min區克武路139號 TEL:07-3852219  FAX:07-3962480</p>
          </div>
        </>
      );
    }

    return (
      <>
        <h1 className="company-name">{company.fullName}</h1>
        <div className="company-info" style={{ textAlign: 'center', fontSize: 'calc(11pt * var(--layout-scale))', marginTop: 'calc(10pt * var(--layout-row-scale))' }}>
          <p>{company.address} &nbsp;&nbsp;&nbsp; TEL：{company.phone} {company.fax && `&nbsp;&nbsp;&nbsp; FAX：${company.fax}`}</p>
        </div>
      </>
    );
  };

  const getCompanyFooter = () => {
    const company = companies[data.companyId] || companies['jie-cai'];
    
    const stampImg = (
      <div className="stamp-container">
        <img 
          src={`/jt-cai-quote/stamps/${data.companyId}.png`} 
          alt="發票章" 
          className="company-stamp"
          onError={(e) => {
            const img = e.currentTarget;
            if (img.src.endsWith('.png')) {
              img.src = img.src.replace('.png', '.jpg');
            } else {
              img.style.display = 'none';
            }
          }}
        />
      </div>
    );

    return (
      <div className="contract-party">
        {stampImg}
        <p>甲&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;方：{company.fullName}</p>
        <p>法&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;代：{company.representative || ''}</p>
        <p>住&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;址：{company.address}</p>
        <p>統一編號：{company.taxId || ''}</p>
        <p>電&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;話：{company.phone} &nbsp;&nbsp; {company.fax && `傳真：${company.fax}`}</p>
        <p>業務代表：{data.salesName} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 行動電話：{data.salesMobile}</p>
      </div>
    );
  };

  return (
    <div className="preview-container" style={previewStyle}>
      <div className="preview-body">
      <div className="company-header">
        {getCompanyHeader()}
        <h2 className="main-title">報 價 單</h2>
      </div>

      <div className="quotation-meta-grid">
        <div className="meta-item"><span className="label">客戶名稱：</span><span className="value">{data.customerName}</span></div>
        <div className="meta-item"><span className="label">聯絡人：</span><span className="value">{data.contactPerson}</span></div>
        <div className="meta-item"><span className="label">電話：</span><span className="value">{data.phone}</span></div>
        <div className="meta-item"><span className="label">行動電話：</span><span className="value">{data.mobile}</span></div>
        <div className="meta-item"><span className="label">傳真：</span><span className="value">{data.fax}</span></div>
        <div className="meta-item"><span className="label">日期：</span><span className="value">{year} 年 {month} 月 {day} 日</span></div>
      </div>
      
      <table className="quotation-table-main">
        <colgroup>
          <col className="quote-col-job" />
          <col className="quote-col-size" />
          <col className="quote-col-color" />
          <col className="quote-col-paper" />
          <col className="quote-col-details" />
          <col className="quote-col-quantity" />
          <col className="quote-col-unit-price" />
          <col className="quote-col-amount" />
        </colgroup>
        <thead>
          <tr>
            <th>印件名稱</th>
            <th>開數</th>
            <th>印色</th>
            <th>用紙</th>
            <th>其他明細</th>
            <th>數量</th>
            <th>單價</th>
            <th>金額</th>
          </tr>
        </thead>
        <tbody>
          {/* 單張類渲染 */}
          {data.quotationType === 'single' && data.items.map((item) => {
            const qty = parseFloat(item.quantity) || 0;
            const price = parseFloat(item.unitPrice) || 0;
            const amount = item.manualAmount ? (parseFloat(item.manualAmount) || 0) : Math.round(qty * price);
            
            return (
              <tr key={item.id}>
                <td>{item.jobName}</td>
                <td>{item.sheetSize}</td>
                <td>{item.printColor} {item.specialColor ? `(${item.specialColor})` : ''}</td>
                <td>{item.paperName}</td>
                <td className="multi-line text-center">{item.processingDetails}</td>
                <td className="text-center">{item.quantity ? `${item.quantity}${item.unit}` : ''}</td>
                <td className="text-right">{item.unitPrice ? formatCurrency(price) : ''}</td>
                <td className="text-right">
                  {amount > 0 ? (
                    <>
                      {formatCurrency(amount)}
                      <span style={{ fontSize: 'calc(8pt * var(--layout-scale))', marginLeft: '2pt', display: 'inline-block' }}>
                        {item.taxType === 'include' ? '(含稅)' : '(未稅)'}
                      </span>
                    </>
                  ) : ''}
                </td>
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
                <tr>
                  <td style={{ fontWeight: 'bold' }}>{job.jobName}</td>
                  <td>{job.jobSheetSize}</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td className="multi-line text-center">{job.bindingMethod}</td>
                  <td rowSpan={totalRowsForJob} className="text-center">{job.quantity ? `${job.quantity}${job.unit}` : ''}</td>
                  <td rowSpan={totalRowsForJob} className="text-right">{job.unitPrice ? formatCurrency(parseFloat(job.unitPrice) || 0) : ''}</td>
                  <td rowSpan={totalRowsForJob} className="text-right">
                    {amount > 0 ? (
                      <>
                        {formatCurrency(amount)}
                        <span style={{ fontSize: 'calc(8pt * var(--layout-scale))', marginLeft: '2pt', display: 'inline-block' }}>(未稅)</span>
                      </>
                    ) : ''}
                  </td>
                </tr>
                {job.parts.map((part) => {
                  const hasData = [part.sheetSize, part.printColor, part.specialColor, part.paperName, part.processingDetails].some(val => val && val.trim() !== '');
                  return (
                    <tr key={part.id}>
                      <td className="text-align-right" style={{ paddingRight: '10pt' }}>{hasData ? part.partName : '\u00A0'}</td>
                      <td>{part.sheetSize}</td>
                      <td>{part.printColor} {part.specialColor ? `(${part.specialColor})` : ''}</td>
                      <td>{part.paperName}</td>
                      <td className="multi-line text-center">{part.processingDetails}</td>
                    </tr>
                  );
                })}
                {hasHQ && (
                  <tr>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td className="multi-line text-center" style={{ fontWeight: 'bold' }}>總公司量：{job.hqQuantity}{job.unit}</td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}

          {Array.from({ length: emptyRowCount }).map((_, index) => (
            <tr key={`empty-${index}`}>
              <td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>
            </tr>
          ))}

          {data.remarks && (
            <tr>
              <td colSpan={1} style={{ backgroundColor: '#f9f9f9', fontWeight: 'bold', textAlign: 'center' }}>備註</td>
              <td colSpan={7} className="multi-line text-center">{data.remarks}</td>
            </tr>
          )}

          <tr className="total-row">
            <td colSpan={5}>合計 (未稅)</td>
            <td colSpan={3} className="text-right">{formatCurrency(totalSubtotal)}</td>
          </tr>
          <tr className="total-row">
            <td colSpan={5}>營業稅 (5%)</td>
            <td colSpan={3} className="text-right">{formatCurrency(totalTax)}</td>
          </tr>
          <tr className="total-row" style={{ fontSize: 'calc(14pt * var(--layout-scale))' }}>
            <td colSpan={5}>總計 (含稅)</td>
            <td colSpan={3} className="text-right">{formatCurrency(grandTotal)}</td>
          </tr>
        </tbody>
      </table>

      <div className="quotation-terms-grid">
        <div className="term-row">
          <div className="term-item date-term">
            <span className="term-label">印訂日期：</span>
            <span className="date-value date-year">{data.orderYear}</span>
            <span className="date-unit">年</span>
            <span className="date-value date-month">{data.orderMonth}</span>
            <span className="date-unit">月</span>
            <span className="date-value date-day">{data.orderDay}</span>
            <span className="date-unit">日</span>
          </div>
          <div className="term-item">付款辦法：{data.paymentMethod}</div>
        </div>
        <div className="term-row">
          <div className="term-item date-term">
            <span className="term-label">交貨日期：</span>
            <span className="date-value date-year">{data.deliveryYear}</span>
            <span className="date-unit">年</span>
            <span className="date-value date-month">{data.deliveryMonth}</span>
            <span className="date-unit">月</span>
            <span className="date-value date-day">{data.deliveryDay}</span>
            <span className="date-unit">日</span>
          </div>
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
            {getCompanyFooter()}
            <div className="contract-party"><p>乙&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;方：</p><p>法&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;代：</p><p>住&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;址：</p><p>統一編號：</p><p>電&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;話：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 傳真：</p></div>
          </div>
        </div>
        <div className="doc-footer"><span>JT-QRP-S01-01A1</span><span>保存年限：2年</span></div>
      </div>
    </div>
    </div>
  );
};

export default QuotationPreview;

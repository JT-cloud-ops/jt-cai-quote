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

  const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
  const textLength = (value?: string) => (value?.trim().length ?? 0);

  // 當資料變更時，自動更新網頁標題
  React.useEffect(() => {
    const customer = data.customerName || '未命名客戶';
    const firstJob = data.quotationType === 'single' ? data.items[0]?.jobName : data.bookletJobs[0]?.jobName;
    document.title = `捷采報價單_${customer}_${firstJob || '報價單'}_${dateStr}`;
  }, [data, dateStr]);

  // 定義全局加總變數
  let totalSubtotal = 0; // 未稅合計
  let totalTax = 0;      // 營業稅合計
  let grandTotal = 0;    // 含稅總計

  if (data.quotationType === 'single') {
    data.items.forEach(item => {
      const qty = parseFloat(item.quantity) || 0;
      const price = parseFloat(item.unitPrice) || 0;
      // 優先使用手動輸入的金額，若無則使用自動計算
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

  const formatNumber = (num: number) => {
    return num > 0 ? num.toLocaleString() : '';
  };

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

  const densityScore = (currentRowCount / (data.quotationType === 'single' ? 6 : 7)) + textLoad;
  const layoutScale = clamp(1.3 - densityScore * 0.08, 0.82, 1.26);
  const lineScale = clamp(1.13 - densityScore * 0.035, 0.86, 1.12);
  const rowScale = clamp(1.12 - densityScore * 0.06, 0.64, 1.1);
  const emptyRowCount = clamp(Math.round(2 - currentRowCount * 0.25 - textLoad * 0.5), 0, 2);
  const previewStyle = {
    '--layout-scale': layoutScale,
    '--layout-line-scale': lineScale,
    '--layout-row-scale': rowScale,
  } as React.CSSProperties;

  const getCompanyHeader = () => {
    switch (data.companyId) {
      case 'cai-xin':
        return (
          <>
            <h1 className="company-name">彩鑫印刷事業股份有限公司</h1>
            <div className="company-info" style={{ textAlign: 'center', fontSize: 'calc(11pt * var(--layout-scale))', marginTop: 'calc(10pt * var(--layout-row-scale))' }}>
              <p>臺中市西屯區協和里工業區31路1之5號 &nbsp;&nbsp;&nbsp; TEL：04-23500296 &nbsp;&nbsp;&nbsp; FAX：04-23500288</p>
            </div>
          </>
        );
      case 'health':
        return (
          <>
            <h1 className="company-name">赫爾思科技股份有限公司</h1>
            <div className="company-info" style={{ textAlign: 'center', fontSize: 'calc(11pt * var(--layout-scale))', marginTop: 'calc(10pt * var(--layout-row-scale))' }}>
              <p>臺中市西屯區何成里大祥街12號3樓 &nbsp;&nbsp;&nbsp; TEL：04-37031355</p>
            </div>
          </>
        );
      case 'li-xin':
        return (
          <>
            <h1 className="company-name">栗鑫實業股份有限公司二廠</h1>
            <div className="company-info" style={{ textAlign: 'center', fontSize: 'calc(11pt * var(--layout-scale))', marginTop: 'calc(10pt * var(--layout-row-scale))' }}>
              <p>台中市西屯區工業31路1號 &nbsp;&nbsp;&nbsp; TEL：04-37031299 &nbsp;&nbsp;&nbsp; FAX：04-23599060</p>
            </div>
          </>
        );
      case 'jie-cai':
      default:
        return (
          <>
            <h1 className="company-name">捷 采 印 刷 事 業 (股) 公 司</h1>
            <div className="company-info">
              <p>總公司:台中市西屯區工業區31路1-1號 TEL:04-23580040  FAX:04-23580042</p>
              <p>台北分公司:新北市永和區保生路1號17樓 TEL:02-25792911  FAX:02-25792771</p>
              <p>台南分公司:台南市南區大成路二段10號 TEL:06-2613176  FAX:06-2613176</p>
              <p>高雄分公司:高雄市三min區克武路139號 TEL:07-3852219  FAX:07-3962480</p>
            </div>
          </>
        );
    }
  };

  const getCompanyFooter = () => {
    // 關鍵：使用 PNG 圖檔以實現真正的背景透明
    const stampImg = (
      <div className="stamp-container">
        <img 
          src={`/jt-cai-quote/stamps/${data.companyId}.png`} 
          alt="發票章" 
          className="company-stamp"
          onError={(e) => {
            // 如果 PNG 不存在，嘗試用 JPG
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

    switch (data.companyId) {
      case 'cai-xin':
        return (
          <div className="contract-party">
            {stampImg}
            <p>甲&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;方：彩鑫印刷事業股份有限公司</p>
            <p>法&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;代：</p>
            <p>住&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;址：臺中市西屯區協和里工業區31路1之5號</p>
            <p>統一編號：</p>
            <p>電&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;話：04-23500296 &nbsp;&nbsp; 傳真：04-23500288</p>
            <p>業務代表：{data.salesName} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 行動電話：{data.salesMobile}</p>
          </div>
        );
      case 'health':
        return (
          <div className="contract-party">
            {stampImg}
            <p>甲&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;方：赫爾思科技股份有限公司</p>
            <p>法&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;代：</p>
            <p>住&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;址：臺中市西屯區何成里大祥街12號3樓</p>
            <p>統一編號：</p>
            <p>電&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;話：04-37031355 &nbsp;&nbsp; 傳真：</p>
            <p>業務代表：{data.salesName} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 行動電話：{data.salesMobile}</p>
          </div>
        );
      case 'li-xin':
        return (
          <div className="contract-party">
            {stampImg}
            <p>甲&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;方：栗鑫實業股份有限公司二廠</p>
            <p>法&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;代：</p>
            <p>住&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;址：台中市西屯區工業31路1號</p>
            <p>統一編號：</p>
            <p>電&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;話：04-37031299 &nbsp;&nbsp; 傳真：04-23599060</p>
            <p>業務代表：{data.salesName} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 行動電話：{data.salesMobile}</p>
          </div>
        );
      case 'jie-cai':
      default:
        return (
          <div className="contract-party">
            {stampImg}
            <p>甲&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;方：捷采印刷事業(股)公司</p>
            <p>法&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;代：傅 延 本</p>
            <p>住&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;址：台中工業區31路1之1號</p>
            <p>統一編號：23518409</p>
            <p>電&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;話：04-23580040 &nbsp;&nbsp; 傳真：04-23580042</p>
            <p>業務代表：{data.salesName} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 行動電話：{data.salesMobile}</p>
          </div>
        );
    }
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
                <td className="text-right">{item.unitPrice ? formatNumber(price) : ''}</td>
                <td className="text-right">
                  {amount > 0 ? (
                    <>
                      {formatNumber(amount)}
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
                  <td rowSpan={totalRowsForJob} className="text-right">{job.unitPrice ? formatNumber(parseFloat(job.unitPrice) || 0) : ''}</td>
                  <td rowSpan={totalRowsForJob} className="text-right">
                    {amount > 0 ? (
                      <>
                        {formatNumber(amount)}
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
            <td colSpan={3} className="text-right">{formatNumber(totalSubtotal)}</td>
          </tr>
          <tr className="total-row">
            <td colSpan={5}>營業稅 (5%)</td>
            <td colSpan={3} className="text-right">{formatNumber(totalTax)}</td>
          </tr>
          <tr className="total-row" style={{ fontSize: 'calc(14pt * var(--layout-scale))' }}>
            <td colSpan={5}>總計 (含稅)</td>
            <td colSpan={3} className="text-right">{formatNumber(grandTotal)}</td>
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

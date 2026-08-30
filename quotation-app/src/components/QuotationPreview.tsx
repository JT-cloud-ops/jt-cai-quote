import React from 'react';
import type { QuotationData } from '../types';
import { calculateTotals, calculateDensityScore, getLayoutScales, calculateEmptyRowCount } from '../domain/quotationCalculations';
import { companies } from '../config/companies';
import { formatCurrency } from '../shared/utils/formatCurrency';
import { getMinguoDateInfo } from '../shared/utils/dateUtils';
import { CompanyHeader } from './CompanyHeader';
import { QuotationTable } from './QuotationTable';
import { SingleQuotationRow } from './SingleQuotationRow';
import { BookletQuotationRows } from './BookletQuotationRows';
import { QuotationMetaGrid } from './QuotationMetaGrid';
import { QuotationTermsGrid } from './QuotationTermsGrid';
import { QuotationFooterSection } from './QuotationFooterSection';

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

  return (
    <div className="preview-container" style={previewStyle}>
      <div className="preview-body">
      <div className="company-header">
        <CompanyHeader company={companies[data.companyId] || companies['jie-cai']} isPrimary={data.companyId === 'jie-cai'} />
        <h2 className="main-title">報 價 單</h2>
      </div>

      <QuotationMetaGrid customerName={data.customerName} contactPerson={data.contactPerson} phone={data.phone} mobile={data.mobile} fax={data.fax} dateLabel={`${year} 撟?${month} ??${day} ??`} />

      
      <QuotationTable>
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
          {data.quotationType === 'single' && data.items.map((item) => <SingleQuotationRow key={item.id} item={item} />)}


          {/* 冊子/百貨類渲染 */}
          {data.quotationType === 'booklet' || data.quotationType === 'dept' ? data.bookletJobs.map((job) => <BookletQuotationRows key={job.id} job={job} isDepartment={data.quotationType === 'dept'} />) : null}


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
      </QuotationTable>

      <QuotationTermsGrid orderYear={data.orderYear} orderMonth={data.orderMonth} orderDay={data.orderDay} paymentMethod={data.paymentMethod} deliveryYear={data.deliveryYear} deliveryMonth={data.deliveryMonth} deliveryDay={data.deliveryDay} deliveryLocation={data.deliveryLocation} />


      <QuotationFooterSection company={companies[data.companyId] || companies['jie-cai']} companyId={data.companyId} salesName={data.salesName} salesMobile={data.salesMobile} partyB={data.partyB} />

    </div>
    </div>
  );
};

export default QuotationPreview;

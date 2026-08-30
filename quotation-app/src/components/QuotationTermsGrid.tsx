import React from 'react';
interface Props { orderYear: string; orderMonth: string; orderDay: string; paymentMethod: string; deliveryYear: string; deliveryMonth: string; deliveryDay: string; deliveryLocation: string; }
export const QuotationTermsGrid: React.FC<Props> = (props) => <div className="quotation-terms-grid">
  <div className="term-row"><div className="term-item date-term"><span className="term-label">訂單日期</span><span className="date-value date-year">{props.orderYear}</span><span className="date-unit">年</span><span className="date-value date-month">{props.orderMonth}</span><span className="date-unit">月</span><span className="date-value date-day">{props.orderDay}</span><span className="date-unit">日</span></div><div className="term-item">付款方式：{props.paymentMethod}</div></div>
  <div className="term-row"><div className="term-item date-term"><span className="term-label">交貨日期</span><span className="date-value date-year">{props.deliveryYear}</span><span className="date-unit">年</span><span className="date-value date-month">{props.deliveryMonth}</span><span className="date-unit">月</span><span className="date-value date-day">{props.deliveryDay}</span><span className="date-unit">日</span></div><div className="term-item">交貨地點：{props.deliveryLocation}</div></div>
</div>;
export default QuotationTermsGrid;

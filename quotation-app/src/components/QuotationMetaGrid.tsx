import React from 'react';
interface Props { customerName: string; contactPerson: string; phone: string; mobile: string; fax: string; dateLabel: string; }
export const QuotationMetaGrid: React.FC<Props> = ({ customerName, contactPerson, phone, mobile, fax, dateLabel }) => <div className="quotation-meta-grid">
  <div className="meta-item"><span className="label">客戶名稱</span><span className="value">{customerName}</span></div><div className="meta-item"><span className="label">聯絡人</span><span className="value">{contactPerson}</span></div><div className="meta-item"><span className="label">電話</span><span className="value">{phone}</span></div><div className="meta-item"><span className="label">行動電話</span><span className="value">{mobile}</span></div><div className="meta-item"><span className="label">傳真</span><span className="value">{fax}</span></div><div className="meta-item"><span className="label">報價日期</span><span className="value">{dateLabel}</span></div>
</div>;
export default QuotationMetaGrid;

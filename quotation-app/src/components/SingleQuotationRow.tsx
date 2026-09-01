import React from 'react';
import type { QuotationItem } from '../types';
import { formatCurrency } from '../shared/utils/formatCurrency';
import { formatPrintColor } from '../shared/utils/printColor';

interface Props { item: QuotationItem; }

export const SingleQuotationRow: React.FC<Props> = ({ item }) => {
  const qty = parseFloat(item.quantity) || 0;
  const price = parseFloat(item.unitPrice) || 0;
  const amount = item.manualAmount ? (parseFloat(item.manualAmount) || 0) : Math.round(qty * price);
  return <tr>
    <td className="quote-cell-center-wrap">{item.jobName}</td><td className="quote-cell-center-wrap">{item.sheetSize}</td>
    <td className="quote-cell-center-wrap">{formatPrintColor(item.printColor, item.reverseColor, item.specialColor)}</td>
    <td className="quote-cell-center-wrap">{item.paperName}</td><td className="quote-cell-center-wrap multi-line">{item.processingDetails}</td>
    <td className="quote-cell-center-wrap">{item.quantity ? `${item.quantity}${item.unit}` : ''}</td>
    <td className="quote-cell-center-wrap">{item.unitPrice ? formatCurrency(price) : ''}</td>
    <td className="quote-cell-center-wrap">{amount > 0 ? <>{formatCurrency(amount)}<span style={{ fontSize: 'calc(8pt * var(--layout-scale))', marginLeft: '2pt', display: 'inline-block' }}>{item.taxType === 'include' ? '(含稅)' : '(未稅)'}</span></> : ''}</td>
  </tr>;
};

export default SingleQuotationRow;

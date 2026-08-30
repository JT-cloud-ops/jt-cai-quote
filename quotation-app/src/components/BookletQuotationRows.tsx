import React from 'react';
import type { BookletJob } from '../types';
import { formatCurrency } from '../shared/utils/formatCurrency';
import { formatPrintColor } from '../shared/utils/printColor';

interface Props { job: BookletJob; isDepartment: boolean; }

export const BookletQuotationRows: React.FC<Props> = ({ job, isDepartment }) => {
  const amount = Math.round((parseFloat(job.quantity) || 0) * (parseFloat(job.unitPrice) || 0));
  const hasHQ = isDepartment && job.hqQuantity;
  const totalRowsForJob = 1 + job.parts.length + (hasHQ ? 1 : 0);
  return <React.Fragment>
    <tr><td className="quote-cell-center-wrap" style={{ fontWeight: 'bold' }}>{job.jobName}</td><td className="quote-cell-center-wrap">{job.jobSheetSize}</td><td className="quote-cell-center-wrap">&nbsp;</td><td className="quote-cell-center-wrap">&nbsp;</td><td className="quote-cell-center-wrap multi-line">{job.bindingMethod}</td><td rowSpan={totalRowsForJob} className="quote-cell-center-wrap">{job.quantity ? `${job.quantity}${job.unit}` : ''}</td><td rowSpan={totalRowsForJob} className="quote-cell-center-wrap">{job.unitPrice ? formatCurrency(parseFloat(job.unitPrice) || 0) : ''}</td><td rowSpan={totalRowsForJob} className="quote-cell-center-wrap">{amount > 0 ? <>{formatCurrency(amount)}<span style={{ fontSize: 'calc(8pt * var(--layout-scale))', marginLeft: '2pt', display: 'inline-block' }}>(?芰?)</span></> : ''}</td></tr>
    {job.parts.map((part) => { const hasData = [part.sheetSize, part.printColor, part.reverseColor, part.specialColor, part.paperName, part.processingDetails].some(val => val && val.trim() !== ''); return <tr key={part.id}><td className="quote-part-name-cell" style={{ paddingRight: '10pt' }}>{hasData ? part.partName : '\u00A0'}</td><td className="quote-cell-center-wrap">{part.sheetSize}</td><td className="quote-cell-center-wrap">{formatPrintColor(part.printColor, part.reverseColor, part.specialColor)}</td><td className="quote-cell-center-wrap">{part.paperName}</td><td className="quote-cell-center-wrap multi-line">{part.processingDetails}</td></tr>; })}
    {hasHQ && <tr><td className="quote-cell-center-wrap">&nbsp;</td><td className="quote-cell-center-wrap">&nbsp;</td><td className="quote-cell-center-wrap">&nbsp;</td><td className="quote-cell-center-wrap">&nbsp;</td><td className="multi-line text-center" style={{ fontWeight: 'bold' }}>蝮賢?賊?嚗{job.hqQuantity}{job.unit}</td></tr>}
  </React.Fragment>;
};

export default BookletQuotationRows;

import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { SingleQuotationRow } from './SingleQuotationRow';
import { BookletQuotationRows } from './BookletQuotationRows';
import type { BookletJob, QuotationItem } from '../types';

const item: QuotationItem = { id: 'i1', jobName: '名片', sheetSize: 'A4', printColor: '四色', reverseColor: '', specialColor: '', paperName: '銅版紙', processingDetails: '', quantity: '10', unit: '張', unitPrice: '20', taxType: 'exclude', manualAmount: '' };
const job: BookletJob = { id: 'j1', jobName: '手冊', jobSheetSize: 'A4', bindingMethod: '膠裝', quantity: '2', unit: '本', unitPrice: '100', hqQuantity: '', parts: [] };

describe('quotation row components', () => {
  it('renders a single quotation row', () => {
    const html = renderToStaticMarkup(<table><tbody><SingleQuotationRow item={item} /></tbody></table>);
    expect(html).toContain('名片');
    expect(html).toContain('200');
  });

  it('renders booklet rows with the expected row span', () => {
    const html = renderToStaticMarkup(<table><tbody><BookletQuotationRows job={job} isDepartment={false} /></tbody></table>);
    expect(html).toContain('手冊');
    expect(html).toContain('rowSpan="1"');
  });
});

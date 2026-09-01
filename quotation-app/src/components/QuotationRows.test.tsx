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

  it('renders readable tax labels for single and booklet rows', () => {
    const includeHtml = renderToStaticMarkup(<table><tbody><SingleQuotationRow item={{ ...item, taxType: 'include', manualAmount: '200' }} /></tbody></table>);
    const excludeHtml = renderToStaticMarkup(<table><tbody><SingleQuotationRow item={{ ...item, taxType: 'exclude', manualAmount: '200' }} /></tbody></table>);
    const bookletHtml = renderToStaticMarkup(<table><tbody><BookletQuotationRows job={{ ...job, quantity: '1', unitPrice: '200' }} isDepartment={false} /></tbody></table>);
    expect(includeHtml).toContain('(含稅)');
    expect(excludeHtml).toContain('(未稅)');
    expect(bookletHtml).toContain('(未稅)');
    expect(includeHtml).not.toContain('?');
    expect(bookletHtml).not.toContain('?');
  });

  it('renders booklet rows with the expected row span', () => {
    const html = renderToStaticMarkup(<table><tbody><BookletQuotationRows job={job} isDepartment={false} /></tbody></table>);
    expect(html).toContain('手冊');
    expect(html).toContain('rowSpan="1"');
  });
});

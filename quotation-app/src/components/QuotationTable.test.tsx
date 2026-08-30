import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { QuotationTable } from './QuotationTable';

describe('QuotationTable', () => {
  it('renders the quotation table boundary and preserves its content', () => {
    const html = renderToStaticMarkup(
      <QuotationTable>
        <tbody><tr><td>測試明細</td></tr></tbody>
      </QuotationTable>,
    );

    expect(html).toContain('quotation-table-main');
    expect(html).toContain('測試明細');
  });
});

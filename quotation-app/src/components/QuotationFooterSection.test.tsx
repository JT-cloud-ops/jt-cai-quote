import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { QuotationFooterSection } from './QuotationFooterSection';
import { companies } from '../config/companies';

describe('QuotationFooterSection', () => {
  it('renders notices and both contract parties', () => {
    const html = renderToStaticMarkup(<QuotationFooterSection company={companies['jie-cai']} companyId="jie-cai" salesName="業務" salesMobile="0900" partyB={{ name: '乙方', representative: '', address: '', taxId: '', phone: '', fax: '', contactPerson: '', mobile: '' }} />);
    expect(html).toContain('quotation-footer-section');
    expect(html).toContain('注意事項');
    expect(html).toContain('請確認報價內容');
    expect(html).not.toContain('勗');
    expect(html).toContain('業務');
  });
});

import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { QuotationMetaGrid } from './QuotationMetaGrid';
import { QuotationTermsGrid } from './QuotationTermsGrid';

describe('quotation meta and terms components', () => {
  it('renders customer metadata', () => {
    const html = renderToStaticMarkup(<QuotationMetaGrid customerName="甲公司" contactPerson="王小明" phone="02" mobile="09" fax="03" dateLabel="115 年 8 月 28 日" />);
    expect(html).toContain('甲公司');
    expect(html).toContain('115 年 8 月 28 日');
  });

  it('renders order and delivery terms', () => {
    const html = renderToStaticMarkup(<QuotationTermsGrid orderYear="115" orderMonth="8" orderDay="28" paymentMethod="月結" deliveryYear="115" deliveryMonth="9" deliveryDay="1" deliveryLocation="台中" />);
    expect(html).toContain('月結');
    expect(html).toContain('台中');
  });
});

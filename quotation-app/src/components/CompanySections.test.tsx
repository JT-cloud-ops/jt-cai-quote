import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { companies } from '../config/companies';
import { CompanyHeader } from './CompanyHeader';
import { CompanyFooter } from './CompanyFooter';

describe('company preview sections', () => {
  it('renders primary company header branches and contact lines', () => {
    const markup = renderToStaticMarkup(<CompanyHeader company={companies['jie-cai']} isPrimary />);
    expect(markup).toContain('捷采印刷事業');
    expect(markup).toContain('總公司:台中市西屯區工業區31路1-1號');
  });

  it('renders footer company information and sales contact', () => {
    const markup = renderToStaticMarkup(<CompanyFooter company={companies['jie-cai']} companyId="jie-cai" salesName="王業務" salesMobile="0912" />);
    expect(markup).toContain('統一編號：23518409');
    expect(markup).toContain('業務代表：王業務');
    expect(markup).toContain('行動電話：0912');
  });
});

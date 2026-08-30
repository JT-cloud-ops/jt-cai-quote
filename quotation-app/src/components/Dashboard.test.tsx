import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import Dashboard from './Dashboard';

describe('Dashboard version label', () => {
  it('shows the current handoff version beside the main menu title', () => {
    const html = renderToStaticMarkup(
      <Dashboard
        companyId="jie-cai"
        salesName=""
        salesMobile=""
        onCompanyChange={() => undefined}
        onSalesChange={() => undefined}
        onSelectType={() => undefined}
      />,
    );

    expect(html).toContain('v2026.08.30');
  });
});

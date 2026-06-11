import { readFileSync } from 'node:fs';

const form = readFileSync(new URL('../src/components/QuotationForm.tsx', import.meta.url), 'utf8');
const formCss = readFileSync(new URL('../src/styles/Form.css', import.meta.url), 'utf8');
const preview = readFileSync(new URL('../src/components/QuotationPreview.tsx', import.meta.url), 'utf8');
const previewCss = readFileSync(new URL('../src/styles/Preview.css', import.meta.url), 'utf8');

const checks = [
  {
    name: 'JPG export button uses clear transfer wording',
    pass: form.includes("轉存圖檔 (JPG)"),
  },
  {
    name: 'JPG export button keeps a green visual treatment',
    pass: /\.share-btn\s*{[^}]*background:\s*(?:#00b900|linear-gradient\([^;]*#00b900)/s.test(formCss),
  },
  {
    name: 'long quotations can scale below 90%',
    pass: /const layoutScale = clamp\([^,]+,\s*0\.8[0-9]\s*,\s*1\.26\)/.test(preview),
  },
  {
    name: 'print table rows can shrink for dense content',
    pass: /height:\s*calc\(22pt \* var\(--layout-row-scale\)\)/.test(previewCss),
  },
  {
    name: 'print layout avoids forced footer block overflow',
    pass: /page-break-inside:\s*auto/.test(previewCss),
  },
];

const failed = checks.filter((check) => !check.pass);

if (failed.length > 0) {
  console.error('Print layout checks failed:');
  for (const check of failed) {
    console.error(`- ${check.name}`);
  }
  process.exit(1);
}

console.log(`Print layout checks passed: ${checks.length}/${checks.length}`);

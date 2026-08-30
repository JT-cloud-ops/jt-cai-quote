import { readFileSync } from 'node:fs';

const form = readFileSync(new URL('../src/components/QuotationForm.tsx', import.meta.url), 'utf8');
const actions = readFileSync(new URL('../src/components/QuotationActions.tsx', import.meta.url), 'utf8');
const formCss = readFileSync(new URL('../src/styles/Form.css', import.meta.url), 'utf8');
const domain = readFileSync(new URL('../src/domain/quotationCalculations.ts', import.meta.url), 'utf8');
const previewCss = readFileSync(new URL('../src/styles/Preview.css', import.meta.url), 'utf8');
const preview = readFileSync(new URL('../src/components/QuotationPreview.tsx', import.meta.url), 'utf8');
const singleRow = readFileSync(new URL('../src/components/SingleQuotationRow.tsx', import.meta.url), 'utf8');
const bookletRows = readFileSync(new URL('../src/components/BookletQuotationRows.tsx', import.meta.url), 'utf8');
const singleSheetForm = readFileSync(new URL('../src/components/forms/SingleSheetForm.tsx', import.meta.url), 'utf8');
const bookletForm = readFileSync(new URL('../src/components/forms/BookletForm.tsx', import.meta.url), 'utf8');
const printColorFields = readFileSync(new URL('../src/components/forms/PrintColorFields.tsx', import.meta.url), 'utf8');
const printColorUtils = readFileSync(new URL('../src/shared/utils/printColor.ts', import.meta.url), 'utf8');

const checks = [
  {
    name: 'JPG export button uses clear transfer wording',
    pass: actions.includes('export-img-btn') && actions.includes('(JPG)'),
  },
  {
    name: 'JPG export button keeps a green visual treatment',
    pass: /\.export-img-btn\s*{[^}]*background:\s*(?:#00b900|linear-gradient\([^;]*#00b900)/s.test(formCss),
  },
  {
    name: 'long quotations can scale below 90%',
    pass: /layoutScale: clamp\([^,]+,\s*0\.8[0-9]\s*,\s*1\.26\)/.test(domain),
  },
  {
    name: 'print table rows can shrink for dense content',
    pass: /height:\s*calc\(22pt \* var\(--layout-row-scale\)\)/.test(previewCss),
  },
  {
    name: 'print layout avoids forced footer block overflow',
    pass: /page-break-inside:\s*auto/.test(previewCss),
  },
  {
    name: 'quotation body cells use centered wrapping class',
    pass: singleRow.includes('quote-cell-center-wrap') && bookletRows.includes('quote-cell-center-wrap'),
  },
  {
    name: 'booklet and department part-name cells keep a right-aligned exception',
    pass: bookletRows.includes('quote-part-name-cell'),
  },
  {
    name: 'centered wrapping cells allow automatic wrapping',
    pass: /\.quotation-table-main td\.quote-cell-center-wrap\s*{[^}]*white-space:\s*pre-wrap[^}]*overflow-wrap:\s*anywhere/s.test(previewCss),
  },
  {
    name: 'part-name cells are explicitly right aligned',
    pass: /\.quotation-table-main td\.quote-part-name-cell\s*{[^}]*text-align:\s*right/s.test(previewCss),
  },
  {
    name: 'single sheet form uses shared print color selectors',
    pass: singleSheetForm.includes('<PrintColorFields'),
  },
  {
    name: 'booklet form uses shared print color selectors',
    pass: bookletForm.includes('<PrintColorFields'),
  },
  {
    name: 'print color selector keeps front reverse and special fields visible',
    pass: printColorFields.includes('印色(正)') && printColorFields.includes('印色(反)') && printColorFields.includes('特別色'),
  },
  {
    name: 'sheet size reminder is present',
    pass: singleSheetForm.includes('沒有開數時請輸入成品公分數') || bookletForm.includes('沒有開數時請輸入成品公分數'),
  },
  {
    name: 'print color formatter includes front reverse and special text',
    pass: printColorUtils.includes('formatPrintColor') && printColorUtils.includes('正${front}') && printColorUtils.includes('反${back}') && printColorUtils.includes('特別色${special}'),
  },
  {
    name: 'preview uses formatted print color output',
    pass: singleRow.includes('formatPrintColor(item.printColor, item.reverseColor, item.specialColor)') && bookletRows.includes('formatPrintColor(part.printColor, part.reverseColor, part.specialColor)'),
  },
  {
    name: 'print color selector no longer exposes prompt choices',
    pass: !printColorFields.includes('不印刷或繼續選印色') && !printColorFields.includes('繼續選印色'),
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

import { describe, expect, it } from 'vitest';
import {
  createEmptyBookletJob,
  createEmptyBookletPart,
  createEmptyItem,
  createEmptyQuotation,
} from './quotationFactory';

describe('quotationFactory', () => {
  it('creates an empty item with the form defaults', () => {
    const item = createEmptyItem();

    expect(item).toMatchObject({
      jobName: '',
      unit: '份',
      taxType: 'exclude',
      manualAmount: '',
    });
    expect(item.id).toEqual(expect.any(String));
  });

  it('creates named booklet parts and a booklet job with three default parts', () => {
    const part = createEmptyBookletPart('封面');
    const job = createEmptyBookletJob();

    expect(part).toMatchObject({ partName: '封面', sheetSize: '', paperName: '' });
    expect(job).toMatchObject({ jobName: '', unit: '本', hqQuantity: '' });
    expect(job.parts.map(({ partName }) => partName)).toEqual(['封面', '扉頁', '內頁']);
    expect(new Set([job.id, ...job.parts.map(({ id }) => id)]).size).toBe(4);
  });

  it.each([
    ['single', 1, 0],
    ['booklet', 0, 1],
    ['dept', 0, 1],
  ] as const)('creates %s quotation collections', (type, itemCount, jobCount) => {
    const quotation = createEmptyQuotation(type);

    expect(quotation.quotationType).toBe(type);
    expect(quotation.items).toHaveLength(itemCount);
    expect(quotation.bookletJobs).toHaveLength(jobCount);
    expect(quotation.partyB.name).toBe('');
  });

  it('uses saved company and sales defaults when available', () => {
    const storage = {
      getItem: (key: string) => ({
        lastCompanyId: 'saved-company',
        lastSalesName: '王業務',
        lastSalesMobile: '0912-345-678',
      }[key] ?? null),
    };
    Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: storage });

    expect(createEmptyQuotation()).toMatchObject({
      companyId: 'saved-company',
      salesName: '王業務',
      salesMobile: '0912-345-678',
    });
  });
});

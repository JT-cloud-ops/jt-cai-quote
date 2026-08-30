import { beforeEach, describe, expect, it } from 'vitest';
import type { Customer, Party, QuotationData } from '../types';
import {
  getLastCompanyId,
  getLastSalesMobile,
  getLastSalesName,
  getQuotationHistory,
  loadCustomers,
  loadPartyBRecords,
  saveCustomers,
  savePartyBRecords,
  saveQuotationHistory,
  clearLocalData,
  setLastCompanyId,
  setLastSalesMobile,
  setLastSalesName,
} from './localStorageRepository';

const store = new Map<string, string>();
const storage = {
  getItem: (key: string) => store.get(key) ?? null,
  setItem: (key: string, value: string) => store.set(key, value),
  removeItem: (key: string) => store.delete(key),
  clear: () => store.clear(),
};

describe('localStorageRepository', () => {
  beforeEach(() => {
    store.clear();
    Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: storage });
  });

  it('round-trips customers and party B records as JSON', () => {
    const customer = { name: '甲', contactPerson: '', phone: '', mobile: '', fax: '', deliveryLocation: '' } satisfies Customer;
    const partyB = { name: '乙', representative: '', address: '', taxId: '', phone: '', fax: '', contactPerson: '', mobile: '' } satisfies Party;

    saveCustomers([customer]);
    savePartyBRecords([partyB]);

    expect(loadCustomers()).toEqual([customer]);
    expect(loadPartyBRecords()).toEqual([partyB]);
  });

  it('returns empty collections for invalid or missing JSON', () => {
    store.set('customerDatabase', '{bad');
    store.set('partyBDatabase', JSON.stringify({ nope: true }));
    store.set('quotationHistory', JSON.stringify(['not-an-object']));

    expect(loadCustomers()).toEqual([]);
    expect(loadPartyBRecords()).toEqual([]);
    expect(getQuotationHistory()).toEqual([]);
  });

  it('limits saved quotation history to the newest 20 records', () => {
    const records = Array.from({ length: 21 }, (_, index) => ({
      id: String(index), timestamp: '', title: `報價 ${index}`, data: {} as QuotationData,
    }));

    saveQuotationHistory(records);

    expect(getQuotationHistory()).toHaveLength(20);
    expect(getQuotationHistory()[0].id).toBe('0');
    expect(getQuotationHistory().at(-1)?.id).toBe('19');
  });

  it('reads and writes last-used preferences with fallbacks', () => {
    expect(getLastCompanyId()).toBe('jie-cai');
    expect(getLastSalesName()).toBe('');
    expect(getLastSalesMobile()).toBe('');

    setLastCompanyId('saved-company');
    setLastSalesName('王業務');
    setLastSalesMobile('0912');

    expect(getLastCompanyId()).toBe('saved-company');
    expect(getLastSalesName()).toBe('王業務');
    expect(getLastSalesMobile()).toBe('0912');
  });

  it('clears all quotation data without affecting unrelated keys', () => {
    store.set('quotationHistory', '[]');
    store.set('customerDatabase', '[]');
    store.set('partyBDatabase', '[]');
    store.set('lastCompanyId', 'company');
    store.set('lastSalesName', 'sales');
    store.set('lastSalesMobile', '0912');
    store.set('unrelated', 'keep');

    clearLocalData();

    expect(store.has('quotationHistory')).toBe(false);
    expect(store.has('customerDatabase')).toBe(false);
    expect(store.has('partyBDatabase')).toBe(false);
    expect(store.has('lastCompanyId')).toBe(false);
    expect(store.has('lastSalesName')).toBe(false);
    expect(store.has('lastSalesMobile')).toBe(false);
    expect(store.get('unrelated')).toBe('keep');
  });
});
